import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Plus, Smile, Trash2 } from 'lucide-react';
import { useAppState, useAppDispatch } from '../state/AppContext';
import { ProfileCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../state/initialState';
import styles from './EditCategoriesView.module.css';

// --- Shared Components (Potentially moved to /components later) ---

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; variant?: 'primary' | 'destructive' | 'ghost'}> = ({ onClick, children, disabled, variant = 'primary' }) => (
    <button onClick={onClick} disabled={disabled} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
<input {...props} className={`${styles.input} ${props.className || ''}`} />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
<textarea {...props} className={`${styles.textarea} ${props.className || ''}`} />
);

const Popover: React.FC<{ trigger: React.ReactNode; content: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void; }> = ({ trigger, content, open, onOpenChange }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open, onOpenChange]);

    return (
      <div className={styles.popover} ref={popoverRef}>
        <div onClick={() => onOpenChange(!open)}>{trigger}</div>
        {open && <div className={styles.popoverContent}>{content}</div>}
      </div>
    );
  };


// --- Emoji Picker Component ---

const EMOJI_CATEGORIES = {
    'People': ['😀', '😊', '🥰', '😎', '🤔', '😰', '😭', '🥱', '😴', '🤗'],
    'Body Parts': ['👁️', '👂', '👃', '👄', '🧠', '🫀', '🫁', '💪', '👋'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🔄', '🔍', '📚', '🤸‍♀️'],
    'Objects': ['💏', '🗨️', '🏠', '🧩', '🎨', '🎤', '🎧', '💻'],
  };

  const EmojiPicker: React.FC<{ selectedEmoji: string; onEmojiSelect: (emoji: string) => void }> = ({ selectedEmoji, onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <button className={styles.emojiTrigger}>
          {selectedEmoji || <Smile />}
        </button>
        <div className={styles.emojiPickerContent}>
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h4 className={styles.emojiCategoryTitle}>{category}</h4>
              <div className={styles.emojiGrid}>
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onEmojiSelect(emoji); setIsOpen(false); }}
                    className={styles.emojiButton}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Popover>
    );
  };


// --- Draggable Row Component ---

const ItemTypes = { LABEL_ROW: 'labelRow' };

interface DraggableLabelRowProps {
  item: ProfileCategory;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  updateItem: (index: number, updatedItem: ProfileCategory) => void;
  deleteItem: (index: number) => void;
  canDelete: boolean;
}

const DraggableLabelRow: React.FC<DraggableLabelRowProps> = ({ item, index, moveRow, updateItem, deleteItem, canDelete }) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.LABEL_ROW,
    hover(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.LABEL_ROW,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);
  drop(ref);

  const handleFieldChange = (field: keyof ProfileCategory, value: string) => {
    updateItem(index, { ...item, [field]: value });
  };

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className={styles.tableRow}>
      <td className={styles.tableCell}><EmojiPicker selectedEmoji={item.icon} onEmojiSelect={(emoji) => handleFieldChange('icon', emoji)} /></td>
      <td className={styles.tableCell}>
        <Input value={item.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="Label name..." />
        <Textarea value={item.description} onChange={(e) => handleFieldChange('description', e.target.value)} placeholder="Enter description..." rows={3} />
      </td>
      <td className={styles.tableCell}><input type="color" value={item.color} onChange={(e) => handleFieldChange('color', e.target.value)} className={styles.colorInput} /></td>
      <td className={styles.tableCell}>
        <Button onClick={() => deleteItem(index)} disabled={!canDelete} variant="ghost">
          <Trash2 />
        </Button>
      </td>
      <td className={styles.tableCell}>
        <div ref={dragRef} className={styles.dragHandle}><GripVertical /></div>
      </td>
    </tr>
  );
};


// --- Main Edit View Component ---

const EditCategoriesView: React.FC = () => {
    const { categories: globalCategories } = useAppState();
    const dispatch = useAppDispatch();

    // "Draft state" pattern as per instructions
    const [draftCategories, setDraftCategories] = useState<ProfileCategory[]>([]);
    const [originalCategories, setOriginalCategories] = useState<ProfileCategory[]>([]);

    useEffect(() => {
        // Initialize draft state when the component mounts or global categories change
        setDraftCategories([...globalCategories.map(c => ({...c}))]);
        setOriginalCategories([...globalCategories.map(c => ({...c}))]);
    }, [globalCategories]);

    const handleSave = () => {
      dispatch({ type: 'UPDATE_CATEGORIES', payload: draftCategories });
      dispatch({ type: 'SET_VIEW', payload: 'main' });
    };

    const handleRevert = () => {
      setDraftCategories([...originalCategories.map(c => ({...c}))]);
    };

    const handleSetDefaults = () => {
      setDraftCategories([...DEFAULT_CATEGORIES.map(c => ({...c}))]);
    };

    const moveRow = (dragIndex: number, hoverIndex: number) => {
      const newDraft = [...draftCategories];
      const [draggedItem] = newDraft.splice(dragIndex, 1);
      newDraft.splice(hoverIndex, 0, draggedItem);
      setDraftCategories(newDraft);
    };

    const updateItem = (index: number, updatedItem: ProfileCategory) => {
      const newDraft = [...draftCategories];
      newDraft[index] = updatedItem;
      setDraftCategories(newDraft);
    };

    const deleteItem = (index: number) => {
        if (draftCategories.length > 2) {
            const newDraft = [...draftCategories];
            newDraft.splice(index, 1);
            setDraftCategories(newDraft);
        }
    };

    const addNewItem = () => {
        const newItem: ProfileCategory = {
            id: `new-${Date.now()}`,
            name: 'New Category',
            description: '',
            icon: '😀',
            color: '#cccccc'
        };
        setDraftCategories([...draftCategories, newItem]);
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Edit Categories</h1>
            <p>Drag and drop to reorder. Changes are temporary until you save.</p>
          </div>

          <div className={styles.toolbar}>
            <Button onClick={handleSave} variant="primary">Save and Return</Button>
            <Button onClick={handleRevert} variant="destructive">Revert Changes</Button>
            <Button onClick={handleSetDefaults} variant="destructive">Reset to Defaults</Button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Icon</th>
                <th className={styles.tableHeader}>Name & Description</th>
                <th className={styles.tableHeader}>Color</th>
                <th className={styles.tableHeader}>Delete</th>
                <th className={styles.tableHeader}>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {draftCategories.map((item, index) => (
                <DraggableLabelRow
                  key={item.id}
                  index={index}
                  item={item}
                  moveRow={moveRow}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                  canDelete={draftCategories.length > 2}
                />
              ))}
            </tbody>
          </table>
          <div className={styles.addNewButtonContainer}>
            <Button onClick={addNewItem} variant='ghost'><Plus /> Add New Category</Button>
          </div>
        </div>
      </DndProvider>
    );
  };

  export default EditCategoriesView;