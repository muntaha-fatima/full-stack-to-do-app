/**
 * Task API service.
 */

import { apiRequest } from './api-client';
import { getUser } from './auth';
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskStatus,
} from '@/types/task';

/**
 * Helper function to validate and format date strings
 */
function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;

  try {
    // Parse the date string and create a proper ISO string
    const date = new Date(dateStr);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date provided: ${dateStr}`);
      return null;
    }

    // Format to ISO string with proper separators
    return date.toISOString();
  } catch (error) {
    console.warn(`Error formatting date: ${dateStr}`, error);
    return null;
  }
}

/**
 * Fetch paginated list of tasks for the current user.
 */
export async function getTasks(params?: {
  skip?: number;
  limit?: number;
  status?: TaskStatus;
  completed?: boolean;
}): Promise<TaskListResponse> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  const queryParams = new URLSearchParams();

  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.completed !== undefined)
    queryParams.append('completed', params.completed.toString());

  const url = `/api/${userId}/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiRequest<TaskListResponse>('GET', url);
}

/**
 * Fetch a single task by ID for the current user.
 */
export async function getTask(taskId: number): Promise<Task> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  return apiRequest<Task>('GET', `/api/${userId}/tasks/${taskId}`);
}

/**
 * Create a new task for the current user.
 */
export async function createTask(task: TaskCreate): Promise<Task> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  // Validate required fields
  if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
    throw new Error('Task title is required and must be a non-empty string');
  }

  // Sanitize and normalize the task data with proper date formatting
  const sanitizedTask: TaskCreate = {
    title: task.title.trim(),
    description: task.description ? task.description.trim() : null,
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    due_date: formatDate(task.due_date), // Format the date properly
    tags: Array.isArray(task.tags) ? task.tags : []
  };

  console.log('Creating task with data:', sanitizedTask); // Debug log
  console.log('Current user ID:', userId); // Debug log

  // Make sure we have a valid user ID
  if (!userId) {
    throw new Error('User ID is required to create a task');
  }

  return apiRequest<Task>('POST', `/api/${userId}/tasks`, sanitizedTask);
}

/**
 * Update an existing task for the current user.
 */
export async function updateTask(taskId: number, task: TaskUpdate): Promise<Task> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  // Sanitize and normalize the task data with proper date formatting
  const sanitizedTask: TaskUpdate = {
    title: task.title ? task.title.trim() : undefined,
    description: task.description ? task.description.trim() : undefined,
    status: task.status,
    priority: task.priority,
    completed: task.completed,
    due_date: formatDate(task.due_date), // Format the date properly
    tags: Array.isArray(task.tags) ? task.tags : undefined
  };

  return apiRequest<Task>('PUT', `/api/${userId}/tasks/${taskId}`, sanitizedTask);
}

/**
 * Delete a task for the current user.
 */
export async function deleteTask(taskId: number): Promise<void> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  return apiRequest<void>('DELETE', `/api/${userId}/tasks/${taskId}`);
}

/**
 * Toggle completion status of a task for the current user.
 */
export async function toggleTaskCompletion(taskId: number): Promise<Task> {
  // Get the current user's ID
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.id;

  return apiRequest<Task>('PATCH', `/api/${userId}/tasks/${taskId}/complete`);
}
