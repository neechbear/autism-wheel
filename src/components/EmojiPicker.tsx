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
      <PopoverContent align="start" side="right">
        <div className={styles.popover}>
          <div className={styles.content}>
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} className={styles.category}>
                <h4 className={styles.categoryTitle}>{category}</h4>
                <div className={styles.grid}>
                  {emojis.map((emoji, index) => (
                    <button
                      key={`${category}-${index}`}
                      className={styles.emojiButton}
                      onClick={() => {
                        onEmojiSelect(emoji);
                        setIsOpen(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;