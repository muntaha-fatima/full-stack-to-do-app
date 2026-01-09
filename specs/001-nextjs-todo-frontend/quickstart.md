# Quick Start Guide

**Feature**: Next.js Todo App Frontend (Phase II)
**Date**: 2026-01-08
**Purpose**: Quick setup and testing guide for developers

## Prerequisites

- Node.js 18.x or 20.x LTS
- npm 9+ (or pnpm 8+)
- Backend API running at `NEXT_PUBLIC_API_URL`
- Git (for version control)

## Initial Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Key Dependencies Installed**:
- next@14.x - React framework
- react@18.x - UI library
- typescript@5.x - Type safety
- tailwindcss@3.x - Styling
- @tanstack/react-query@5.x - Data fetching
- react-hot-toast@2.x - Notifications
- zod@3.x - Schema validation
- lucide-react@0.x - Icons
- next-themes@0.x - Dark mode

### 2. Configure Environment

Create `.env.local` in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

**Important**: The backend API must be running and accessible at this URL.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Test Scenarios

### Scenario 1: View Empty State (First Time User)

**Goal**: Verify empty state displays correctly when no tasks exist

**Steps**:
1. Ensure backend has no tasks (fresh database or delete all tasks)
2. Open `http://localhost:3000`
3. Observe the empty state

**Expected Results**:
- ✅ Friendly empty state message displays
- ✅ Visual indicator (icon or illustration) present
- ✅ "Add Task" button is visible and prominent
- ✅ No loading skeletons after initial load
- ✅ No error messages

**Acceptance Criteria**: User Story 1, Scenario 1

---

### Scenario 2: View Task List with Existing Tasks

**Goal**: Verify tasks display correctly with all visual elements

**Prerequisites**: Backend has at least 3 tasks with different priorities and tags

**Steps**:
1. Open `http://localhost:3000`
2. Wait for tasks to load
3. Observe task display

**Expected Results**:
- ✅ All tasks from backend are displayed
- ✅ Each task shows: checkbox, title, description (if present), priority badge, tags
- ✅ Priority badges color-coded: High=red, Medium=orange, Low=green
- ✅ Tags appear as colored chips
- ✅ Completed tasks show strikethrough and reduced opacity
- ✅ Loading skeletons appear briefly during fetch
- ✅ Responsive layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

**Acceptance Criteria**: User Story 1, Scenarios 2, 5, 6

---

### Scenario 3: Toggle Task Completion

**Goal**: Verify optimistic updates work for task completion

**Prerequisites**: At least one incomplete task exists

**Steps**:
1. Open `http://localhost:3000`
2. Click checkbox on an incomplete task
3. Observe immediate visual feedback
4. Wait for API response
5. Click checkbox again to unmark

**Expected Results**:
- ✅ Task immediately shows as complete (strikethrough, opacity change)
- ✅ No loading spinner on checkbox
- ✅ Success toast appears after API confirms
- ✅ Task remains complete after page refresh
- ✅ Unchecking works the same way
- ✅ If API fails, task reverts to previous state with error toast

**Acceptance Criteria**: User Story 1, Scenarios 3, 4

**Performance**: Visual feedback within 50ms (SC-003)

---

### Scenario 4: Create New Task (Minimal Data)

**Goal**: Verify task creation with only required fields

**Steps**:
1. Open `http://localhost:3000`
2. Click "Add Task" button
3. Enter title: "Buy groceries"
4. Click "Save" (leave other fields empty)
5. Observe task appears in list

**Expected Results**:
- ✅ Modal opens centered on screen
- ✅ Form has title field (required), description, priority selector, tags input
- ✅ Save button disabled until title entered
- ✅ Task appears immediately in list (optimistic update)
- ✅ Success toast appears
- ✅ Modal closes automatically
- ✅ Task has default priority "Low" and no tags
- ✅ Task persists after page refresh

**Acceptance Criteria**: User Story 2, Scenarios 1, 2, 3, 4

**Performance**: Task appears within 100ms (SC-002)

---

### Scenario 5: Create New Task (Full Data)

**Goal**: Verify task creation with all fields populated

**Steps**:
1. Click "Add Task" button
2. Enter title: "Complete project documentation"
3. Enter description: "Write comprehensive docs for the new feature"
4. Select priority: "High"
5. Add tags: "documentation", "urgent"
6. Click "Save"

