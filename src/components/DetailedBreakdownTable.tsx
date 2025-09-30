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
  const { state } = useAppContext();
  const { categories, profile, settings } = state;

  // Sorting state - default to Under Stress Impact descending
  const [sortColumn, setSortColumn] = useState<SortColumn>('stressed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const shouldShowNumbers = settings.numberPosition !== 'hide_all' && settings.numberPosition !== 'hide_segment';

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
              {shouldShowNumbers && (
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
                          <div
                            className={styles.impactValue}
                            style={{
                              backgroundColor: category.color,
                              color: darkenColor(category.color)
                            }}
                          >
                            {typicalImpact}
                          </div>
                          <div className={styles.categoryDescription}>
                            {getASDLevel(typicalImpact)}
                          </div>
                        </div>
                      ) : (
                        // Show nothing when there's no typical impact value
                        <div></div>
                      )}
                    </TableCell>
                  )}
                  {shouldShowNumbers && (
                    <TableCell className={styles.impactCell}>
                      {stressedImpact > 0 && stressedImpact !== typicalImpact ? (
                        <div className={styles.impactContainer}>
                          <div
                            className={styles.impactValue}
                            style={{
                              backgroundColor: category.color + '80',
                              color: darkenColor(category.color, 0.15)
                            }}
                          >
                            {stressedImpact}
                          </div>
                          <div className={styles.categoryDescription}>
                            {getASDLevel(stressedImpact)}
                          </div>
                        </div>
                      ) : (
                        // Show nothing when there's no separate stressed impact value
                        <div></div>
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