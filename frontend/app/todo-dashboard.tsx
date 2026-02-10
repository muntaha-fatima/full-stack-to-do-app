/**
 * Home page - Task list view.
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import type { Task, TaskCreate, TaskStatus, TaskListResponse } from '@/types/task';
import { TaskForm } from '@/components/task-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/modal';
import { TaskListSimple } from '@/components/task-list-simple';
import {
  PlusCircle,
  Clock,
  Circle,
  CheckCircle2,
  ListFilter,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';

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
      // Cancel outgoing refetches for all task queries
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value for current filter
      const previousTasks = queryClient.getQueryData(['tasks', statusFilter]);

      // Optimistically update for current filter
      queryClient.setQueryData<TaskListResponse>(['tasks', statusFilter], (old) => {
        if (!old) return { data: [], meta: { page: 1, per_page: 10, total: 0, total_pages: 1 } };
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

        // Only add to filtered list if it matches the current filter
        let newData = [optimisticTask, ...old.data];
        if (statusFilter !== 'all' && statusFilter !== optimisticTask.status) {
          // If the new task doesn't match the current filter, don't add it to the filtered list
          newData = old.data;
        }

        return {
          ...old,
          data: newData,
          meta: { ...old.meta, total: (old.meta?.total || 0) + 1 },
        };
      });

      return { previousTasks };
    },
    onSuccess: () => {
      // Invalidate all task queries to refresh all filters
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

      queryClient.setQueryData<TaskListResponse>(['tasks', statusFilter], (old) => {
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

      queryClient.setQueryData<TaskListResponse>(['tasks', statusFilter], (old) => {
        if (!old) return { data: [], meta: { page: 1, per_page: 10, total: 0, total_pages: 1 } };
        return {
          ...old,
          data: old.data.filter((task: Task) => task.id !== id),
          meta: { ...old.meta, total: Math.max(0, (old.meta?.total || 0) - 1) },
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
    <main className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #DCE9F2, #FFFFFF)' }}>
      {/* Enhanced smoky background effects with pink and purple tones */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/15 blur-3xl"></div>
        <div className="absolute top-3/4 right-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-purple-500/15 to-pink-400/20 blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300/10 to-purple-400/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-300/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/15 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/15 blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-blue))] flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-white text-lg">TD</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-purple))] dark:from-cyan-400 dark:to-purple-400">
                  Todo Dashboard
                </h1>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-muted-foreground text-lg">
                Manage your tasks efficiently with our AI-powered productivity platform
              </p>
              <Link href="/" className="mt-2 text-[hsl(var(--brand-purple))] hover:text-[hsl(var(--brand-purple)/0.8)] underline dark:text-purple-400 dark:hover:text-purple-300">
                ← Back to Landing Page
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-purple))] focus:border-transparent"
                />
              </div>

              <Badge variant="outline" className="text-sm border-[hsl(var(--brand-purple))/0.3] text-[hsl(var(--brand-purple))] bg-[hsl(var(--brand-purple))/0.2] backdrop-blur-sm dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800/30">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                {data?.meta?.total || 0} tasks
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/30 backdrop-blur-lg border border-border/50 hover:border-[hsl(var(--brand-purple))/0.5] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{data?.meta?.total || 0}</p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--brand-purple))/0.1] backdrop-blur-sm rounded-lg">
                    <ListFilter className="h-6 w-6 text-[hsl(var(--brand-purple))]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/30 backdrop-blur-lg border border-border/50 hover:border-[hsl(var(--brand-teal))/0.5] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">To Do</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data?.data ? data.data.filter(t => t.status === 'todo').length : 0}
                    </p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--brand-teal))/0.1] backdrop-blur-sm rounded-full">
                    <Circle className="h-6 w-6 text-[hsl(var(--brand-teal))]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/30 backdrop-blur-lg border border-border/50 hover:border-[hsl(var(--brand-amber))/0.5] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data?.data ? data.data.filter(t => t.status === 'in_progress').length : 0}
                    </p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--brand-amber))/0.1] backdrop-blur-sm rounded-full">
                    <Clock className="h-6 w-6 text-[hsl(var(--brand-amber))]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/30 backdrop-blur-lg border border-border/50 hover:border-[hsl(var(--brand-rose))/0.5] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Completed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {data?.data ? data.data.filter(t => t.status === 'completed').length : 0}
                    </p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--brand-rose))/0.1] backdrop-blur-sm rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-[hsl(var(--brand-rose))]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={`flex items-center gap-2 ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-violet))] hover:from-[hsl(var(--brand-purple)/0.8)] hover:to-[hsl(var(--brand-violet)/0.8)] text-white'
                    : 'bg-background/50 border-border text-foreground hover:bg-secondary'
                }`}
              >
                <ListFilter className="h-4 w-4" />
                All
              </Button>
              <Button
                variant={statusFilter === 'todo' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('todo')}
                className={`flex items-center gap-2 ${
                  statusFilter === 'todo'
                    ? 'bg-gradient-to-r from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-emerald))] hover:from-[hsl(var(--brand-teal)/0.8)] hover:to-[hsl(var(--brand-emerald)/0.8)] text-white'
                    : 'bg-background/50 border-border text-foreground hover:bg-secondary'
                }`}
              >
                <Circle className="h-4 w-4" />
                Todo
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in_progress')}
                className={`flex items-center gap-2 ${
                  statusFilter === 'in_progress'
                    ? 'bg-gradient-to-r from-[hsl(var(--brand-amber))] to-[hsl(var(--brand-orange))] hover:from-[hsl(var(--brand-amber)/0.8)] hover:to-[hsl(var(--brand-orange)/0.8)] text-white'
                    : 'bg-background/50 border-border text-foreground hover:bg-secondary'
                }`}
              >
                <Clock className="h-4 w-4" />
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                className={`flex items-center gap-2 ${
                  statusFilter === 'completed'
                    ? 'bg-gradient-to-r from-[hsl(var(--brand-rose))] to-[hsl(var(--brand-pink))] hover:from-[hsl(var(--brand-rose)/0.8)] hover:to-[hsl(var(--brand-pink)/0.8)] text-white'
                    : 'bg-background/50 border-border text-foreground hover:bg-secondary'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[hsl(var(--brand-purple))/0.5] text-[hsl(var(--brand-purple))] hover:bg-[hsl(var(--brand-purple))/0.1]"
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-violet))] hover:from-[hsl(var(--brand-purple)/0.8)] hover:to-[hsl(var(--brand-violet)/0.8)] text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(var(--brand-purple))]"></div>
          </div>
        ) : (
          <TaskListSimple
            tasks={data?.data || []}
            isLoading={isLoading}
            error={error}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onTaskToggleComplete={handleToggleComplete}
            onAddTask={() => setIsFormOpen(true)}
          />
        )}
      </div>
    </main>
  );
}