**Expected Results**:
- ✅ All fields accept input correctly
- ✅ Priority selector shows visual states for each option
- ✅ Tags can be added (comma-separated or individual)
- ✅ Task appears with all data correctly displayed
- ✅ High priority shows red badge
- ✅ Tags appear as colored chips

**Acceptance Criteria**: User Story 2, Scenario 8

---

### Scenario 6: Create Task - Validation Error

**Goal**: Verify form validation prevents invalid submissions

**Steps**:
1. Click "Add Task" button
2. Leave title empty
3. Try to click "Save"
4. Enter only whitespace in title
5. Try to click "Save"

**Expected Results**:
- ✅ Save button remains disabled when title empty
- ✅ Validation message appears: "Title is required"
- ✅ Whitespace-only title shows validation error
- ✅ Modal remains open
- ✅ No API request made

**Acceptance Criteria**: User Story 2, Scenario 7

---

### Scenario 7: Create Task - API Failure

**Goal**: Verify error handling when API fails

**Prerequisites**: Stop backend API or simulate 500 error

**Steps**:
1. Click "Add Task" button
2. Enter title: "Test task"
3. Click "Save"
4. Observe optimistic update
5. Wait for API error

**Expected Results**:
- ✅ Task appears immediately (optimistic)
- ✅ After API fails, task is removed from list
- ✅ Error toast appears with user-friendly message
- ✅ Modal reopens with entered data preserved
- ✅ User can retry or cancel

**Acceptance Criteria**: User Story 2, Scenario 5

---

### Scenario 8: Edit Existing Task

**Goal**: Verify task editing with optimistic updates

**Prerequisites**: At least one task exists

**Steps**:
1. Hover over a task
2. Click edit icon (should fade in on hover)
3. Modify title, description, priority, or tags
4. Click "Save"
5. Observe immediate update

**Expected Results**:
- ✅ Edit icon appears on hover (desktop) or always visible (mobile)
- ✅ Modal opens pre-filled with current task data
- ✅ All fields are editable
- ✅ Changes appear immediately in list (optimistic)
- ✅ Success toast appears
- ✅ Modal closes automatically
- ✅ Changes persist after page refresh

**Acceptance Criteria**: User Story 3, Scenarios 1, 2

---

### Scenario 9: Edit Task - API Failure

**Goal**: Verify rollback on edit failure

**Prerequisites**: Stop backend API or simulate error

**Steps**:
1. Click edit on a task
2. Change title to "Updated title"
3. Click "Save"
4. Wait for API error

**Expected Results**:
- ✅ Task shows updated title immediately (optimistic)
- ✅ After API fails, task reverts to original title
- ✅ Error toast appears
- ✅ Modal reopens with attempted changes
- ✅ User can retry or cancel

**Acceptance Criteria**: User Story 3, Scenario 3

---

### Scenario 10: Delete Task

**Goal**: Verify task deletion with optimistic updates

**Prerequisites**: At least one task exists

**Steps**:
1. Hover over a task
2. Click delete icon
3. Observe immediate removal

**Expected Results**:
- ✅ Delete icon appears on hover (desktop) or always visible (mobile)
- ✅ Task immediately disappears from list (optimistic)
- ✅ Success toast appears
- ✅ Task does not reappear after page refresh
- ✅ If API fails, task reappears with error toast

**Acceptance Criteria**: User Story 4, Scenarios 1, 2, 3

---

### Scenario 11: Dark Mode Toggle

**Goal**: Verify dark mode works correctly

**Steps**:
1. Open app in light mode
2. Click dark mode toggle in header
3. Observe color transition
4. Refresh page
5. Verify dark mode persists

**Expected Results**:
- ✅ Toggle button visible in header
- ✅ Smooth color transition (not instant flash)
- ✅ All UI elements adapt to dark theme
- ✅ Text contrast meets WCAG AA (4.5:1 minimum)
- ✅ Preference persists in localStorage
- ✅ No flash of light mode on page load
- ✅ Toggle works in both directions

**Acceptance Criteria**: User Story 5, All scenarios

---

### Scenario 12: Responsive Mobile Layout

