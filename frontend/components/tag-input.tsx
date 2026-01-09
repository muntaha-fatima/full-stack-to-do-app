/**
 * TagInput component for entering and managing tags
 */

'use client';

import { useState, KeyboardEvent } from 'react';
import { TagChip } from './tag-chip';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    // Check if tag already exists (case-insensitive)
    if (tags.some((tag) => tag.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputValue('');
      return;
    }

    // Check max tags limit
    if (tags.length >= maxTags) {
      setInputValue('');
      return;
    }

    onChange([...tags, trimmedValue]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border border-border bg-background px-md py-sm shadow-sm transition-all duration-fast focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {tags.map((tag, index) => (
          <TagChip
            key={index}
            tag={tag}
            variant="removable"
            onRemove={() => removeTag(index)}
          />
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground transition-colors duration-fast"
          disabled={tags.length >= maxTags}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-tight">
        Press Enter or comma to add a tag. {tags.length}/{maxTags} tags
      </p>
    </div>
  );
}
