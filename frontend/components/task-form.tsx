/**
 * Task form component for creating and editing tasks.
 */

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskCreate } from '@/types/task';
import { Button } from './ui/button';
import { TagInput } from './tag-input';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskCreate) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<TaskFormData>;
}

export function TaskForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues || {
      status: 'todo',
      priority: 'medium',
      tags: [],
    },
  });

  const onSubmitForm = (data: TaskFormData) => {
    onSubmit({
      ...data,
      due_date: data.due_date || null,
      tags: data.tags || [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-lg">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium leading-tight text-foreground mb-sm">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`block w-full rounded-md border px-md py-sm text-base leading-normal text-foreground shadow-sm transition-all duration-fast placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.title
              ? 'border-destructive focus:border-destructive focus:ring-destructive bg-destructive/5'
              : 'border-border bg-background focus:border-ring focus:ring-ring'
          }`}
          placeholder="Enter task title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-sm text-sm leading-tight text-destructive animate-fade-in flex items-center gap-xs">
            <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium leading-tight text-foreground mb-sm">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className={`block w-full rounded-md border px-md py-sm text-base leading-normal text-foreground shadow-sm transition-all duration-fast placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
            errors.description
              ? 'border-destructive focus:border-destructive focus:ring-destructive bg-destructive/5'
              : 'border-border bg-background focus:border-ring focus:ring-ring'
          }`}
          placeholder="Enter task description"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-sm text-sm leading-tight text-destructive animate-fade-in flex items-center gap-xs">
            <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-lg">
        <div>
          <label htmlFor="status" className="block text-sm font-medium leading-tight text-foreground mb-sm">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="block w-full rounded-md border border-border bg-background px-md py-sm text-base leading-normal text-foreground shadow-sm transition-colors duration-fast focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium leading-tight text-foreground mb-sm">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="block w-full rounded-md border border-border bg-background px-md py-sm text-base leading-normal text-foreground shadow-sm transition-colors duration-fast focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium leading-tight text-foreground mb-sm">
          Due Date
        </label>
        <input
          id="due_date"
          type="datetime-local"
          {...register('due_date')}
          className="block w-full rounded-md border border-border bg-background px-md py-sm text-base leading-normal text-foreground shadow-sm transition-colors duration-fast focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium leading-tight text-foreground mb-sm">
          Tags
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput
              tags={field.value || []}
              onChange={field.onChange}
              placeholder="Add tags (press Enter or comma)"
            />
          )}
        />
        {errors.tags && (
          <p className="mt-sm text-sm leading-tight text-destructive">{errors.tags.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-sm pt-md border-t border-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <span className="flex items-center gap-sm">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Create Task'
          )}
        </Button>
      </div>
    </form>
  );
}
