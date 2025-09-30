// Main view component following Single Responsibility Principle
// Composes all main interface components into the primary application view

import { useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './MainView.module.css';
import Header from '../components/Header';
import RadialDiagram from '../components/RadialDiagram';
import ViewOptions from '../components/ViewOptions';
import ActionToolbar from '../components/ActionToolbar';
import DetailedBreakdownTable from '../components/DetailedBreakdownTable';
import EmojiPicker from '../components/EmojiPicker';
import { useAppContext, appActions } from '../state/AppContext';
import { createDefaultCategories } from '../constants/defaults';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import type { ProfileCategory } from '../types';

function MainView(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [draftCategories, setDraftCategories] = useState<ProfileCategory[]>([]);
  const editButtonsRef = useRef<HTMLDivElement>(null);

  // Initialize draft state when editing starts
  const handleEditLabels = () => {
    if (!isEditingLabels) {
      setDraftCategories([...state.categories]);
      setIsEditingLabels(true);
      // Scroll to the edit buttons row after state update
      setTimeout(() => {
        if (editButtonsRef.current) {
          const element = editButtonsRef.current;
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const offset = 80; // Show some space above the button row

          window.scrollTo({
            top: absoluteElementTop - offset,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Save changes
      const convertToLabelData = (categories: ProfileCategory[]) => {
        return categories.map((category, index) => ({
          id: category.id,
          label: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          originalIndex: index,
        }));
      };
      dispatch(appActions.setCategories(convertToLabelData(draftCategories)));
      setIsEditingLabels(false);
    }
  };

  const handleRevertChanges = () => {
    setDraftCategories([...state.categories]);
  };

  const handleDefaultCategories = () => {
    setDraftCategories(createDefaultCategories());
  };

  const handleAddCategory = () => {
    const newCategory: ProfileCategory = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      description: 'Description for the new category',
      icon: '❓',
      color: '#e2e8f0'
    };
    setDraftCategories([...draftCategories, newCategory]);
  };

  const handleUpdateCategory = (id: string, updates: Partial<ProfileCategory>) => {
    setDraftCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, ...updates } : cat
      )
    );
  };

  const handleDeleteCategory = (id: string) => {
    setDraftCategories(categories =>
      categories.filter(cat => cat.id !== id)
    );
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newCategories = [...draftCategories];
      [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
      setDraftCategories(newCategories);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < draftCategories.length - 1) {
      const newCategories = [...draftCategories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      setDraftCategories(newCategories);
    }
  };

  const handleDragAndDrop = (dragIndex: number, hoverIndex: number) => {
    const newCategories = [...draftCategories];
    const draggedItem = newCategories[dragIndex];
    newCategories.splice(dragIndex, 1);
    newCategories.splice(hoverIndex, 0, draggedItem);
    setDraftCategories(newCategories);
  };

  const handleHelp = () => {
    // Scroll to top when navigating to help
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(appActions.setView('help'));
  };

  const handleSegmentClick = (sliceIndex: number, ringIndex: number) => {
    const currentSelections = state.profile.selections[sliceIndex] || [];
    const segmentNumber = ringIndex + 1; // Convert to 1-based numbering

    if (currentSelections.length === 0) {
      // No current selections, add this one
      dispatch(appActions.updateSelection(sliceIndex.toString(), [segmentNumber]));
    } else if (currentSelections.length === 1) {
      const [firstSelection] = currentSelections;

      if (segmentNumber <= firstSelection) {
        // Clicked on a dark-colored segment, clear all selections
        dispatch(appActions.removeSelection(sliceIndex.toString()));
      } else {
        // Clicked on an uncolored segment, add as second selection
        const newSelections = [firstSelection, segmentNumber].sort((a, b) => a - b);
        dispatch(appActions.updateSelection(sliceIndex.toString(), newSelections));
      }
    } else if (currentSelections.length === 2) {
      const [first, second] = currentSelections;

      if (segmentNumber <= first) {
        // Clicked on a dark-colored segment, clear all selections
        dispatch(appActions.removeSelection(sliceIndex.toString()));
      } else if (segmentNumber === second) {
        // Clicked on the second selection, remove it
        dispatch(appActions.updateSelection(sliceIndex.toString(), [first]));
      } else if (segmentNumber > second) {
        // Clicked beyond the second selection, extend to this segment
        dispatch(appActions.updateSelection(sliceIndex.toString(), [first, segmentNumber]));
      } else {
        // Clicked between first and second, this shouldn't happen with current logic
        // but handle it by clearing selections
        dispatch(appActions.removeSelection(sliceIndex.toString()));
      }
    }
  };

  const hasChanges = JSON.stringify(draftCategories) !== JSON.stringify(state.categories);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Header section */}
        <Header isLockedMode={false} hideIntro={false} onHelp={handleHelp} />

        {/* Action toolbar */}
        <div
          ref={editButtonsRef}
          className={clsx(styles.actionToolbar, styles.printHidden)}
          style={{ marginBottom: !isEditingLabels ? '0.625rem' : '0' }}
        >
          {!isEditingLabels && <ActionToolbar />}

          <Button
            onClick={handleEditLabels}
            className={clsx(styles.button, styles.blueButton)}
          >
            {isEditingLabels ? "Save categories" : "Edit categories"}
          </Button>

          {isEditingLabels && (
            <>
              <Button
                onClick={handleRevertChanges}
                variant="destructive"
                className={clsx(styles.button, styles.redButton)}
                disabled={!hasChanges}
              >
                Revert changes
              </Button>
              <Button
                onClick={handleDefaultCategories}
                variant="destructive"
                className={clsx(styles.button, styles.redButton)}
              >
                Default categories
              </Button>
              <Button
                onClick={handleAddCategory}
                variant="outline"
                className={clsx(styles.button, styles.blueButton)}
              >
                <Plus className={styles.buttonIcon} />
                Add Category
              </Button>
            </>
          )}
        </div>

        {/* View options */}
        {!isEditingLabels && <ViewOptions />}

        {/* Main diagram section */}
        <div className={styles.diagramContainer}>
          <RadialDiagram onSegmentClick={handleSegmentClick} />
        </div>

        {/* Edit Categories Table */}
        {isEditingLabels && (
          <div className={styles.editCategoriesSection}>
            <h3 className={styles.editCategoriesHeading}>Edit Categories</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.tableHeadCenter}>Icon</TableHead>
                  <TableHead>Category Name & Description</TableHead>
                  <TableHead className={styles.tableHeadCenter}>Colour</TableHead>
                  <TableHead className={styles.tableHeadCenter}>Delete</TableHead>
                  <TableHead className={styles.tableHeadCenter}>Reorder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftCategories.map((category, index) => (
                  <TableRow
                    key={category.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      if (!isNaN(dragIndex) && dragIndex !== index) {
                        handleDragAndDrop(dragIndex, index);
                      }
                    }}
                    className={styles.tableRowHover}
                  >
                    {/* Icon column - top aligned with emoji picker */}
                    <TableCell className={styles.tableCellTopCenter}>
                      <div className={styles.iconColumn}>
                        <EmojiPicker
                          selectedEmoji={category.icon}
                          onEmojiSelect={(newIcon) => handleUpdateCategory(category.id, { icon: newIcon })}
                        />
                      </div>
                    </TableCell>
                    {/* Name and Description column - properly stacked */}
                    <TableCell className={styles.tableCellTop}>
                      <div className={styles.nameDescriptionColumn}>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                            className={styles.textInput}
                            placeholder="Category name"
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <textarea
                            value={category.description}
                            onChange={(e) => handleUpdateCategory(category.id, { description: e.target.value })}
                            className={styles.textArea}
                            rows={3}
                            placeholder="Category description"
                          />
                        </div>
                      </div>
                    </TableCell>
                    {/* Colour column - single rounded rectangle */}
                    <TableCell className={styles.tableCellTopCenter}>
                      <div className={styles.colorColumn}>
                        <input
                          type="color"
                          value={category.color}
                          onChange={(e) => handleUpdateCategory(category.id, { color: e.target.value })}
                          className={styles.colorInput}
                          style={{
                            backgroundColor: category.color,
                            border: 'none',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                          }}
                        />
                      </div>
                    </TableCell>
                    {/* Delete column */}
                    <TableCell className={styles.tableCellTopCenter}>
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </TableCell>
                    {/* Reorder column - with drag handle and up/down arrows on same line */}
                    <TableCell className={styles.tableCellTopCenter}>
                      <div className={styles.reorderColumn}>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            className={styles.reorderButton}
                          >
                            <ChevronUp className={styles.buttonIcon} />
                          </Button>
                        )}
                        <div
                          className={styles.dragHandle}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.currentTarget.style.opacity = '0.5';
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <GripVertical className={styles.dragIcon} />
                        </div>
                        {index < draftCategories.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            className={styles.reorderButton}
                          >
                            <ChevronDown className={styles.buttonIcon} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detailed breakdown table */}
        {!isEditingLabels && (
          <div className={styles.detailedBreakdownSection}>
            <DetailedBreakdownTable />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainView;