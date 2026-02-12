'use client';

import { Task } from '@/types/task';
import { TaskCard } from './task-card';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ListFilter, PlusCircle } from 'lucide-react';

interface TaskListSimpleProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: number) => void;
  onTaskToggleComplete: (task: Task) => void;
  onAddTask: () => void;
}

export function TaskListSimple({
  tasks,
  isLoading,
  error,
  onTaskEdit,
  onTaskDelete,
  onTaskToggleComplete,
  onAddTask,
}: TaskListSimpleProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading tasks: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ListFilter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            Get started by creating a new task.
          </p>
          <Button
            onClick={onAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-in fade-in-50 duration-300"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <TaskCard
            task={task}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            onToggleComplete={onTaskToggleComplete}
          />
        </div>
      ))}
    </div>
  );
}