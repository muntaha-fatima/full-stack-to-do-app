'use client';

import { Task } from '@/types/task';
import { TaskCard } from './task-card';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ListFilter, PlusCircle, CircleDashed, Clock, CheckCircle2 } from 'lucide-react';
import { TaskListResponse } from '@/types/task';

interface TaskListContentProps {
  data: TaskListResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  handleDeleteTask: (id: number) => void;
  handleToggleComplete: (task: Task) => void;
  handleEditTask: (task: Task) => void;
  setIsFormOpen: (open: boolean) => void;
}

export function TaskListContent({
  data,
  isLoading,
  error,
  handleDeleteTask,
  handleToggleComplete,
  handleEditTask,
  setIsFormOpen,
}: TaskListContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#111827] border-[#ef4444]">
        <CardContent className="p-6">
          <p className="text-[#ef4444]">Error loading tasks. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#1e293b] flex items-center justify-center mb-4">
            <ListFilter className="h-8 w-8 text-[#94a3b8]" />
          </div>
          <h3 className="text-lg font-medium text-[#f1f5f9] mb-1">No tasks found</h3>
          <p className="text-[#94a3b8] mb-4">
            Get started by creating a new task.
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((task, index) => (
          <div
            key={task.id}
            className="animate-in fade-in-50 duration-300"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <TaskCard
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
            />
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      {data.meta?.total > 0 && (
        <div className="mt-6 text-center text-sm text-[#94a3b8]">
          Showing {data.data.length} of {data.meta.total} tasks
        </div>
      )}
    </>
  );
}