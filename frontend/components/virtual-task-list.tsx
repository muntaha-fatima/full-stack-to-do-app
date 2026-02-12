/**
 * Task list component for displaying tasks.
 */

import { Task, TaskListResponse } from '@/types/task';
import { TaskCard } from './task-card';
import { EmptyState } from './empty-state';
import { TaskListSkeleton } from './loading-skeleton';

interface TaskListProps {
  data: TaskListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onAddTask: () => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function VirtualTaskList({
  data,
  isLoading,
  error,
  onAddTask,
  onDelete,
  onToggleComplete,
  onEdit,
}: TaskListProps) {
  if (isLoading) {
    return <TaskListSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
        <p className="text-destructive">Error loading tasks. Please try again.</p>
      </div>
    );
  }

  if (data && (data.data?.length || 0) === 0) {
    return <EmptyState onAddTask={onAddTask} />;
  }

  if (data && (data.data?.length || 0) > 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
            />
          ))}
        </div>

        {/* Pagination Info */}
        {data?.meta?.total > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {data.data?.length || 0} of {data?.meta?.total || 0} tasks
          </div>
        )}
      </div>
    );
  }

  return null;
}