'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import type { Task, TaskCreate } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/modal';
import { TaskForm } from '@/components/task-form';
import { TaskListSimple } from '@/components/task-list-simple';
import {
  Inbox,
  Calendar,
  Clock,
  CheckCircle2,
  Folder,
  Search,
  User,
  Settings,
  Plus,
  CalendarIcon,
  Flag,
  MoreHorizontal
} from 'lucide-react';

export default function TodoistDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'today' | 'upcoming' | 'completed'>('inbox');
  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Fetch tasks based on active tab
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', activeTab],
    queryFn: () => {
      switch(activeTab) {
        case 'inbox':
          return getTasks({ status: 'todo' });
        case 'today':
          return getTasks({ status: 'todo' });
        case 'upcoming':
          return getTasks({ status: 'todo' });
        case 'completed':
          return getTasks({ status: 'completed' });
        default:
          return getTasks({ status: 'todo' });
      }
    },
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setQuickTaskInput('');
      toast.success('Task created successfully!');
    },
    onError: (_error) => {
      toast.error('Failed to create task. Please try again.');
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      toast.success('Task updated successfully!');
    },
    onError: (_error) => {
      toast.error('Failed to update task. Please try again.');
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (_error) => {
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

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTaskInput.trim()) {
      handleCreateTask({
        title: quickTaskInput.trim(),
        status: 'todo',
        priority: 'medium',
      });
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = data?.data?.filter(task => {
    switch(activeTab) {
      case 'inbox':
        return task.status === 'todo';
      case 'today':
        return task.status === 'todo' && task.due_date && new Date(task.due_date) <= new Date();
      case 'upcoming':
        return task.status === 'todo' && task.due_date && new Date(task.due_date) > new Date();
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-gray-800">Todoist</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-600 hover:text-gray-900"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'inbox'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Inbox className="h-5 w-5" />
                {!sidebarCollapsed && <span>Inbox</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('today')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'today'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-5 w-5" />
                {!sidebarCollapsed && <span>Today</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clock className="h-5 w-5" />
                {!sidebarCollapsed && <span>Upcoming</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('completed')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'completed'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
                {!sidebarCollapsed && <span>Completed</span>}
              </button>
            </li>
          </ul>

          {!sidebarCollapsed && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Projects
              </h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                    <Folder className="h-5 w-5" />
                    <span>Work</span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                    <Folder className="h-5 w-5" />
                    <span>Personal</span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                    <Folder className="h-5 w-5" />
                    <span>Shopping</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab === 'inbox' && 'Inbox'}
                {activeTab === 'today' && 'Today'}
                {activeTab === 'upcoming' && 'Upcoming'}
                {activeTab === 'completed' && 'Completed'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Add Task */}
        <div className="p-4 bg-white border-b border-gray-200">
          <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Add a new task…"
                value={quickTaskInput}
                onChange={(e) => setQuickTaskInput(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add
            </Button>
          </form>
        </div>

        {/* Task List */}
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <TaskListSimple
            tasks={filteredTasks}
            isLoading={isLoading}
            error={error}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onTaskToggleComplete={handleToggleComplete}
            onAddTask={() => setIsFormOpen(true)}
          />
        </main>
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
    </div>
  );
}