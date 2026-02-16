/**
 * Collaboration API functions.
 */

import {
  TaskAssignment,
  TaskAssignmentCreate,
  TaskAssignmentUpdate,
  TaskAssignmentListResponse,
  TaskComment,
  TaskCommentCreate,
  TaskCommentUpdate,
  TaskCommentListResponse
} from '@/types/collaboration';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Get task assignments
 */
export async function getTaskAssignments(
  page: number = 1,
  limit: number = 20,
  assignment_status?: string
): Promise<TaskAssignmentListResponse> {
  let url = `${API_URL}/api/v1/collaboration/assignments?page=${page}&limit=${limit}`;

  if (assignment_status) {
    url += `&assignment_status=${assignment_status}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch assignments: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a task assignment
 */
export async function createTaskAssignment(
  assignmentData: TaskAssignmentCreate
): Promise<TaskAssignment> {
  const response = await fetch(`${API_URL}/api/v1/collaboration/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(assignmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create assignment: ${response.status}`);
  }

  return response.json();
}

/**
 * Update a task assignment
 */
export async function updateTaskAssignment(
  id: number,
  assignmentData: TaskAssignmentUpdate
): Promise<TaskAssignment> {
  const response = await fetch(`${API_URL}/api/v1/collaboration/assignments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(assignmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to update assignment: ${response.status}`);
  }

  return response.json();
}

/**
 * Get task comments
 */
export async function getTaskComments(
  task_id: number,
  page: number = 1,
  limit: number = 20
): Promise<TaskCommentListResponse> {
  const url = `${API_URL}/api/v1/collaboration/comments?task_id=${task_id}&page=${page}&limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch comments: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a task comment
 */
export async function createTaskComment(
  commentData: TaskCommentCreate
): Promise<TaskComment> {
  const response = await fetch(`${API_URL}/api/v1/collaboration/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create comment: ${response.status}`);
  }

  return response.json();
}

/**
 * Update a task comment
 */
export async function updateTaskComment(
  id: number,
  commentData: TaskCommentUpdate
): Promise<TaskComment> {
  const response = await fetch(`${API_URL}/api/v1/collaboration/comments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to update comment: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a task comment
 */
export async function deleteTaskComment(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/collaboration/comments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to delete comment: ${response.status}`);
  }
}