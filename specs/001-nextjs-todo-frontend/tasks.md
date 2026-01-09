# Tasks: Next.js Todo App Frontend (Phase II)

**Input**: Design documents from `/specs/001-nextjs-todo-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-endpoints.md

**Tests**: This project follows TDD (Test-First Development per Constitution Principle IV). Tests are included and MUST be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to `frontend/` directory:
- `app/` - Next.js App Router pages
- `components/` - React components
- `lib/` - Utilities, hooks, schemas
- `shared/types/` - Shared TypeScript types
- `__tests__/` - Test files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 14 project with TypeScript in frontend/ directory
- [ ] T002 [P] Install core dependencies: react@18, next@14, typescript@5
- [ ] T003 [P] Install styling dependencies: tailwindcss@3, @tailwindcss/forms, clsx, tailwind-merge
- [ ] T004 [P] Install data fetching: @tanstack/react-query@5, zod@3
- [ ] T005 [P] Install UI dependencies: react-hot-toast@2, lucide-react@0.x, next-themes@0.x
- [ ] T006 [P] Install dev dependencies: jest@29, @testing-library/react, @testing-library/jest-dom, jest-axe
- [ ] T007 Configure TypeScript strict mode in frontend/tsconfig.json
- [ ] T008 [P] Configure Tailwind CSS in frontend/tailwind.config.js with design tokens
- [ ] T009 [P] Configure Jest and React Testing Library in frontend/jest.config.js
- [ ] T010 [P] Configure ESLint with Next.js and accessibility rules in frontend/.eslintrc.json
- [ ] T011 [P] Configure Prettier in frontend/.prettierrc
- [ ] T012 [P] Create environment variables template in frontend/.env.local.example
- [ ] T013 Create global styles with Tailwind directives in frontend/app/globals.css

**Checkpoint**: Project structure ready, all dependencies installed, configuration complete

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T014 [P] Create Task TypeScript interface in frontend/shared/types/task.ts
- [ ] T015 [P] Create Task Zod schema in frontend/lib/schemas/task.ts
- [ ] T016 [P] Create CreateTaskInput and UpdateTaskInput schemas in frontend/lib/schemas/task-input.ts
- [ ] T017 [P] Create priority constants in frontend/lib/constants/priorities.ts
- [ ] T018 [P] Create color mappings in frontend/lib/constants/colors.ts
- [ ] T019 [P] Create API client configuration in frontend/lib/utils/api.ts
- [ ] T020 [P] Create API error parser in frontend/lib/utils/api-error.ts
- [ ] T021 [P] Create Tailwind class merger utility (cn) in frontend/lib/utils/cn.ts
- [ ] T022 [P] Create date formatting utility in frontend/lib/utils/format-date.ts
- [ ] T023 Create React Query client configuration in frontend/lib/react-query/config.ts
- [ ] T024 Create QueryClientProvider wrapper in frontend/lib/react-query/provider.tsx
- [ ] T025 [P] Create Button UI primitive in frontend/components/ui/Button.tsx
- [ ] T026 [P] Create Input UI primitive in frontend/components/ui/Input.tsx
- [ ] T027 [P] Create Textarea UI primitive in frontend/components/ui/Textarea.tsx
- [ ] T028 [P] Create Modal UI primitive in frontend/components/ui/Modal.tsx
- [ ] T029 [P] Create Skeleton UI primitive in frontend/components/ui/Skeleton.tsx
- [ ] T030 Create root layout with ThemeProvider and QueryProvider in frontend/app/layout.tsx
- [ ] T031 [P] Create Header component in frontend/components/Header/Header.tsx
- [ ] T032 [P] Create test setup and MSW handlers in frontend/__tests__/setup.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Manage Task List (Priority: P1) 🎯 MVP

**Goal**: Users can view their tasks in a clean list, see priorities/tags, and mark tasks complete with optimistic updates

**Independent Test**: Load app, view tasks with different states, toggle completion. Verify empty state when no tasks exist.

### Tests for User Story 1 (TDD - Write First, Ensure FAIL)

- [ ] T033 [P] [US1] Write test for TaskList component fetching and displaying tasks in frontend/components/TaskList/TaskList.test.tsx
- [ ] T034 [P] [US1] Write test for TaskCard component rendering task details in frontend/components/TaskCard/TaskCard.test.tsx
- [ ] T035 [P] [US1] Write test for TaskCheckbox toggling completion in frontend/components/TaskCard/TaskCheckbox.test.tsx
- [ ] T036 [P] [US1] Write test for EmptyState component in frontend/components/TaskList/EmptyState.test.tsx
- [ ] T037 [P] [US1] Write test for useTasks hook in frontend/lib/hooks/useTasks.test.ts
- [ ] T038 [P] [US1] Write test for useUpdateTask hook in frontend/lib/hooks/useUpdateTask.test.ts

### Implementation for User Story 1

- [ ] T039 [P] [US1] Create useTasks hook with React Query in frontend/lib/hooks/useTasks.ts
- [ ] T040 [P] [US1] Create useUpdateTask hook with optimistic updates in frontend/lib/hooks/useUpdateTask.ts
- [ ] T041 [P] [US1] Create PriorityBadge component in frontend/components/TaskCard/PriorityBadge.tsx
- [ ] T042 [P] [US1] Create TagChip component in frontend/components/TaskCard/TagChip.tsx
- [ ] T043 [P] [US1] Create TaskListSkeleton component in frontend/components/TaskList/TaskListSkeleton.tsx
- [ ] T044 [P] [US1] Create EmptyState component in frontend/components/TaskList/EmptyState.tsx
- [ ] T045 [US1] Create TaskCheckbox component with completion toggle in frontend/components/TaskCard/TaskCheckbox.tsx
- [ ] T046 [US1] Create TaskCard component with all task details in frontend/components/TaskCard/TaskCard.tsx
- [ ] T047 [US1] Create TaskList component with data fetching in frontend/components/TaskList/TaskList.tsx
- [ ] T048 [US1] Create home page with TaskList in frontend/app/page.tsx
- [ ] T049 [US1] Create loading UI with skeletons in frontend/app/loading.tsx
- [ ] T050 [US1] Create error boundary in frontend/app/error.tsx
- [ ] T051 [US1] Add responsive grid layout (1/2/3 columns) to TaskList component
- [ ] T052 [US1] Add hover effects for edit/delete icons in TaskCard component
- [ ] T053 [US1] Verify all US1 tests pass and acceptance scenarios work

**Checkpoint**: User Story 1 complete - users can view and manage tasks independently

---

## Phase 4: User Story 2 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can create new tasks via a modal form with validation and optimistic updates

**Independent Test**: Click add button, fill form with various field combinations, submit, verify task appears and persists

### Tests for User Story 2 (TDD - Write First, Ensure FAIL)

- [ ] T054 [P] [US2] Write test for AddTaskButton component in frontend/components/AddTaskButton/AddTaskButton.test.tsx
- [ ] T055 [P] [US2] Write test for TaskModal component in frontend/components/TaskModal/TaskModal.test.tsx
- [ ] T056 [P] [US2] Write test for TaskForm validation in frontend/components/TaskModal/TaskForm.test.tsx
- [ ] T057 [P] [US2] Write test for useCreateTask hook in frontend/lib/hooks/useCreateTask.test.ts
- [ ] T058 [P] [US2] Write integration test for create task flow in frontend/__tests__/integration/create-task.test.tsx

### Implementation for User Story 2

- [ ] T059 [P] [US2] Create useCreateTask hook with optimistic updates in frontend/lib/hooks/useCreateTask.ts
- [ ] T060 [P] [US2] Create useTaskForm hook for form state in frontend/lib/hooks/useTaskForm.ts
- [ ] T061 [P] [US2] Create PrioritySelector component in frontend/components/TaskModal/PrioritySelector.tsx
- [ ] T062 [P] [US2] Create TagInput component in frontend/components/TaskModal/TagInput.tsx
- [ ] T063 [US2] Create TaskForm component with validation in frontend/components/TaskModal/TaskForm.tsx
- [ ] T064 [US2] Create TaskModal component with form in frontend/components/TaskModal/TaskModal.tsx
- [ ] T065 [US2] Create AddTaskButton component in frontend/components/AddTaskButton/AddTaskButton.tsx
- [ ] T066 [US2] Integrate AddTaskButton into home page in frontend/app/page.tsx
- [ ] T067 [US2] Add toast notifications for success/error in TaskModal
- [ ] T068 [US2] Add form validation feedback in TaskForm
- [ ] T069 [US2] Add modal close on Escape key and outside click
- [ ] T070 [US2] Verify all US2 tests pass and acceptance scenarios work

**Checkpoint**: User Stories 1 AND 2 complete - MVP functional (view + create tasks)

---

## Phase 5: User Story 3 - Edit Existing Tasks (Priority: P2)

**Goal**: Users can edit task details via the same modal, pre-filled with current data

**Independent Test**: Click edit icon, modify fields, submit, verify changes appear immediately and persist

### Tests for User Story 3 (TDD - Write First, Ensure FAIL)

- [ ] T071 [P] [US3] Write test for edit button in TaskCard in frontend/components/TaskCard/TaskCard.test.tsx
- [ ] T072 [P] [US3] Write test for TaskModal pre-fill logic in frontend/components/TaskModal/TaskModal.test.tsx
- [ ] T073 [P] [US3] Write integration test for edit task flow in frontend/__tests__/integration/edit-task.test.tsx

### Implementation for User Story 3

- [ ] T074 [US3] Add edit mode to TaskModal component in frontend/components/TaskModal/TaskModal.tsx
- [ ] T075 [US3] Add pre-fill logic to TaskForm in frontend/components/TaskModal/TaskForm.tsx
- [ ] T076 [US3] Add edit button to TaskCard in frontend/components/TaskCard/TaskCard.tsx
- [ ] T077 [US3] Connect edit button to TaskModal with task data
- [ ] T078 [US3] Add optimistic update rollback on error
- [ ] T079 [US3] Verify all US3 tests pass and acceptance scenarios work

**Checkpoint**: User Stories 1, 2, AND 3 complete - full CRUD except delete

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P2)

**Goal**: Users can delete tasks with optimistic updates and error handling

**Independent Test**: Click delete icon, verify task disappears immediately, confirm deletion persists

### Tests for User Story 4 (TDD - Write First, Ensure FAIL)

- [ ] T080 [P] [US4] Write test for delete button in TaskCard in frontend/components/TaskCard/TaskCard.test.tsx
- [ ] T081 [P] [US4] Write test for useDeleteTask hook in frontend/lib/hooks/useDeleteTask.test.ts
- [ ] T082 [P] [US4] Write integration test for delete task flow in frontend/__tests__/integration/delete-task.test.tsx

### Implementation for User Story 4

- [ ] T083 [US4] Create useDeleteTask hook with optimistic updates in frontend/lib/hooks/useDeleteTask.ts
- [ ] T084 [US4] Add delete button to TaskCard in frontend/components/TaskCard/TaskCard.tsx
- [ ] T085 [US4] Connect delete button to useDeleteTask hook
- [ ] T086 [US4] Add toast notification for delete success/error
- [ ] T087 [US4] Add optimistic update rollback on error
- [ ] T088 [US4] Verify all US4 tests pass and acceptance scenarios work

**Checkpoint**: User Stories 1-4 complete - full CRUD functionality working

---

## Phase 7: User Story 5 - Dark Mode Toggle (Priority: P3)

**Goal**: Users can toggle between light and dark modes with persistence

**Independent Test**: Click dark mode toggle, verify all UI elements adapt, reload page, verify preference persists

### Tests for User Story 5 (TDD - Write First, Ensure FAIL)

- [ ] T089 [P] [US5] Write test for DarkModeToggle component in frontend/components/Header/DarkModeToggle.test.tsx
- [ ] T090 [P] [US5] Write test for theme persistence in frontend/__tests__/integration/dark-mode.test.tsx
- [ ] T091 [P] [US5] Write test for contrast ratios in dark mode in frontend/__tests__/a11y/dark-mode-contrast.test.tsx

### Implementation for User Story 5

- [ ] T092 [US5] Create DarkModeToggle component in frontend/components/Header/DarkModeToggle.tsx
- [ ] T093 [US5] Add ThemeProvider configuration in frontend/app/layout.tsx
- [ ] T094 [US5] Add dark mode variants to all components using Tailwind dark: prefix
- [ ] T095 [US5] Add dark mode color tokens to frontend/tailwind.config.js
- [ ] T096 [US5] Integrate DarkModeToggle into Header component
- [ ] T097 [US5] Add theme persistence in localStorage
- [ ] T098 [US5] Prevent flash of unstyled content (FOUC) on page load
- [ ] T099 [US5] Verify all US5 tests pass and acceptance scenarios work
- [ ] T100 [US5] Verify WCAG AA contrast ratios in both modes

**Checkpoint**: User Stories 1-5 complete - dark mode functional

---

## Phase 8: User Story 6 - Responsive Mobile Experience (Priority: P2)

**Goal**: App adapts beautifully to mobile, tablet, and desktop with appropriate layouts

**Independent Test**: Access app on various screen sizes, verify layouts adapt, no horizontal scrolling, touch targets ≥ 44px

### Tests for User Story 6 (TDD - Write First, Ensure FAIL)

- [ ] T101 [P] [US6] Write test for mobile layout (< 768px) in frontend/__tests__/integration/responsive-mobile.test.tsx
- [ ] T102 [P] [US6] Write test for tablet layout (768-1024px) in frontend/__tests__/integration/responsive-tablet.test.tsx
- [ ] T103 [P] [US6] Write test for desktop layout (> 1024px) in frontend/__tests__/integration/responsive-desktop.test.tsx
- [ ] T104 [P] [US6] Write test for touch target sizes in frontend/__tests__/a11y/touch-targets.test.tsx

### Implementation for User Story 6

- [ ] T105 [US6] Add mobile breakpoint styles (< 768px) to TaskList component
- [ ] T106 [US6] Add tablet breakpoint styles (768-1024px) to TaskList component
- [ ] T107 [US6] Add desktop breakpoint styles (> 1024px) to TaskList component
- [ ] T108 [US6] Make TaskModal full-screen on mobile in frontend/components/TaskModal/TaskModal.tsx
- [ ] T109 [US6] Ensure all touch targets are ≥ 44x44px on mobile
- [ ] T110 [US6] Make edit/delete icons always visible on mobile (not hover-only)
- [ ] T111 [US6] Add mobile-optimized spacing and typography
- [ ] T112 [US6] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] T113 [US6] Verify all US6 tests pass and acceptance scenarios work

**Checkpoint**: All user stories complete - app fully responsive

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T114 [P] Write keyboard navigation test in frontend/__tests__/a11y/keyboard-nav.test.tsx
- [ ] T115 [P] Write screen reader test in frontend/__tests__/a11y/screen-reader.test.tsx
- [ ] T116 [P] Add ARIA labels to all icon buttons across components
- [ ] T117 [P] Add focus management to TaskModal (trap focus, restore on close)
- [ ] T118 [P] Add skip links for keyboard users in frontend/app/layout.tsx
- [ ] T119 [P] Run Lighthouse accessibility audit and fix violations (target: ≥ 90)
- [ ] T120 [P] Run Lighthouse performance audit and optimize (target: ≥ 90)
- [ ] T121 [P] Verify bundle size < 500KB gzipped
- [ ] T122 [P] Add error messages associated with form fields for screen readers
- [ ] T123 [P] Verify all interactive elements have visible focus indicators
- [ ] T124 [P] Test with NVDA/VoiceOver screen readers
- [ ] T125 [P] Write end-to-end integration test for complete CRUD flow in frontend/__tests__/integration/full-crud.test.tsx
- [ ] T126 [P] Add loading states for all async operations
- [ ] T127 [P] Add request timeout handling (10 seconds)
- [ ] T128 [P] Verify error handling for all API failure scenarios
- [ ] T129 [P] Run all quickstart.md test scenarios and verify pass
- [ ] T130 [P] Update README.md with setup and development instructions
- [ ] T131 Run full test suite and verify ≥ 80% coverage
- [ ] T132 Run ESLint and fix all warnings
- [ ] T133 Run Prettier and format all code
- [ ] T134 Run TypeScript compiler and fix all errors
- [ ] T135 Final manual QA of all user stories

**Checkpoint**: All quality gates passed - ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P2 → P3 → P2)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories ✅ MVP
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories ✅ MVP
- **User Story 3 (P2)**: Can start after Foundational - Reuses TaskModal from US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational - No dependencies on other stories
- **User Story 5 (P3)**: Can start after Foundational - No dependencies on other stories
- **User Story 6 (P2)**: Can start after Foundational - Affects all components but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Hooks before components that use them
- UI primitives before complex components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: Tasks T002-T006, T008-T012 can run in parallel
- **Phase 2 (Foundational)**: Tasks T014-T032 can run in parallel (except T030 depends on T024)
- **Once Foundational completes**: All user stories can start in parallel (if team capacity allows)
- **Within each user story**: All test tasks marked [P] can run in parallel
- **Within each user story**: All component tasks marked [P] can run in parallel
- **Phase 9 (Polish)**: Tasks T114-T130 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write first):
Task T033: "Write test for TaskList component in TaskList.test.tsx"
Task T034: "Write test for TaskCard component in TaskCard.test.tsx"
Task T035: "Write test for TaskCheckbox in TaskCheckbox.test.tsx"
Task T036: "Write test for EmptyState in EmptyState.test.tsx"
Task T037: "Write test for useTasks hook in useTasks.test.ts"
Task T038: "Write test for useUpdateTask hook in useUpdateTask.test.ts"

# After tests fail, launch all hooks together:
Task T039: "Create useTasks hook in useTasks.ts"
Task T040: "Create useUpdateTask hook in useUpdateTask.ts"

# Launch all presentational components together:
Task T041: "Create PriorityBadge in PriorityBadge.tsx"
Task T042: "Create TagChip in TagChip.tsx"
Task T043: "Create TaskListSkeleton in TaskListSkeleton.tsx"
Task T044: "Create EmptyState in EmptyState.tsx"
```

---

## Parallel Example: Multiple User Stories

```bash
# After Foundational phase completes, with 3 developers:

Developer A (MVP Priority):
- Phase 3: User Story 1 (View and Manage Tasks)
- Phase 4: User Story 2 (Add New Tasks)

Developer B (Secondary Features):
- Phase 5: User Story 3 (Edit Tasks)
- Phase 6: User Story 4 (Delete Tasks)

Developer C (Enhancements):
- Phase 7: User Story 5 (Dark Mode)
- Phase 8: User Story 6 (Responsive Design)

# All stories integrate independently without conflicts
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T013)
2. Complete Phase 2: Foundational (T014-T032) - CRITICAL
3. Complete Phase 3: User Story 1 (T033-T053)
4. Complete Phase 4: User Story 2 (T054-T070)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo MVP (view + create tasks)

**MVP Scope**: 70 tasks (T001-T070)
**MVP Value**: Users can view existing tasks and create new tasks - core todo app functionality

### Incremental Delivery

1. **Foundation** (T001-T032) → Infrastructure ready
2. **MVP** (T033-T070) → View + Create tasks → Deploy/Demo ✅
3. **Edit** (T071-T079) → Add edit capability → Deploy/Demo
4. **Delete** (T080-T088) → Full CRUD → Deploy/Demo
5. **Dark Mode** (T089-T100) → Theme support → Deploy/Demo
6. **Responsive** (T101-T113) → Mobile optimization → Deploy/Demo
7. **Polish** (T114-T135) → Production ready → Deploy

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational phase:

1. **Week 1**: All complete Setup + Foundational together (T001-T032)
2. **Week 2**:
   - Dev A: User Story 1 (T033-T053)
   - Dev B: User Story 2 (T054-T070)
   - Dev C: User Story 5 (T089-T100)
3. **Week 3**:
   - Dev A: User Story 3 (T071-T079)
   - Dev B: User Story 4 (T080-T088)
   - Dev C: User Story 6 (T101-T113)
4. **Week 4**: All work on Polish together (T114-T135)

---

## Task Summary

**Total Tasks**: 135
**Setup**: 13 tasks (T001-T013)
**Foundational**: 19 tasks (T014-T032)
**User Story 1 (P1)**: 21 tasks (T033-T053) - MVP
**User Story 2 (P1)**: 17 tasks (T054-T070) - MVP
**User Story 3 (P2)**: 9 tasks (T071-T079)
**User Story 4 (P2)**: 9 tasks (T080-T088)
**User Story 5 (P3)**: 12 tasks (T089-T100)
**User Story 6 (P2)**: 13 tasks (T101-T113)
**Polish**: 22 tasks (T114-T135)

**MVP Scope**: 70 tasks (Setup + Foundational + US1 + US2)
**Full Feature**: 135 tasks (all user stories + polish)

**Parallel Opportunities**: 45+ tasks can run in parallel within their phases
**Independent Stories**: All 6 user stories can be developed and tested independently

---

## Notes

- **[P]** tasks = different files, no dependencies, can run in parallel
- **[Story]** label maps task to specific user story for traceability
- Each user story is independently completable and testable
- **TDD Required**: Write tests first, ensure they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks follow strict format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- File paths are exact and implementation-ready
- Constitution compliance verified at each phase
