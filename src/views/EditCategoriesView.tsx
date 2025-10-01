// Edit Categories view component following Single Responsibility Principle
// Dedicated interface for users to customize categories displayed on the wheel

import { useState, useEffect, useRef } from 'react';
import styles from './EditCategoriesView.module.css';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { GripVertical, ChevronUp, ChevronDown, Trash2, Save } from 'lucide-react';
import EmojiPicker from '../components/EmojiPicker';
import { useAppContext, appActions } from '../state/AppContext';
import { createDefaultCategories } from '../constants/defaults';
import { DEFAULT_SLICE_COLORS } from '../constants/defaults';
import type { ProfileCategory } from '../types';

function EditCategoriesView(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const [draftCategories, setDraftCategories] = useState<ProfileCategory[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize draft state when component mounts
  useEffect(() => {
    setDraftCategories([...state.categories]);
  }, [state.categories]);

  // Track changes to enable/disable save button
  useEffect(() => {
    const changes = JSON.stringify(draftCategories) !== JSON.stringify(state.categories);
    setHasChanges(changes);
  }, [draftCategories, state.categories]);

  // Auto-resize textareas when categories change
  useEffect(() => {
    const textareas = document.querySelectorAll(`.${styles.textArea}`) as NodeListOf<HTMLTextAreaElement>;
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [draftCategories]);

  // Add escape key listener to return to main view with unsaved changes check
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReturnWithCheck();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [hasChanges]); // Include hasChanges in dependency array

  const handleReturn = () => {
    dispatch(appActions.setView('main'));
  };

  const handleReturnWithCheck = () => {
    if (hasChanges) {
      const shouldDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them and return to the main menu?'
      );

      if (shouldDiscard) {
        handleReturn();
      }
      // If they choose "No", the confirm dialog closes and we stay on the edit view
    } else {
      // No changes, safe to return
      handleReturn();
    }
  };

  const handleSaveCategories = () => {
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
    dispatch(appActions.setView('main'));
  };

  const handleDiscardChanges = () => {
    setDraftCategories([...state.categories]);
    dispatch({ type: 'SET_VIEW', payload: 'main' });
  };

  const handleDefaultCategories = () => {
    setDraftCategories(createDefaultCategories());
  };

  const handleAddCategory = () => {
    // Use colors from default set, cycling through them
    const colorIndex = draftCategories.length % DEFAULT_SLICE_COLORS.length;
    const selectedColor = DEFAULT_SLICE_COLORS[colorIndex];

    const newCategory: ProfileCategory = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      description: 'Description for the new category',
      icon: '❓',
      color: selectedColor
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

  // Auto-resize textarea function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="view-container">
      <div className="view-content">
        {/* Main title - same as other views */}
        <h1 className={styles.title}>Autism Wheel</h1>

        {/* Descriptive text */}
        <div className={styles.textSection}>
          <p className={styles.introText}>
            You may customise the categories in your autism wheel. You can edit the name, description, icon, and colour for each category. You can also remove and add categories, and reorder categories by dragging the grip handle or using the up/down arrows. Changes are saved when you click the "Save" button.
          </p>
          <p className={styles.introText}>
            You can discard any unsaved changes and return to the main menu at any time by clicking the "Discard changes" button. Clicking the "Default categories" button will load the default set of categories.
          </p>
        </div>

        {/* Action buttons row */}
        <div className={styles.buttonRow}>
          <Button
            onClick={handleDiscardChanges}
            variant="destructive"
            className={styles.redButton}
          >
            Discard changes
          </Button>

          <Button
            onClick={handleDefaultCategories}
            variant="default"
            className={styles.blueButton}
          >
            Default categories
          </Button>

          <Button
            onClick={handleAddCategory}
            variant="default"
            disabled={draftCategories.length >= 10}
            className={styles.blueButton}
          >
            Add category
          </Button>

          <Button
            onClick={handleSaveCategories}
            variant="default"
            className={styles.blueButton}
          >
            <Save className={styles.buttonIcon} />
            Save
          </Button>
        </div>

        {/* Edit Categories Table */}
        <div className={styles.editCategoriesSection}>
          <Table>
            <colgroup>
              <col /> {/* Icon column - 10% */}
              <col /> {/* Name & Description column - 60% */}
              <col /> {/* Colour column - 10% */}
              <col /> {/* Delete column - 10% */}
              <col /> {/* Reorder column - 10% */}
            </colgroup>
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
                  <TableCell className={`${styles.tableCellTopCenter} ${styles.iconTableCell}`}>
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
                          onChange={(e) => {
                            handleUpdateCategory(category.id, { description: e.target.value });
                            autoResizeTextarea(e.target);
                          }}
                          onInput={(e) => autoResizeTextarea(e.target as HTMLTextAreaElement)}
                          className={styles.textArea}
                          rows={1}
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
                          appearance: 'none',
                          padding: 0,
                          margin: 0
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
                      disabled={draftCategories.length <= 2}
                      className={styles.deleteButton}
                    >
                      <Trash2 className={styles.buttonIcon} />
                    </Button>
                  </TableCell>

                  {/* Reorder column - with drag handle and up/down arrows on same line */}
                  <TableCell className={styles.tableCellTopCenter}>
                    <div
                      className={styles.reorderColumn}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1px',
                        padding: '0',
                        margin: '0',
                        width: '60px'
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        className={styles.reorderButton}
                        style={{
                          padding: '0',
                          margin: '0',
                          minWidth: '16px',
                          width: '16px',
                          height: '16px',
                          visibility: index > 0 ? 'visible' : 'hidden'
                        }}
                      >
                        <ChevronUp style={{ width: '27px', height: '27px' }} />
                      </Button>
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
                        style={{
                          padding: '0 0 0 30px',
                          margin: '0 1px',
                          cursor: 'grab',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <GripVertical style={{ width: '27px', height: '27px' }} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        className={styles.reorderButton}
                        style={{
                          padding: '0',
                          margin: '0',
                          minWidth: '16px',
                          width: '16px',
                          height: '16px',
                          visibility: index < draftCategories.length - 1 ? 'visible' : 'hidden'
                        }}
                      >
                        <ChevronDown style={{ width: '27px', height: '27px' }} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default EditCategoriesView;