# Feature Specification: Next.js Todo App Frontend (Phase II)

**Feature Branch**: `001-nextjs-todo-frontend`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Frontend beautiful Next.js Todo App (Phase II) - Build ONLY the Next.js frontend for the full-stack Todo application with modern, polished UI inspired by Todoist, Notion, Linear"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Manage Task List (Priority: P1)

A user opens the Todo app and sees their existing tasks displayed in a clean, organized list. They can quickly scan tasks, see priorities and tags at a glance, and mark tasks as complete with a single click.

**Why this priority**: This is the core value proposition - viewing and completing tasks. Without this, the app has no purpose. This delivers immediate value and can be fully tested independently.

**Independent Test**: Can be fully tested by loading the app, viewing the task list with various task states (complete/incomplete, different priorities, with/without tags), and toggling task completion status. Delivers the fundamental "see my tasks and check them off" value.

**Acceptance Scenarios**:

1. **Given** the user opens the app for the first time with no tasks, **When** the page loads, **Then** they see a friendly empty state message with a visual indicator and a call-to-action to add their first task
2. **Given** the user has existing tasks in the database, **When** the page loads, **Then** all tasks are fetched and displayed with title, description, priority badge, tags, and completion checkbox
3. **Given** a task is displayed, **When** the user clicks the checkbox, **Then** the task is immediately marked as complete with visual feedback (strikethrough, opacity change) and the API is called to persist the change
4. **Given** a task is marked complete, **When** the user clicks the checkbox again, **Then** the task is unmarked as complete with immediate visual feedback
5. **Given** tasks have different priorities, **When** displayed, **Then** High priority shows red badge, Medium shows orange badge, Low shows green badge
6. **Given** a task has tags, **When** displayed, **Then** tags appear as small colored chips below the title
7. **Given** the user hovers over a task, **When** the mouse enters the task area, **Then** edit and delete icons smoothly fade in
8. **Given** the page is loading tasks, **When** the API request is in progress, **Then** skeleton loaders are displayed in place of tasks

---

### User Story 2 - Add New Tasks (Priority: P1)

A user wants to capture a new task quickly. They click an "Add Task" button, a beautiful modal appears, they fill in the task details (title, description, priority, tags), and submit. The task appears instantly in their list.

**Why this priority**: Creating tasks is equally fundamental to viewing them. Together with P1, this forms the minimum viable product. Users can't use a todo app if they can't add tasks.

**Independent Test**: Can be fully tested by clicking the add button, filling the form with various combinations of fields (required/optional), submitting, and verifying the task appears in the list and is persisted to the API.

**Acceptance Scenarios**:

1. **Given** the user is viewing the task list, **When** they click the "Add Task" button (floating or fixed), **Then** a centered modal opens with a clean form
2. **Given** the add task modal is open, **When** the user enters a title (required), **Then** the submit button becomes enabled
3. **Given** the user fills in task details, **When** they click submit, **Then** the modal closes, the task appears immediately in the list (optimistic update), and a success toast notification appears
4. **Given** the user submits a new task, **When** the API request completes successfully, **Then** the task is persisted with a server-generated ID
5. **Given** the user submits a new task, **When** the API request fails, **Then** the optimistic task is removed, an error toast appears with a user-friendly message, and the modal reopens with the user's data preserved
6. **Given** the add task modal is open, **When** the user clicks outside the modal or presses Escape, **Then** the modal closes without saving
7. **Given** the user is filling the form, **When** they leave the title field empty and try to submit, **Then** validation feedback appears indicating the title is required
8. **Given** the user selects a priority, **When** viewing the form, **Then** the priority selector shows clear visual states (High/Medium/Low) with appropriate colors

---

### User Story 3 - Edit Existing Tasks (Priority: P2)

A user realizes they need to update a task's details. They click the edit icon on a task, the same beautiful modal appears pre-filled with the task's current data, they make changes, and submit. The task updates instantly.

**Why this priority**: Editing is important but not critical for MVP. Users can work around missing edit functionality by deleting and recreating tasks. However, it's essential for a polished experience.

**Independent Test**: Can be fully tested by clicking edit on an existing task, modifying various fields, submitting, and verifying the changes appear immediately and are persisted.

**Acceptance Scenarios**:

1. **Given** the user hovers over a task, **When** they click the edit icon, **Then** the task modal opens pre-filled with all current task data
2. **Given** the edit modal is open, **When** the user modifies any field and submits, **Then** the task updates immediately in the list (optimistic update) and a success toast appears
3. **Given** the user submits task edits, **When** the API request fails, **Then** the task reverts to its previous state, an error toast appears, and the modal reopens with the user's attempted changes
4. **Given** the user opens the edit modal, **When** they click cancel or close, **Then** the modal closes without saving changes

