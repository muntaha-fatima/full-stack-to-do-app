'use client';

import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Flag as FlagIcon,
  Circle,
  CheckCircle2 as CheckCircleIcon,
  Clock as TimerIcon,
  Pencil,
  Trash2
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const handleToggleComplete = () => {
    onToggleComplete(task);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  // Determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-500/10';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-500/10';
      case 'low':
        return 'border-l-green-500 bg-green-50/50 dark:bg-green-500/10';
      default:
        return 'border-l-gray-300';
    }
  };

  // Determine status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4 text-gray-500" aria-label="To do" />;
      case 'in_progress':
        return <TimerIcon className="h-4 w-4 text-blue-500" aria-label="In progress" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" aria-label="Completed" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" aria-label="To do" />;
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-full border-0 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "border-l-4",
        getPriorityColor(task.priority),
        task.completed && "opacity-70 bg-muted/30"
      )}
      role="article"
      aria-labelledby={`task-title-${task.id}`}
      tabIndex={-1}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <Checkbox
          id={`complete-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-0.5"
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        
        <div className="flex-1 min-w-0">
          <p className={`text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </p>
          {task.due_date && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3" />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {task.priority === 'high' && (
          <FlagIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
        )}
        {task.priority === 'medium' && (
          <FlagIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
        )}
        {task.priority === 'low' && (
          <FlagIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
        )}

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-gray-400 hover:text-blue-600"
            aria-label={`Edit task "${task.title}"`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-gray-400 hover:text-red-600"
            aria-label={`Delete task "${task.title}"`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}