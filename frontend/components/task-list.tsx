'use client';

import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Flag,
  Pencil,
  Trash2
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onTaskClick: (task: Task) => void;
}

export default function TaskList({
  tasks,
  isLoading,
  error,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onTaskClick
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="h-12 w-12 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading tasks</h3>
        <p className="text-gray-500">There was a problem loading your tasks. Please try again.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="h-12 w-12 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">You're all caught up 🎉</h3>
        <p className="text-gray-500">Add a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onTaskClick(task)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task);
              }}
              className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {task.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
            </button>

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
              <Flag className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            {task.priority === 'medium' && (
              <Flag className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            )}
            {task.priority === 'low' && (
              <Flag className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}

            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}