/**
 * MSW handlers for API mocking in tests
 */

import { http, HttpResponse } from 'msw';
import type { Task, TaskCreate } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space/';

// Mock task data
let mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'This is a test task',
    status: 'todo',
    priority: 'high',
    completed: false,
    due_date: null,
    tags: ['urgent', 'frontend'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Another test task',
    status: 'in_progress',
    priority: 'medium',
    completed: false,
    due_date: null,
    tags: ['backend', 'api'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const handlers = [
  // GET /api/:userId/tasks - Retrieve all tasks for a user
  http.get(`${API_URL}/api/:userId/tasks`, ({ params }) => {
    const { userId } = params;

    // In a real scenario, we'd filter by userId, but for mock we'll return all
    // Using the userId variable to satisfy TypeScript
    if (!userId) {
      console.warn('Warning: userId is undefined in task fetch');
    }
    
    return HttpResponse.json({
      data: mockTasks,
      meta: {
        total: mockTasks.length,
        page: 1,
        per_page: 10,
        total_pages: 1
      },
    });
  }),

  // GET /api/:userId/tasks/:id - Retrieve single task
  http.get(`${API_URL}/api/:userId/tasks/:id`, ({ params }) => {
    const { id } = params;
    const task = mockTasks.find((t) => t.id === Number(id));

    if (!task) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(task);
  }),

  // POST /api/:userId/tasks - Create new task
  http.post(`${API_URL}/api/:userId/tasks`, async ({ request, params }) => {
    const { userId } = params;
    const body = (await request.json()) as TaskCreate;

    // Using userId to satisfy TypeScript
    if (!userId) {
      console.warn('Warning: userId is undefined in task creation');
    }

    const newTask: Task = {
      id: mockTasks.length + 1,
      title: body.title,
      description: body.description || null,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      completed: false,
      due_date: body.due_date || null,
      tags: body.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockTasks.push(newTask);

    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PUT /api/:userId/tasks/:id - Update task
  http.put(`${API_URL}/api/:userId/tasks/:id`, async ({ params, request }) => {
    const { id, userId } = params;
    const body = (await request.json()) as Partial<Task>;

    // Using userId to satisfy TypeScript
    if (!userId) {
      console.warn('Warning: userId is undefined in task update');
    }

    const taskIndex = mockTasks.findIndex((t) => t.id === Number(id));

    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const existingTask = mockTasks[taskIndex];
    if (!existingTask) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask: Task = {
      id: existingTask.id,
      title: body.title ?? existingTask.title,
      description: body.description !== undefined ? body.description : existingTask.description,
      status: body.status ?? existingTask.status,
      priority: body.priority ?? existingTask.priority,
      completed: body.completed ?? existingTask.completed,
      due_date: body.due_date !== undefined ? body.due_date : existingTask.due_date,
      tags: body.tags ?? existingTask.tags,
      created_at: existingTask.created_at,
      updated_at: new Date().toISOString(),
    };

    mockTasks[taskIndex] = updatedTask;

    return HttpResponse.json(updatedTask);
  }),

  // DELETE /api/:userId/tasks/:id - Delete task
  http.delete(`${API_URL}/api/:userId/tasks/:id`, ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex((t) => t.id === Number(id));

    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    mockTasks.splice(taskIndex, 1);

    return HttpResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  }),

  // PATCH /api/:userId/tasks/:id/complete - Toggle task completion
  http.patch(`${API_URL}/api/:userId/tasks/:id/complete`, ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex((t) => t.id === Number(id));

    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Toggle completion status
    const task = mockTasks[taskIndex];
    if (task) {
      task.completed = !task.completed;
      task.updated_at = new Date().toISOString();
      return HttpResponse.json(task);
    } else {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
  }),
];

// Helper function to reset mock data between tests
export function resetMockTasks() {
  mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'This is a test task',
      status: 'todo',
      priority: 'high',
      completed: false,
      due_date: null,
      tags: ['urgent', 'frontend'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Another test task',
      status: 'in_progress',
      priority: 'medium',
      completed: false,
      due_date: null,
      tags: ['backend', 'api'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
