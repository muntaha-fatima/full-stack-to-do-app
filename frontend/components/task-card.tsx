/**
 * Task card component with enhanced UI/UX.
 */

import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  FlagIcon,
  CircleIcon,
  CheckCircleIcon,
  TimerIcon
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onToggleComplete, onEdit }: TaskCardProps) {
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
  const getPriorityColor = (priority: TaskPriority) => {
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
  const getStatusVariant = (status: TaskStatus) => {
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
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <CircleIcon className="h-4 w-4 text-gray-500" />;
      case 'in_progress':
        return <TimerIcon className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <CircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-full border-0 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md",
        "border-l-4",
        getPriorityColor(task.priority),
        task.completed && "opacity-70 bg-muted/30"
      )}
    >
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-semibold text-base leading-tight mb-1 truncate",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-0 px-4 pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={getStatusVariant(task.status)} className="text-xs">
            <span className="mr-1">{getStatusIcon(task.status)}</span>
            {task.status.replace('_', ' ')}
          </Badge>

          <Badge variant="outline" className="text-xs capitalize">
            <FlagIcon className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
        </div>

        {task.due_date && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Due: {formatDate(task.due_date)}</span>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 mt-auto pt-3 border-t border-border/40">
        <div className="text-xs text-muted-foreground">
          Created: {formatDate(task.created_at)}
        </div>
      </CardFooter>
    </Card>
  );
}