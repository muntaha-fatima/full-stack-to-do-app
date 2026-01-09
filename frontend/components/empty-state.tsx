/**
 * Empty state component for when there are no tasks.
 */

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6 p-4 bg-muted rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">No tasks yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have any tasks. Add a new task to get started on your journey to productivity.
      </p>
      
      <Button 
        variant="default" 
        onClick={onAddTask}
        className="flex items-center"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add your first task
      </Button>
    </div>
  );
}