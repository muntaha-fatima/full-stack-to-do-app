/**
 * Collaboration type definitions.
 */

export interface TaskAssignment {
  id: number;
  task_id: number;
  assigned_by: number; // user ID of the assigner
  assignee_id: number; // user ID of the assignee
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  assigned_at: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignmentCreate {
  task_id: number;
  assignee_id: number;
  due_date?: string | null;
}

export interface TaskAssignmentUpdate {
  status?: 'accepted' | 'declined' | 'completed';
  due_date?: string | null;
}

export interface TaskAssignmentListResponse {
  data: TaskAssignment[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface TaskComment {
  id: number;
  task_id: number;
  author_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCommentCreate {
  task_id: number;
  content: string;
}

export interface TaskCommentUpdate {
  content: string;
}

export interface TaskCommentListResponse {
  data: TaskComment[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}