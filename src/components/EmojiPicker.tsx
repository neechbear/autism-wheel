// Emoji picker component following Single Responsibility Principle
// Handles emoji selection interface with categorized emoji display

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';
import type { EmojiPickerProps } from '../types';
import { EMOJI_CATEGORIES } from '../constants/defaults';
import styles from './EmojiPicker.module.css';

function EmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className={styles.trigger}>
          {selectedEmoji || <Smile className="w-4 h-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="w-fit p-0 max-w-none"
      >
        <div className={styles.content} style={{ padding: '12px' }}>
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category} className={styles.category}>
              <h4 className={styles.categoryTitle}>{category}</h4>
              <div
                className={styles.grid}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 36px)',
                  gap: '2px',
                  width: 'fit-content'
                }}
              >
                {emojis.map((emoji, index) => (
                  <button
                    key={`${category}-${index}`}
                    className={styles.emojiButton}
                    onClick={() => {
                      onEmojiSelect(emoji);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      padding: '2px',
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '21px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;