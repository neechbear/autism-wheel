// Main view component following Single Responsibility Principle
// Composes all main interface components into the primary application view

import React, { useState, useRef } from 'react';
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
import { Plus, RotateCcw, RefreshCw, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header section */}
        <Header isLockedMode={false} hideIntro={false} onHelp={handleHelp} />

        {/* Main diagram section */}
        <div className="flex justify-center">
          <RadialDiagram onSegmentClick={handleSegmentClick} />
        </div>

        {/* View options */}
        {!isEditingLabels && <ViewOptions />}

        {/* Action toolbar */}
        <div
          ref={editButtonsRef}
          className="flex flex-wrap gap-4 justify-center print:hidden"
          style={{ marginTop: !isEditingLabels ? '0.625rem' : '0' }}
        >
          {!isEditingLabels && <ActionToolbar />}

          <Button
            onClick={handleEditLabels}
            className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditingLabels ? "Save categories" : "Edit categories"}
          </Button>

          {isEditingLabels && (
            <>
              <Button
                onClick={handleRevertChanges}
                variant="destructive"
                className="h-10"
                disabled={!hasChanges}
              >
                Revert changes
              </Button>
              <Button
                onClick={handleDefaultCategories}
                variant="destructive"
                className="h-10"
              >
                Default categories
              </Button>
              <Button onClick={handleAddCategory} variant="outline" className="h-10 gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </>
          )}
        </div>

        {/* Edit Categories Table */}
        {isEditingLabels && (
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="mb-4 font-semibold">Edit Categories</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Icon</TableHead>
                  <TableHead>Category Name & Description</TableHead>
                  <TableHead className="text-center">Colour</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Reorder</TableHead>
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
                    className="hover:bg-gray-50"
                  >
                    {/* Icon column - top aligned with emoji picker */}
                    <TableCell className="align-top text-center">
                      <div className="flex flex-col items-center gap-2">
                        <EmojiPicker
                          selectedEmoji={category.icon}
                          onEmojiSelect={(newIcon) => handleUpdateCategory(category.id, { icon: newIcon })}
                        />
                      </div>
                    </TableCell>
                    {/* Name and Description column - properly stacked */}
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-3 w-full">
                        <div className="w-full">
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Category name"
                          />
                        </div>
                        <div className="w-full">
                          <textarea
                            value={category.description}
                            onChange={(e) => handleUpdateCategory(category.id, { description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Category description"
                          />
                        </div>
                      </div>
                    </TableCell>
                    {/* Colour column - single rounded rectangle */}
                    <TableCell className="align-top text-center">
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="color"
                          value={category.color}
                          onChange={(e) => handleUpdateCategory(category.id, { color: e.target.value })}
                          className="w-16 h-8 rounded cursor-pointer"
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
                    <TableCell className="align-top text-center">
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </TableCell>
                    {/* Reorder column - with drag handle and up/down arrows on same line */}
                    <TableCell className="align-top text-center">
                      <div className="flex items-center justify-center gap-1">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            className="h-6 w-6 p-0"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                        )}
                        <div
                          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.currentTarget.style.opacity = '0.5';
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {index < draftCategories.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            className="h-6 w-6 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
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
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Detailed Breakdown</h2>
            <DetailedBreakdownTable />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainView;