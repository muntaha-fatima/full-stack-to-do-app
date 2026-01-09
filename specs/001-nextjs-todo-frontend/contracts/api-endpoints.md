# API Contracts

**Feature**: Next.js Todo App Frontend (Phase II)
**Date**: 2026-01-08
**Purpose**: Define API endpoints consumed by the frontend

## Overview

This document defines the API contracts between the Next.js frontend and the FastAPI backend. The backend API is already implemented - this document serves as the **frontend's specification** of expected behavior.

**Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable

**Content Type**: `application/json`

**Authentication**: None (Phase II - authentication is a separate feature)

---

## Endpoints

### 1. List All Tasks

**Endpoint**: `GET /tasks`

**Description**: Retrieve all tasks for the current user (no pagination in Phase II)

**Request**:
```http
GET /tasks HTTP/1.1
Host: {NEXT_PUBLIC_API_URL}
Accept: application/json
```

**Success Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the new feature",
    "completed": false,
    "priority": "high",
    "tags": ["documentation", "urgent"],
    "created_at": "2026-01-08T10:30:00Z",
    "updated_at": "2026-01-08T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Review pull requests",
    "description": null,
    "completed": true,
    "priority": "medium",
    "tags": ["code-review"],
    "created_at": "2026-01-07T14:20:00Z",
    "updated_at": "2026-01-08T09:15:00Z"
  }
]
```

**Response Schema**:
- Type: Array of Task objects
- Can be empty array if no tasks exist
- Tasks in any order (frontend will handle sorting)

**Error Responses**:

| Status | Description | Response Body |
|--------|-------------|---------------|
| 500 | Server error | `{"detail": "Internal server error"}` |
| 503 | Service unavailable | `{"detail": "Service temporarily unavailable"}` |

**Frontend Handling**:
- **Success**: Display tasks in TaskList component
- **Empty array**: Show empty state with "Add your first task" message
- **Error**: Show error toast with user-friendly message, allow retry

**React Query Hook**:
```typescript
// lib/hooks/useTasks.ts
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      return TaskSchema.array().parse(data); // Validate with Zod
    },
  });
}
```

---

### 2. Create Task

**Endpoint**: `POST /tasks`

**Description**: Create a new task

**Request**:
```http
POST /tasks HTTP/1.1
Host: {NEXT_PUBLIC_API_URL}
Content-Type: application/json
Accept: application/json

{
  "title": "New task title",
  "description": "Optional description",
  "priority": "medium",
  "tags": ["tag1", "tag2"]
}
```

**Request Schema**:
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string | null (optional, max 1000 chars)",
  "priority": "low | medium | high (optional, default: low)",
  "tags": "string[] (optional, default: [])"
}
```

**Success Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "New task title",
  "description": "Optional description",
  "completed": false,
  "priority": "medium",
  "tags": ["tag1", "tag2"],
  "created_at": "2026-01-08T11:45:00Z",
  "updated_at": "2026-01-08T11:45:00Z"
}
```

**Response Schema**:
- Type: Task object
- Includes server-generated `id`, `created_at`, `updated_at`
- `completed` defaults to `false`

**Error Responses**:

| Status | Description | Response Body |
|--------|-------------|---------------|
| 400 | Validation error | `{"detail": "Title is required"}` |
| 422 | Unprocessable entity | `{"detail": [{"loc": ["body", "title"], "msg": "field required"}]}` |
| 500 | Server error | `{"detail": "Internal server error"}` |

**Frontend Handling**:
- **Success**: Add task to list (optimistic update), show success toast
- **Validation error**: Show error message in form, keep modal open
- **Server error**: Remove optimistic task, show error toast, reopen modal with data

**React Query Hook**:
```typescript
// lib/hooks/useCreateTask.ts
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const data = await response.json();
      return TaskSchema.parse(data);
    },
    onMutate: async (newTask) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) => [
        ...old,
        { ...newTask, id: 'temp-' + Date.now(), completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]);
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

---

### 3. Update Task

**Endpoint**: `PATCH /tasks/{id}`

**Description**: Update an existing task (partial updates supported)

**Request**:
```http
PATCH /tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: {NEXT_PUBLIC_API_URL}
Content-Type: application/json
Accept: application/json

{
  "completed": true,
  "priority": "low"
}
```

**Request Schema**:
```json
{
  "title": "string (optional, 1-200 chars)",
  "description": "string | null (optional, max 1000 chars)",
  "completed": "boolean (optional)",
  "priority": "low | medium | high (optional)",
  "tags": "string[] (optional)"
}
```

**Note**: At least one field must be provided. All fields are optional.

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the new feature",
  "completed": true,
  "priority": "low",
  "tags": ["documentation", "urgent"],
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T12:00:00Z"
}
```

**Response Schema**:
- Type: Task object
- Returns complete task with all fields
- `updated_at` reflects the update time

**Error Responses**:

| Status | Description | Response Body |
|--------|-------------|---------------|
| 400 | Validation error | `{"detail": "Invalid priority value"}` |
| 404 | Task not found | `{"detail": "Task not found"}` |
| 422 | Unprocessable entity | `{"detail": [{"loc": ["body", "title"], "msg": "ensure this value has at most 200 characters"}]}` |
| 500 | Server error | `{"detail": "Internal server error"}` |

**Frontend Handling**:
- **Success**: Update task in list (optimistic update), show success toast
- **Not found**: Remove from list, show error toast
- **Validation error**: Revert optimistic update, show error in form
- **Server error**: Revert optimistic update, show error toast

**React Query Hook**:
```typescript
// lib/hooks/useUpdateTask.ts
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTaskInput }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const data = await response.json();
      return TaskSchema.parse(data);
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(task => task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task)
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

---

### 4. Delete Task

**Endpoint**: `DELETE /tasks/{id}`

**Description**: Permanently delete a task

**Request**:
```http
DELETE /tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: {NEXT_PUBLIC_API_URL}
Accept: application/json
```

**Success Response** (204 No Content):
```http
HTTP/1.1 204 No Content
```

**Alternative Success Response** (200 OK):
```json
{
  "message": "Task deleted successfully"
}
```

**Note**: Frontend should handle both 204 (no body) and 200 (with body) responses.

**Error Responses**:

| Status | Description | Response Body |
|--------|-------------|---------------|
| 404 | Task not found | `{"detail": "Task not found"}` |
| 500 | Server error | `{"detail": "Internal server error"}` |

**Frontend Handling**:
- **Success**: Remove task from list (optimistic update), show success toast
- **Not found**: Already removed, show info toast
- **Server error**: Restore task to list, show error toast

**React Query Hook**:
```typescript
// lib/hooks/useDeleteTask.ts
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete task');
      }
      // Handle both 204 (no content) and 200 (with content)
      if (response.status === 204) return null;
      return response.json();
    },
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.filter(task => task.id !== id)
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

---

## Error Handling Strategy

### HTTP Status Code Mapping

| Status Range | Frontend Interpretation | User Message |
|--------------|------------------------|--------------|
| 200-299 | Success | Show success toast (if applicable) |
| 400-499 | Client error | Show specific error from API or validation message |
| 500-599 | Server error | "Something went wrong. Please try again." |
| Network error | Connection issue | "Unable to connect. Check your internet connection." |
| Timeout | Request timeout | "Request timed out. Please try again." |

### Error Response Format

Backend should return errors in this format:

```json
{
  "detail": "Human-readable error message"
}
```

Or for validation errors:

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Error message",
      "type": "value_error"
    }
  ]
}
```

### Frontend Error Parsing

```typescript
// lib/utils/api-error.ts
export function parseApiError(error: unknown): string {
  if (error instanceof Response) {
    // Handle HTTP error responses
    if (error.status >= 500) {
      return 'Something went wrong. Please try again.';
    }
    // Parse error body
    return error.json().then(data => data.detail || 'An error occurred');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
```

---

## Request/Response Examples

### Example 1: Create Task with Minimal Data

**Request**:
```json
{
  "title": "Buy groceries"
}
```

**Response**:
```json
{
  "id": "abc123",
  "title": "Buy groceries",
  "description": null,
  "completed": false,
  "priority": "low",
  "tags": [],
  "created_at": "2026-01-08T13:00:00Z",
  "updated_at": "2026-01-08T13:00:00Z"
}
```

### Example 2: Toggle Task Completion

**Request**:
```json
{
  "completed": true
}
```

**Response**:
```json
{
  "id": "abc123",
  "title": "Buy groceries",
  "description": null,
  "completed": true,
  "priority": "low",
  "tags": [],
  "created_at": "2026-01-08T13:00:00Z",
  "updated_at": "2026-01-08T13:05:00Z"
}
```

### Example 3: Update Multiple Fields

**Request**:
```json
{
  "title": "Buy groceries and cook dinner",
  "priority": "high",
  "tags": ["shopping", "cooking"]
}
```

**Response**:
```json
{
  "id": "abc123",
  "title": "Buy groceries and cook dinner",
  "description": null,
  "completed": true,
  "priority": "high",
  "tags": ["shopping", "cooking"],
  "created_at": "2026-01-08T13:00:00Z",
  "updated_at": "2026-01-08T13:10:00Z"
}
```

---

## Performance Considerations

### Request Timeouts

```typescript
// lib/utils/fetch-with-timeout.ts
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
```

### Request Deduplication

React Query automatically deduplicates identical requests made within a short time window. No additional configuration needed.

### Retry Strategy

```typescript
// lib/react-query/config.ts
export const queryConfig = {
  queries: {
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Response && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for 5xx errors
      return failureCount < 3;
    },
  },
};
```

---

## CORS Requirements

Backend must allow requests from frontend origin:

```
Access-Control-Allow-Origin: http://localhost:3000 (development)
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

---

## Testing Strategy

### Contract Testing

Use Mock Service Worker (MSW) to mock API responses in tests:

```typescript
// lib/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', title: 'Test task', completed: false, priority: 'low', tags: [], created_at: '2026-01-08T10:00:00Z', updated_at: '2026-01-08T10:00:00Z' }
    ]));
  }),

  rest.post('/tasks', (req, res, ctx) => {
    const body = req.body as CreateTaskInput;
    return res(ctx.status(201), ctx.json({
      id: 'new-id',
      ...body,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }),
];
```

### Integration Testing

Test complete user flows with mocked API:

```typescript
// __tests__/integration/task-crud.test.tsx
test('user can create, edit, and delete a task', async () => {
  render(<App />);

  // Create task
  await userEvent.click(screen.getByRole('button', { name: /add task/i }));
  await userEvent.type(screen.getByLabelText(/title/i), 'New task');
  await userEvent.click(screen.getByRole('button', { name: /save/i }));

  // Verify task appears
  expect(await screen.findByText('New task')).toBeInTheDocument();

  // Edit task
  await userEvent.click(screen.getByRole('button', { name: /edit/i }));
  await userEvent.clear(screen.getByLabelText(/title/i));
  await userEvent.type(screen.getByLabelText(/title/i), 'Updated task');
  await userEvent.click(screen.getByRole('button', { name: /save/i }));

  // Verify update
  expect(await screen.findByText('Updated task')).toBeInTheDocument();

  // Delete task
  await userEvent.click(screen.getByRole('button', { name: /delete/i }));

  // Verify deletion
  await waitFor(() => {
    expect(screen.queryByText('Updated task')).not.toBeInTheDocument();
  });
});
```

---

## Future Enhancements (Out of Scope)

- Pagination for large task lists
- Filtering and sorting endpoints
- Batch operations (bulk delete, bulk update)
- Task search endpoint
- WebSocket for real-time updates
- File upload for task attachments
