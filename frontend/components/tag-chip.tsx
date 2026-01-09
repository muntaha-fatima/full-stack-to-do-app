/**
 * TagChip component for displaying individual tags
 */

'use client';

import { X } from 'lucide-react';

interface TagChipProps {
  tag: string;
  onRemove?: () => void;
  variant?: 'default' | 'removable';
}

export function TagChip({ tag, onRemove, variant = 'default' }: TagChipProps) {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
  ];

  // Simple hash function to consistently assign colors to tags
  const getColorForTag = (tag: string): string => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex] ?? 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-fast animate-zoom-in hover:scale-105 ${getColorForTag(
        tag
      )}`}
    >
      {tag}
      {variant === 'removable' && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full transition-all duration-fast hover:bg-black/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95"
          aria-label={`Remove ${tag} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
