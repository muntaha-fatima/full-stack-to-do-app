/**
 * Empty state component for when no tasks exist
 */

'use client';

import { CheckCircle2, ListTodo, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onAddTask: () => void;
  variant?: 'default' | 'filtered';
  filterType?: string;
}

export function EmptyState({ onAddTask, variant = 'default', filterType }: EmptyStateProps) {
  if (variant === 'filtered') {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-card/95 backdrop-blur-sm p-2xl shadow-lg card-elevated animate-fade-in">
        <div className="text-center max-w-md">
          <div className="mb-xl flex justify-center">
            <div className="rounded-full bg-muted/30 p-2xl">
              <ListTodo className="h-24 w-24 text-muted-foreground opacity-30" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="mb-sm text-2xl font-bold leading-tight text-foreground">
            No {filterType} tasks
          </h3>
          <p className="mb-xl text-base leading-normal text-muted-foreground">
            Try adjusting your filters or create a new task to get started.
          </p>
          <Button variant="outline" onClick={onAddTask} size="lg">
            + Create New Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-card/95 backdrop-blur-sm p-2xl shadow-lg card-elevated animate-fade-in">
      <div className="text-center max-w-lg">
        {/* Large, friendly icon */}
        <div className="mb-xl flex justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-primary/5 animate-pulse"></div>
          </div>
          <div className="relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-3xl">
            <CheckCircle2
              className="h-32 w-32 text-primary opacity-40"
              strokeWidth={1.5}
            />
            <Sparkles
              className="absolute top-4 right-4 h-8 w-8 text-primary/60 animate-pulse"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Encouraging headline */}
        <h3 className="mb-md text-3xl font-bold leading-tight text-foreground">
          Ready to get organized?
        </h3>

        {/* Friendly description */}
        <p className="mb-xl text-lg leading-normal text-muted-foreground">
          Start your productivity journey by creating your first task.
          Stay on top of your goals and never miss a deadline!
        </p>

        {/* Prominent CTA button */}
        <Button
          variant="primary"
          onClick={onAddTask}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-normal hover:scale-105"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Create Your First Task
        </Button>

        {/* Helpful hint */}
        <p className="mt-lg text-sm leading-tight text-muted-foreground opacity-70">
          Tip: Use tags and priorities to keep your tasks organized
        </p>
      </div>
    </div>
  );
}
