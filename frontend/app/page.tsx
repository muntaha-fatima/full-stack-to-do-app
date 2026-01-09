/**
 * Home page - Task list view with improved UX.
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
import {
  PanelLeft,
  PlusIcon,
  FilterIcon,
  CalendarIcon,
  FlagIcon,
  CircleIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  TimerIcon
} from 'lucide-react';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Todo App</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-2">
              <Button
                variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setStatusFilter('all')}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                All Tasks
              </Button>
              <Button
                variant={statusFilter === 'todo' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setStatusFilter('todo')}
              >
                {getStatusIcon('todo')}
                <span className="ml-2">To Do</span>
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setStatusFilter('in_progress')}
              >
                {getStatusIcon('in_progress')}
                <span className="ml-2">In Progress</span>
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setStatusFilter('completed')}
              >
                {getStatusIcon('completed')}
                <span className="ml-2">Completed</span>
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <FlagIcon className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-red-500">High</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <FlagIcon className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-yellow-500">Medium</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <FlagIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-green-500">Low</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-2 lg:hidden"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            </div>

            <Button
              variant="default"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">To Do</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>

          {/* Task List */}
          {isLoading && <TaskListSkeleton count={6} />}

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-destructive">Error loading tasks. Please try again.</p>
            </div>
          )}

          {data && (
            <>
              {data.data.length === 0 ? (
                <EmptyState onAddTask={() => setIsFormOpen(true)} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((task, index) => (
                    <div
                      key={task.id}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      className="animate-fadeIn"
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
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Showing {data.data.length} of {data.meta.total} tasks
                </div>
              )}
            </>
          )}
        </div>
      </main>

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
    </div>
  );
}