---

### User Story 4 - Delete Tasks (Priority: P2)

A user wants to remove a completed or unwanted task. They click the delete icon, receive a confirmation prompt (optional but recommended), confirm, and the task disappears immediately.

**Why this priority**: Deletion is important for task management but not critical for initial MVP. Users can tolerate accumulating completed tasks temporarily. However, it's expected in any production todo app.

**Independent Test**: Can be fully tested by clicking delete on a task, confirming the action, and verifying the task is removed from the list and deleted via the API.

**Acceptance Scenarios**:

1. **Given** the user hovers over a task, **When** they click the delete icon, **Then** the task is immediately removed from the list (optimistic update) and a success toast appears
2. **Given** the user deletes a task, **When** the API request completes successfully, **Then** the task is permanently deleted
3. **Given** the user deletes a task, **When** the API request fails, **Then** the task reappears in the list and an error toast appears
4. **Given** the user accidentally deletes a task, **When** they see the success toast, **Then** an "Undo" action is available for 5 seconds (optional enhancement)

---

### User Story 5 - Dark Mode Toggle (Priority: P3)

A user prefers working in dark mode or switches between light and dark based on time of day. They click a toggle in the header, and the entire interface smoothly transitions to dark mode with appropriate color adjustments.

**Why this priority**: Dark mode is a nice-to-have feature that enhances user experience but isn't critical for core functionality. It's expected in modern apps but can be added after core features work.

**Independent Test**: Can be fully tested by clicking the dark mode toggle and verifying all UI elements transition to appropriate dark theme colors with proper contrast ratios.

**Acceptance Scenarios**:

1. **Given** the user is viewing the app in light mode, **When** they click the dark mode toggle in the header, **Then** the entire interface transitions to dark mode with smooth color changes
2. **Given** the user toggles dark mode, **When** the preference is set, **Then** it persists across page reloads (stored in localStorage)
3. **Given** the user has dark mode enabled, **When** they reload the page, **Then** the app loads directly in dark mode without flashing light mode first
4. **Given** the app is in dark mode, **When** viewing all UI elements, **Then** text contrast ratios meet WCAG AA standards (4.5:1 minimum)

---

### User Story 6 - Responsive Mobile Experience (Priority: P2)

A user accesses the todo app on their mobile phone. The interface adapts beautifully to the smaller screen with touch-friendly targets, appropriate spacing, and a mobile-optimized layout.

**Why this priority**: Mobile responsiveness is essential for a modern web app, but the desktop experience can be developed first. Many users will access the app on mobile, so this is high priority but can follow desktop implementation.

**Independent Test**: Can be fully tested by accessing the app on various screen sizes (mobile, tablet, desktop) and verifying layout adapts appropriately with no horizontal scrolling or broken layouts.

**Acceptance Scenarios**:

1. **Given** the user accesses the app on a mobile device (< 768px), **When** viewing the task list, **Then** tasks display in a single column with appropriate touch targets (minimum 44x44px)
2. **Given** the user is on mobile, **When** they open the add/edit modal, **Then** the modal takes up the full screen or slides up from bottom for better mobile UX
3. **Given** the user is on tablet (768px - 1024px), **When** viewing the task list, **Then** tasks display in a 2-column grid
4. **Given** the user is on desktop (> 1024px), **When** viewing the task list, **Then** tasks display in a 3-column grid with appropriate spacing
5. **Given** the user is on any device, **When** they interact with buttons and controls, **Then** all interactive elements have appropriate hover/focus states

---

### Edge Cases

- What happens when the API is unreachable or times out? → Display user-friendly error message, allow retry, show cached data if available
- What happens when a user tries to submit a task with only whitespace in the title? → Validation prevents submission and shows error message
- What happens when the API returns a 500 error? → Show generic error message ("Something went wrong, please try again") without exposing technical details
- What happens when a user has hundreds of tasks? → Implement pagination or infinite scroll (future enhancement), ensure performance doesn't degrade
- What happens when two users edit the same task simultaneously? → Last write wins (acceptable for Phase II), consider optimistic locking in future
- What happens when the user's network connection is slow? → Show loading states, implement request timeouts (10 seconds), allow cancellation
- What happens when a user rapidly clicks the complete checkbox? → Debounce or disable during API request to prevent race conditions
- What happens when the modal is open and the user navigates away? → Modal closes automatically, unsaved changes are lost (warn user if desired)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all tasks fetched from the backend API at GET /tasks endpoint
- **FR-002**: System MUST allow users to create new tasks via POST /tasks with title (required), description (optional), priority (optional, default: Low), and tags (optional)
- **FR-003**: System MUST allow users to mark tasks as complete/incomplete via PATCH /tasks/{id} with optimistic UI updates
- **FR-004**: System MUST allow users to edit existing tasks via PATCH /tasks/{id} with all fields editable
- **FR-005**: System MUST allow users to delete tasks via DELETE /tasks/{id} with optimistic UI updates
- **FR-006**: System MUST display priority badges with color coding: High (red), Medium (orange), Low (green)
- **FR-007**: System MUST display tags as small colored chips with consistent styling
- **FR-008**: System MUST show loading skeletons while fetching tasks from the API
- **FR-009**: System MUST show user-friendly error messages when API requests fail (no raw error objects)
- **FR-010**: System MUST display an empty state with friendly message and visual when no tasks exist
- **FR-011**: System MUST show success/error toast notifications for all create/update/delete operations
- **FR-012**: System MUST implement optimistic updates for all mutations (create/update/delete) with rollback on failure
- **FR-013**: System MUST support dark mode toggle with preference persistence in localStorage
- **FR-014**: System MUST be fully responsive across mobile (< 768px), tablet (768-1024px), and desktop (> 1024px) breakpoints
- **FR-015**: System MUST show edit and delete icons on task hover (desktop) or always visible (mobile)
- **FR-016**: System MUST validate task title as required before allowing submission
- **FR-017**: System MUST read API base URL from environment variable NEXT_PUBLIC_API_URL
- **FR-018**: System MUST implement keyboard navigation for all interactive elements
- **FR-019**: System MUST provide ARIA labels for accessibility where semantic HTML is insufficient
- **FR-020**: System MUST implement smooth transitions and micro-interactions for all state changes

### Key Entities

- **Task**: Represents a todo item with the following attributes:
  - id: Unique identifier (generated by backend)
  - title: Task name/summary (required, string, max 200 characters)
  - description: Detailed task information (optional, string, max 1000 characters)
  - completed: Completion status (boolean, default: false)
  - priority: Task priority level (enum: "high" | "medium" | "low", default: "low")
  - tags: Array of tag strings (optional, array of strings)
  - created_at: Timestamp of creation (ISO 8601 string, set by backend)
  - updated_at: Timestamp of last update (ISO 8601 string, set by backend)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their task list within 1.5 seconds of page load (First Contentful Paint < 1.5s)
- **SC-002**: Users can create a new task and see it appear in the list within 100ms (optimistic update)
- **SC-003**: Users can mark a task complete and see visual feedback within 50ms (optimistic update)
- **SC-004**: 95% of users successfully complete their first task creation on first attempt without errors
- **SC-005**: The application achieves a Lighthouse accessibility score of 90 or higher
- **SC-006**: The application achieves a Lighthouse performance score of 90 or higher
- **SC-007**: All interactive elements are keyboard accessible and have visible focus indicators
- **SC-008**: Text contrast ratios meet WCAG AA standards (4.5:1) in both light and dark modes
- **SC-009**: The application displays correctly on screens from 320px to 2560px width without horizontal scrolling
- **SC-010**: Users can complete all core tasks (view, add, edit, delete, toggle complete) on mobile devices with touch targets meeting minimum 44x44px size
- **SC-011**: API errors are handled gracefully with user-friendly messages in 100% of failure scenarios
- **SC-012**: The application bundle size is under 500KB (gzipped) for optimal load times

## Assumptions

- Backend API is already implemented and functional at the endpoints specified
- Backend API returns JSON responses matching the Task entity structure
- Backend API handles CORS appropriately for the frontend origin
- Backend API provides appropriate error responses (4xx for client errors, 5xx for server errors)
- No authentication is required for Phase II (authentication is a separate feature)
- Tasks are not shared between users (single-user experience for Phase II)
- No real-time updates needed (no WebSocket or polling for changes from other clients)
- Browser support targets: Last 2 versions of Chrome, Firefox, Safari, Edge
- Users have JavaScript enabled (Next.js requires JavaScript)

## Out of Scope

- User authentication and authorization (separate feature)
- Task sharing or collaboration features
- Task filtering, sorting, or search functionality
- Task due dates or reminders
- Task categories or projects
- Drag-and-drop task reordering
- Bulk operations (select multiple tasks)
- Task history or audit log
- Offline support or PWA features
- Real-time synchronization between multiple clients
- Backend implementation or modifications
- Database schema changes
- API endpoint modifications

## Dependencies

- Backend API must be running and accessible at NEXT_PUBLIC_API_URL
- Backend must implement the following endpoints:
  - GET /tasks - Returns array of all tasks
  - POST /tasks - Creates new task, returns created task with ID
  - PATCH /tasks/{id} - Updates task, returns updated task
  - DELETE /tasks/{id} - Deletes task, returns success confirmation
- Node.js 18+ and npm 9+ for development environment
- Modern browser with ES6+ support for end users
