/**
 * MSW handlers for API mocking in tests
 */

import { http, HttpResponse } from 'msw';
import type { Task, TaskCreate } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  // GET /tasks - Retrieve all tasks
  http.get(`${API_URL}/tasks`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let filteredTasks = mockTasks;
    if (status && status !== 'all') {
      filteredTasks = mockTasks.filter((task) => task.status === status);
    }

    return HttpResponse.json({
      data: filteredTasks,
      meta: {
        total: filteredTasks.length,
        page: 1,
        per_page: 10,
      },
    });
  }),

  // GET /tasks/:id - Retrieve single task
  http.get(`${API_URL}/tasks/:id`, ({ params }) => {
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

  // POST /tasks - Create new task
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const body = (await request.json()) as TaskCreate;

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

  // PATCH /tasks/:id - Update task
  http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Task>;

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

  // DELETE /tasks/:id - Delete task
  http.delete(`${API_URL}/tasks/:id`, ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex((t) => t.id === Number(id));

    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    mockTasks.splice(taskIndex, 1);

    return HttpResponse.json(null, { status: 204 });
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