**Goal**: Verify mobile responsiveness

**Steps**:
1. Open app on mobile device or resize browser to < 768px
2. Observe layout adaptation
3. Test all interactions (add, edit, delete, toggle)

**Expected Results**:
- ✅ Tasks display in single column
- ✅ Touch targets ≥ 44x44px
- ✅ Modal takes full screen or slides from bottom
- ✅ Edit/delete icons always visible (not on hover)
- ✅ No horizontal scrolling
- ✅ All features work with touch
- ✅ Text remains readable

**Acceptance Criteria**: User Story 6, Scenario 1

---

### Scenario 13: Responsive Tablet Layout

**Goal**: Verify tablet responsiveness

**Steps**:
1. Resize browser to 768-1024px
2. Observe layout

**Expected Results**:
- ✅ Tasks display in 2-column grid
- ✅ Appropriate spacing between columns
- ✅ All interactions work

**Acceptance Criteria**: User Story 6, Scenario 3

---

### Scenario 14: Responsive Desktop Layout

**Goal**: Verify desktop responsiveness

**Steps**:
1. View app on desktop (> 1024px)
2. Observe layout

**Expected Results**:
- ✅ Tasks display in 3-column grid
- ✅ Hover states work on all interactive elements
- ✅ Edit/delete icons fade in on hover
- ✅ Optimal use of screen space

**Acceptance Criteria**: User Story 6, Scenario 4

---

### Scenario 15: Keyboard Navigation

**Goal**: Verify full keyboard accessibility

**Steps**:
1. Open app
2. Use Tab key to navigate through all interactive elements
3. Use Enter/Space to activate buttons
4. Use Escape to close modal

**Expected Results**:
- ✅ All interactive elements reachable via Tab
- ✅ Focus indicators visible and clear
- ✅ Logical tab order (top to bottom, left to right)
- ✅ Modal can be closed with Escape
- ✅ Form can be submitted with Enter
- ✅ No keyboard traps

**Acceptance Criteria**: FR-018, SC-007

---

## Performance Testing

### Lighthouse Audit

Run Lighthouse audit in Chrome DevTools:

```bash
# Or use Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

**Expected Scores**:
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**Key Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

---

## Accessibility Testing

### Automated Testing

```bash
# Run jest-axe tests
npm test -- --testPathPattern=a11y
```

### Manual Testing

1. **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
2. **Keyboard Only**: Navigate entire app without mouse
3. **Color Contrast**: Use browser DevTools to check contrast ratios
4. **Zoom**: Test at 200% zoom level

---

## Common Issues & Solutions

### Issue 1: API Connection Failed

**Symptom**: Error toast "Unable to connect"

**Solution**:
1. Verify backend is running: `curl http://localhost:8000/tasks`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS is configured on backend

### Issue 2: Dark Mode Flash

**Symptom**: Light mode flashes before dark mode loads

**Solution**:
1. Ensure `next-themes` script is in root layout
2. Check `suppressHydrationWarning` on `<html>` tag
3. Verify `ThemeProvider` wraps entire app

### Issue 3: Optimistic Updates Not Working

**Symptom**: UI doesn't update immediately

**Solution**:
1. Check React Query DevTools for mutation status
2. Verify `onMutate` callback is implemented
3. Check browser console for errors

### Issue 4: TypeScript Errors

**Symptom**: Type errors in IDE or build

**Solution**:
1. Run `npm run type-check`
2. Ensure `strict: true` in tsconfig.json
3. Check shared types are imported correctly

---

## Development Workflow

### 1. Start Backend API

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

### 3. Run Tests (TDD Workflow)

```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- TaskList.test.tsx

# Run with coverage
npm test -- --coverage
```

### 4. Check Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
```

---

## Next Steps After Setup

1. ✅ Verify all test scenarios pass
2. ✅ Run Lighthouse audit and meet performance targets
3. ✅ Run accessibility tests and fix any violations
4. ✅ Test on real mobile devices
5. ✅ Review code with team
6. ✅ Deploy to staging environment

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage
npm run test:e2e         # End-to-end tests (if configured)

# Analysis
npm run analyze          # Bundle size analysis
npm run lighthouse       # Lighthouse audit
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Project Constitution](.specify/memory/constitution.md)
- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
