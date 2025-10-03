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
 *    - Use global.css for shared design tokens
 *
 * Violation of these rules is STRICTLY FORBIDDEN.
 */

// Emoji picker component following Single Responsibility Principle
// Handles emoji selection interface with categorized emoji display

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';
import type { EmojiPickerProps } from '../types';
import { EMOJI_CATEGORIES } from '../constants/defaults';
import { useState } from 'react';
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
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;