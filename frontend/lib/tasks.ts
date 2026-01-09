/**
 * Task API service.
 */

import { apiRequest } from './api-client';
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskStatus,
} from '@/types/task';

/**
 * Fetch paginated list of tasks.
 */
export async function getTasks(params?: {
  skip?: number;
  limit?: number;
  status?: TaskStatus;
  completed?: boolean;
}): Promise<TaskListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.completed !== undefined)
    queryParams.append('completed', params.completed.toString());

  const url = `/tasks/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiRequest<TaskListResponse>('GET', url);
}

/**
 * Fetch a single task by ID.
 */
export async function getTask(taskId: number): Promise<Task> {
  return apiRequest<Task>('GET', `/tasks/${taskId}`);
}

/**
 * Create a new task.
 */
export async function createTask(task: TaskCreate): Promise<Task> {
  return apiRequest<Task>('POST', '/tasks/', task);
}

/**
 * Update an existing task.
 */
export async function updateTask(taskId: number, task: TaskUpdate): Promise<Task> {
  return apiRequest<Task>('PUT', `/tasks/${taskId}`, task);
}

/**
 * Delete a task.
 */
export async function deleteTask(taskId: number): Promise<void> {
  return apiRequest<void>('DELETE', `/tasks/${taskId}`);
}
