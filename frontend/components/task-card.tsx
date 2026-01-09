/**
 * Task card component for displaying individual tasks.
 */

'use client';

import { Task } from '@/types/task';
import { Button } from './ui/button';
import { TagChip } from './tag-chip';
import { formatDateTime } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onToggleComplete, onEdit }: TaskCardProps) {
  const statusColors = {
    todo: 'bg-muted text-muted-foreground',
    in_progress: 'bg-status-info/10 text-status-info border-status-info/20',
    completed: 'bg-status-success/10 text-status-success border-status-success/20',
  };

  const priorityColors = {
    low: 'bg-priority-low/10 text-priority-low border-priority-low/20',
    medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
    high: 'bg-priority-high/10 text-priority-high border-priority-high/20',
  };

  return (
    <div className="group rounded-lg border border-border bg-card/95 backdrop-blur-sm p-lg shadow-lg card-elevated transition-all duration-normal hover:shadow-xl hover:-translate-y-1 animate-slide-in">
      {/* Header */}
      <div className="mb-md flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-sm">
            <h3 className={`text-lg font-semibold leading-tight transition-all duration-normal ${task.completed ? 'line-through opacity-60' : ''} text-card-foreground`}>
              {task.title}
            </h3>
            {/* Edit/Delete icons - visible on hover (desktop) or always (mobile) */}
            <div className="flex gap-xs opacity-0 transition-opacity duration-fast group-hover:opacity-100 sm:opacity-100 md:opacity-0">
              <button
                onClick={() => onEdit(task)}
                className="rounded p-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Edit task"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded p-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-sm flex gap-sm">
            <span
              className={`inline-flex items-center rounded-full px-md py-xs text-xs font-medium ${
                statusColors[task.status]
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-md py-xs text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mb-md text-base leading-normal text-muted-foreground line-clamp-3">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-md flex flex-wrap gap-sm">
          {task.tags.map((tag, index) => (
            <TagChip key={index} tag={tag} />
          ))}
        </div>
      )}

      {/* Due Date */}
      {task.due_date && (
        <p className="mb-md text-sm leading-normal text-muted-foreground">
          Due: {formatDateTime(task.due_date)}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-md">
        <div className="flex gap-sm">
          <Button
            size="sm"
            variant={task.completed ? 'secondary' : 'primary'}
            onClick={() => onToggleComplete(task)}
          >
            {task.completed ? 'Undo' : 'Complete'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newStatus =
                task.status === 'todo'
                  ? 'in_progress'
                  : task.status === 'in_progress'
                  ? 'completed'
                  : 'todo';
              onUpdate(task.id, { status: newStatus });
            }}
          >
            Next Status
          </Button>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-sm text-xs leading-tight text-muted-foreground">
        Created: {formatDateTime(task.created_at)}
      </div>
    </div>
  );
}
