// Emoji picker component following Single Responsibility Principle
// Handles emoji selection interface with categorized emoji display

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';
import type { EmojiPickerProps } from '../types';
import { EMOJI_CATEGORIES } from '../constants/defaults';

function EmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-16 h-16 p-0 text-3xl inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          {selectedEmoji || <Smile className="w-4 h-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-96" align="start">
        <div className="space-y-3 max-h-80 overflow-y-auto overflow-x-hidden emoji-picker-scroll">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{category}</h4>
              <div className="grid grid-cols-8 gap-1.5">
                {emojis.map((emoji, index) => (
                  <button
                    key={`${category}-${index}`}
                    className="w-8 h-8 text-lg hover:bg-muted rounded transition-colors flex items-center justify-center"
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