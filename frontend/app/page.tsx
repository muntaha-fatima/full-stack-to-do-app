/**
 * Home page - Task list view.
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import type { Task, TaskCreate, TaskStatus } from '@/types/task';
import { TaskCard } from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modal';
import { EmptyState } from '@/components/empty-state';
import { TaskListSkeleton } from '@/components/loading-skeleton';
import { DarkModeToggle } from '@/components/dark-mode-toggle';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', statusFilter],
    queryFn: () =>
      getTasks(statusFilter !== 'all' ? { status: statusFilter } : undefined),
  });

  // Create task mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', statusFilter]);

      // Optimistically update
      queryClient.setQueryData(['tasks', statusFilter], (old: any) => {
        if (!old) return old;
        const optimisticTask: Task = {
          id: Date.now(), // Temporary ID
          title: newTask.title,
          description: newTask.description || null,
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          completed: false,
          due_date: newTask.due_date || null,
          tags: newTask.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return {
          ...old,
          data: [optimisticTask, ...old.data],
          meta: { ...old.meta, total: old.meta.total + 1 },
        };
      });

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsFormOpen(false);
      toast.success('Task created successfully!');
    },
    onError: (_error, _newTask, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', statusFilter], context.previousTasks);
      }
      toast.error('Failed to create task. Please try again.');
    },
  });

  // Update task mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks', statusFilter]);

      queryClient.setQueryData(['tasks', statusFilter], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((task: Task) =>
            task.id === id ? { ...task, ...data, updated_at: new Date().toISOString() } : task
          ),
        };
      });

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      toast.success('Task updated successfully!');
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', statusFilter], context.previousTasks);
      }
      toast.error('Failed to update task. Please try again.');
    },
  });

  // Delete task mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks', statusFilter]);

      queryClient.setQueryData(['tasks', statusFilter], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((task: Task) => task.id !== id),
          meta: { ...old.meta, total: old.meta.total - 1 },
        };
      });

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (_error, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', statusFilter], context.previousTasks);
      }
      toast.error('Failed to delete task. Please try again.');
    },
  });

  const handleCreateTask = (taskData: TaskCreate) => {
    createMutation.mutate(taskData);
  };

  const handleUpdateTask = (id: number, data: Partial<Task>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleComplete = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      data: { completed: !task.completed },
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <main className="min-h-screen bg-gradient-professional relative">
      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0wLTR2LTJoLTJ2Mmgyem0yIDJ2LTJoLTJ2Mmgyem0wIDR2LTJoLTJ2Mmgyem0yLTJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMC00di0yaC0ydjJoMnptMiAydi0yaC0ydjJoMnptMCA0di0yaC0ydjJoMnptMi0ydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <div className="relative mx-auto max-w-7xl px-lg py-2xl sm:px-xl lg:px-2xl">
        {/* Header */}
        <div className="mb-2xl flex items-start justify-between gap-lg">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-foreground drop-shadow-sm">Todo App</h1>
            
            <p className="mt-sm text-base leading-normal text-muted-foreground">
              Manage your tasks efficiently with our production-ready todo application
            </p>
          </div>
          <DarkModeToggle />
        </div>

        {/* Actions */}
        <div className="mb-xl flex flex-col gap-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-sm flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'todo' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('todo')}
            >
              Todo
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>

          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            + New Task
          </Button>
        </div>

        {/* Create Task Modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>

        {/* Edit Task Modal */}
        {editingTask && (
          <Modal
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            title="Edit Task"
            size="lg"
          >
            <TaskForm
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
              isSubmitting={updateMutation.isPending}
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description || '',
                status: editingTask.status,
                priority: editingTask.priority,
                due_date: editingTask.due_date || '',
                tags: editingTask.tags || [],
              }}
            />
          </Modal>
        )}

        {/* Task List */}
        {isLoading && <TaskListSkeleton count={6} />}

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-lg">
            <p className="text-base leading-normal text-destructive">Error loading tasks. Please try again.</p>
          </div>
        )}

        {data && (
          <>
            {data.data.length === 0 ? (
              <EmptyState onAddTask={() => setIsFormOpen(true)} />
            ) : (
              <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((task, index) => (
                  <div
                    key={task.id}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTask}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Info */}
            {data.meta.total > 0 && (
              <div className="mt-xl text-center text-sm leading-tight text-muted-foreground">
                Showing {data.data.length} of {data.meta.total} tasks
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
