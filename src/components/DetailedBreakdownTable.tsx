/*
 * ⚠️  IMPORTANT CSS RULES FOR AI AGENTS ⚠️
 *
 * 1. NEVER use CSS !important declarations except for:
 *    - Completely hiding elements (display: none !important)
 *    - Print media styles (for paper printing)
 *
 * 2. NEVER use inline style="" attributes on HTML elements
 *    - All styling MUST be via dedicated CSS files
 *    - Use CSS Modules for component-specific styles
 *                              </div>
                                       </div>
                          <div className={styles.categoryDescription}>
                            {getASDLevel(getPreviewValue(category.id, 'stressed', stressedImpact))}
                          </div>         <div className={styles.categoryDescription}>
                            {getASDLevel(getPreviewValue(category.id, 'typical', typicalImpact))}
                          </div>e global.css for shared design tokens
 *
 * Violation of these rules is STRICTLY FORBIDDEN.
 */

// Detailed breakdown table component following Single Responsibility Principle
// Displays all categories with their data in a structured table format

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useAppContext } from '../state/AppContext';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './DetailedBreakdownTable.module.css';

// Helper function to darken a hex color (matches CircularDiagram logic)
const darkenColor = (hexColor: string, amount: number = 0.3): string => {
  // Remove the # if present
  const color = hexColor.replace('#', '');

  // Parse the RGB values
  const num = parseInt(color, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // Darken each component
  const darkenedR = Math.floor(r * (1 - amount));
  const darkenedG = Math.floor(g * (1 - amount));
  const darkenedB = Math.floor(b * (1 - amount));

  // Convert back to hex
  return `#${((darkenedR << 16) | (darkenedG << 8) | darkenedB).toString(16).padStart(6, '0')}`;
};

// Sorting types and state
type SortColumn = 'category' | 'typical' | 'stressed';
type SortDirection = 'asc' | 'desc';

function DetailedBreakdownTable(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const { categories, profile, settings } = state;

  // Sorting state - default to Under Stress Impact descending
  const [sortColumn, setSortColumn] = useState<SortColumn>('stressed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Editing state - track which cell is being edited
  const [editingCell, setEditingCell] = useState<{ categoryId: string; type: 'typical' | 'stressed' } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Helper function to update impact values with conflict resolution
  const updateImpactValue = (categoryId: string, type: 'typical' | 'stressed', newValue: number) => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;

    const currentSelections = profile.selections[categoryIndex] || [];
    let newSelections = [...currentSelections];

    // Ensure array has at least 2 elements for both typical and stressed values
    while (newSelections.length < 2) {
      newSelections.push(0);
    }

    if (type === 'typical') {
      // Updating typical impact
      if (newValue === 0) {
        // Remove typical impact - this means remove everything since typical must always exist if stressed exists
        newSelections = [];
      } else {
        newSelections[0] = newValue;
        // If stressed value exists and is less than or equal to new typical value, update it
        if (newSelections[1] > 0 && newSelections[1] <= newValue) {
          const requiredStressedValue = newValue + 1;
          if (requiredStressedValue > 10) {
            // Can't set stressed value above 10, so remove it entirely
            // Keep only the typical value
            newSelections = [newValue];
          } else {
            newSelections[1] = requiredStressedValue; // Stressed must be at least 1 higher than typical
          }
        }
      }
    } else {
      // Updating stressed impact
      if (newValue <= 1) {
        // If user tries to set stressed to 1 or less, remove stressed impact entirely
        // Keep only typical impact
        newSelections = newSelections[0] > 0 ? [newSelections[0]] : [];
      } else {
        // Valid stressed impact (2 or higher)
        if (newSelections[0] === 0) {
          // If no typical value exists, set it to be 1 less than stressed (minimum 1)
          newSelections[0] = Math.max(1, newValue - 1);
        } else if (newValue <= newSelections[0]) {
          // If stressed is not higher than typical, adjust typical to be 1 less
          newSelections[0] = Math.max(1, newValue - 1);
        }
        // Set the stressed value
        newSelections[1] = newValue;
      }
    }

    // Clean up the array: remove any 0 values and ensure proper structure
    // Filter out zeros and ensure we don't have trailing zeros
    const cleanedSelections = newSelections.filter((val, index) => {
      // Keep non-zero values
      if (val > 0) return true;
      // For zero values: only keep if there are non-zero values after this index
      return newSelections.slice(index + 1).some(v => v > 0);
    });

    // Dispatch the update
    dispatch({
      type: 'UPDATE_SELECTION',
      payload: { sliceIndex: categoryIndex.toString(), values: cleanedSelections }
    });
  };

  // Handle editing start
  const startEditing = (categoryId: string, type: 'typical' | 'stressed', currentValue: number) => {
    setEditingCell({ categoryId, type });
    setEditValue(currentValue.toString());
  };

  // Handle editing finish
  const finishEditing = () => {
    if (editingCell) {
      const newValue = parseInt(editValue);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 10) {
        updateImpactValue(editingCell.categoryId, editingCell.type, newValue);
      }
    }
    setEditingCell(null);
    setEditValue('');
  };

  // Handle input validation for edit values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string for clearing
    if (value === '') {
      setEditValue('');
      return;
    }

    // Only allow digits
    if (!/^\d+$/.test(value)) {
      return; // Don't update if non-digits are entered
    }

    // Convert to number
    const numValue = parseInt(value);

    // If it's a valid single digit (0-9), allow it
    if (value.length === 1) {
      setEditValue(value);
    }
    // If it's two digits, only allow 10
    else if (value.length === 2) {
      if (numValue === 10) {
        setEditValue('10');
      } else {
        // If user typed something like 11, 12, etc., keep only the first digit
        setEditValue(value.charAt(0));
      }
    }
    // Don't allow more than 2 digits
  };

  // Handle key press in editing input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  // Handle creating a new impact value when clicking on empty cell
  const createNewImpactValue = (categoryId: string, type: 'typical' | 'stressed') => {
    if (type === 'typical') {
      // For typical impact, always start with 1
      updateImpactValue(categoryId, 'typical', 1);
      startEditing(categoryId, 'typical', 1);
    } else if (type === 'stressed') {
      // For stressed impact, only allow if typical impact exists
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex === -1) return;

      const currentSelections = profile.selections[categoryIndex] || [];
      const typicalImpact = currentSelections[0] || 0;

      if (typicalImpact > 0) {
        // Start stress value 1 higher than typical (max 10)
        const initialStressValue = Math.min(typicalImpact + 1, 10);
        updateImpactValue(categoryId, 'stressed', initialStressValue);
        startEditing(categoryId, 'stressed', initialStressValue);
      }
    }
  };

  // Get the value to display for support needs (either current edit value or saved value)
  const getPreviewValue = (categoryId: string, type: 'typical' | 'stressed', savedValue: number): number => {
    if (editingCell?.categoryId === categoryId && editingCell?.type === type) {
      // Handle empty string as 0 (no support needs)
      if (editValue === '') {
        return 0;
      }
      const previewValue = parseInt(editValue);
      return !isNaN(previewValue) && previewValue >= 0 && previewValue <= 10 ? previewValue : savedValue;
    }
    return savedValue;
  };

  // Handle column header clicks for sorting
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Same column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Different column, set new column with appropriate default direction
      setSortColumn(column);
      setSortDirection(column === 'category' ? 'asc' : 'desc');
    }
  };

  // Prepare data with sorting values
  const tableData = useMemo(() => {
    return categories.map((category, index) => {
      const selectionValues = profile.selections[index] || [];
      const typicalImpact = selectionValues.length > 0 ? selectionValues[0] : 0;
      const stressedImpact = selectionValues.length > 1 ? selectionValues[1] : 0;

      // For sorting purposes, use typical impact when stressed impact is missing
      const stressedImpactForSorting = stressedImpact > 0 ? stressedImpact : typicalImpact;

      return {
        category,
        index,
        typicalImpact,
        stressedImpact,
        stressedImpactForSorting
      };
    });
  }, [categories, profile.selections]);

  // Apply sorting
  const sortedData = useMemo(() => {
    const sorted = [...tableData].sort((a, b) => {
      let compareValue = 0;

      switch (sortColumn) {
        case 'category':
          compareValue = a.category.name.localeCompare(b.category.name);
          break;
        case 'typical':
          compareValue = a.typicalImpact - b.typicalImpact;
          break;
        case 'stressed':
          // Use the sorting value that includes typical impact fallback
          compareValue = a.stressedImpactForSorting - b.stressedImpactForSorting;
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [tableData, sortColumn, sortDirection]);

  // Check if any stress impact values exist
  const hasAnyStressValues = useMemo(() => {
    return tableData.some(item => item.stressedImpact > 0);
  }, [tableData]);

  // Render sort icon for column headers
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <span className={styles.sortIconPlaceholder}></span>;
    }

    return sortDirection === 'asc' ?
      <ChevronUp className={styles.sortIcon} /> :
      <ChevronDown className={styles.sortIcon} />;
  };

  const getASDLevel = (value: number): JSX.Element | null => {
    if (value >= 1 && value <= 4) {
      return (
        <>
          Occasional Support<br />
          Needs
        </>
      );
    } else if (value >= 5 && value <= 7) {
      return (
        <>
          Frequent Support<br />
          Needs
        </>
      );
    } else if (value >= 8 && value <= 10) {
      return (
        <>
          Consistent Support<br />
          Needs
        </>
      );
    }
    return null;
  };

  // The detailed breakdown table should always show impact values regardless of diagram display settings
  const shouldShowNumbers = true;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detailed Breakdown</h2>
      <div className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHeader className={styles.tableHeader}>
            <TableRow>
              <TableHead
                className={`${styles.tableHead} ${styles.sortableHeader}`}
                onClick={() => handleSort('category')}
              >
                <div className={styles.headerContentCenter}>
                  <span>Category</span>
                  {renderSortIcon('category')}
                </div>
              </TableHead>
              {shouldShowNumbers && (
                <TableHead
                  className={`${styles.tableHead} ${styles.tableCellCenter} ${styles.sortableHeader}`}
                  onClick={() => handleSort('typical')}
                >
                  <div className={styles.headerContentCenter}>
                    <span className={styles.multiLineHeader}>
                      Typical<br />Impact
                    </span>
                    {renderSortIcon('typical')}
                  </div>
                </TableHead>
              )}
              {shouldShowNumbers && hasAnyStressValues && (
                <TableHead
                  className={`${styles.tableHead} ${styles.tableCellCenter} ${styles.sortableHeader}`}
                  onClick={() => handleSort('stressed')}
                >
                  <div className={styles.headerContentCenter}>
                    <span className={styles.multiLineHeader}>
                      Under Stress<br />Impact
                    </span>
                    {renderSortIcon('stressed')}
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              const { category, typicalImpact, stressedImpact } = item;

              return (
                <TableRow key={category.id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <div className={styles.categoryContainer}>
                      <div className={styles.categoryRow}>
                        {settings.showIcons && (
                          <span className={styles.iconCell}>{category.icon}</span>
                        )}
                        <div className={styles.categoryContent}>
                          <div className={styles.categoryName}>{category.name}</div>
                          <div className={styles.categoryDescription}>
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {shouldShowNumbers && (
                    <TableCell className={styles.impactCell}>
                      {typicalImpact > 0 ? (
                        <div className={styles.impactContainer}>
                          {editingCell?.categoryId === category.id && editingCell?.type === 'typical' ? (
                            <div className={styles.numberInputContainer}>
                              <button
                                className={`${styles.spinnerButton} ${styles.spinnerButtonDown}`}
                                style={{
                                  '--spinner-bg': category.color,
                                  '--spinner-text-color': darkenColor(category.color),
                                  visibility: parseInt(editValue) > 0 ? 'visible' : 'hidden'
                                } as React.CSSProperties}
                                data-symbol="−"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const input = e.currentTarget.parentElement?.querySelector('input[type="number"]') as HTMLInputElement;
                                  input.stepDown();
                                  input.dispatchEvent(new Event('change', { bubbles: true }));
                                }}
                                type="button"
                                title="Decrease value"
                              />
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={editValue}
                                onChange={handleInputChange}
                                onBlur={finishEditing}
                                onKeyDown={handleKeyPress}
                                className={styles.editInput}
                                style={{
                                  backgroundColor: category.color,
                                  color: darkenColor(category.color),
                                  '--spinner-color': darkenColor(category.color)
                                } as React.CSSProperties}
                                autoFocus
                              />
                              <button
                                className={`${styles.spinnerButton} ${styles.spinnerButtonUp}`}
                                style={{
                                  '--spinner-bg': category.color,
                                  '--spinner-text-color': darkenColor(category.color),
                                  visibility: parseInt(editValue) < 10 ? 'visible' : 'hidden'
                                } as React.CSSProperties}
                                data-symbol="+"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const input = e.currentTarget.parentElement?.querySelector('input[type="number"]') as HTMLInputElement;
                                  input.stepUp();
                                  input.dispatchEvent(new Event('change', { bubbles: true }));
                                }}
                                type="button"
                                title="Increase value"
                              />
                            </div>
                          ) : (
                            <div
                              className={`${styles.impactValue} ${styles.clickableValue}`}
                              style={{
                                backgroundColor: category.color,
                                color: darkenColor(category.color),
                                '--print-bg-color': category.color,
                                '--print-border-color': darkenColor(category.color)
                              } as React.CSSProperties}
                              onClick={() => startEditing(category.id, 'typical', typicalImpact)}
                              title="Click to edit"
                              data-preserve-print-colors="true"
                            >
                              {typicalImpact}
                            </div>
                          )}
                          <div className={styles.categoryDescription}>
                            {getASDLevel(getPreviewValue(category.id, 'typical', typicalImpact))}
                          </div>
                        </div>
                      ) : (
                        // Clickable area to create new typical impact value
                        <div
                          className={`${styles.impactValue} ${styles.clickableValue} ${styles.emptyValue}`}
                          onClick={() => createNewImpactValue(category.id, 'typical')}
                          title="Click to add typical impact value"
                        >
                          <span className={styles.emptyValueText}>+</span>
                        </div>
                      )}
                    </TableCell>
                  )}
                  {shouldShowNumbers && hasAnyStressValues && (
                    <TableCell className={styles.impactCell}>
                      {stressedImpact > 0 && stressedImpact !== typicalImpact ? (
                        <div className={styles.impactContainer}>
                          {editingCell?.categoryId === category.id && editingCell?.type === 'stressed' ? (
                            <div className={styles.numberInputContainer}>
                              <button
                                className={`${styles.spinnerButton} ${styles.spinnerButtonDown}`}
                                style={{
                                  '--spinner-bg': category.color + '80',
                                  '--spinner-text-color': darkenColor(category.color),
                                  visibility: parseInt(editValue) > 0 ? 'visible' : 'hidden'
                                } as React.CSSProperties}
                                data-symbol="−"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const input = e.currentTarget.parentElement?.querySelector('input[type="number"]') as HTMLInputElement;
                                  input.stepDown();
                                  input.dispatchEvent(new Event('change', { bubbles: true }));
                                }}
                                type="button"
                                title="Decrease value"
                              />
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={editValue}
                                onChange={handleInputChange}
                                onBlur={finishEditing}
                                onKeyDown={handleKeyPress}
                                className={styles.editInput}
                                style={{
                                  backgroundColor: category.color + '80',
                                  color: darkenColor(category.color),
                                  '--spinner-color': darkenColor(category.color)
                                } as React.CSSProperties}
                                autoFocus
                              />
                              <button
                                className={`${styles.spinnerButton} ${styles.spinnerButtonUp}`}
                                style={{
                                  '--spinner-bg': category.color + '80',
                                  '--spinner-text-color': darkenColor(category.color),
                                  visibility: parseInt(editValue) < 10 ? 'visible' : 'hidden'
                                } as React.CSSProperties}
                                data-symbol="+"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const input = e.currentTarget.parentElement?.querySelector('input[type="number"]') as HTMLInputElement;
                                  input.stepUp();
                                  input.dispatchEvent(new Event('change', { bubbles: true }));
                                }}
                                type="button"
                                title="Increase value"
                              />
                            </div>
                          ) : (
                            <div
                              className={`${styles.impactValue} ${styles.clickableValue}`}
                              style={{
                                backgroundColor: category.color + '80',
                                color: darkenColor(category.color, 0.15),
                                '--print-bg-color': category.color + '80',
                                '--print-border-color': darkenColor(category.color)
                              } as React.CSSProperties}
                              onClick={() => startEditing(category.id, 'stressed', stressedImpact)}
                              title="Click to edit"
                              data-preserve-print-colors="true"
                            >
                              {stressedImpact}
                            </div>
                          )}
                          <div className={styles.categoryDescription}>
                            {getASDLevel(getPreviewValue(category.id, 'stressed', stressedImpact))}
                          </div>
                        </div>
                      ) : (
                        // Clickable area to create new stressed impact value (only if typical exists)
                        typicalImpact > 0 ? (
                          <div
                            className={`${styles.impactValue} ${styles.clickableValue} ${styles.emptyValue}`}
                            onClick={() => createNewImpactValue(category.id, 'stressed')}
                            title="Click to add stressed impact value"
                          >
                            <span className={styles.emptyValueText}>+</span>
                          </div>
                        ) : (
                          // Show nothing when there's no typical impact value
                          <div></div>
                        )
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DetailedBreakdownTable;