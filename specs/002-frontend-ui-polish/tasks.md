---
description: "Task list for Frontend UI/UX Polish implementation"
---

# Tasks: Frontend UI/UX Polish

**Input**: Design documents from `/specs/002-frontend-ui-polish/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are included per constitution requirement (Test-First Development). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory at repository root
- All paths relative to repository root
- Components: `frontend/components/`
- Styles: `frontend/app/globals.css`, `frontend/styles/`
- Utilities: `frontend/lib/`
- Tests: `frontend/__tests__/`

---

## Phase 1: Setup (Design Token Foundation)

**Purpose**: Establish design token system and base configuration

- [x] T001 Create design token type definitions in frontend/lib/design-tokens.ts
- [x] T002 Create animation preset type definitions in frontend/lib/animations.ts
- [x] T003 [P] Extend globals.css with spacing scale CSS variables (4px base unit)
- [x] T004 [P] Extend globals.css with color palette CSS variables (priority, status colors)
- [x] T005 [P] Extend globals.css with typography CSS variables (line heights)
- [x] T006 [P] Extend globals.css with shadow scale CSS variables (elevation)
- [x] T007 [P] Extend globals.css with animation duration CSS variables (fast, normal, slow)
- [x] T008 Update tailwind.config.ts to reference new CSS variables for spacing
- [x] T009 Update tailwind.config.ts to reference new CSS variables for colors
- [x] T010 Update tailwind.config.ts to reference new CSS variables for shadows

---

## Phase 2: Foundational (Base Styles & Utilities)

**Purpose**: Core styling infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create animation utility functions in frontend/lib/animations.ts (getAnimationClasses, getDurationClass, etc.)
- [x] T012 Create design token utility functions in frontend/lib/design-tokens.ts (getColorVariable, getTypographyClasses, etc.)
- [x] T013 [P] Add prefers-reduced-motion support to globals.css
- [x] T014 [P] Create base transition classes in globals.css (for smooth state changes)
- [x] T015 [P] Add dark mode color adjustments to globals.css (priority colors, status colors)
- [x] T016 Verify all color contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI) using DevTools
- [x] T017 Create accessibility test utilities in frontend/__tests__/utils/accessibility.ts (contrast checking, reduced motion)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Hierarchy & Spacing (Priority: P1) 🎯 MVP

**Goal**: Implement consistent spacing scale and clear visual hierarchy across all components

**Independent Test**: View task list and verify clear distinction between titles, descriptions, and metadata with consistent spacing (4px, 8px, 16px, 24px)

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T018 [P] [US1] Create spacing scale test in frontend/__tests__/design-tokens/spacing.test.ts
- [x] T019 [P] [US1] Create visual hierarchy test for TaskCard in frontend/__tests__/components/task-card.test.tsx
- [x] T020 [P] [US1] Create touch target size test (44x44px minimum) in frontend/__tests__/accessibility/touch-targets.test.tsx

### Implementation for User Story 1

- [x] T021 [P] [US1] Update TaskCard component with spacing scale utilities in frontend/components/task-card.tsx
- [x] T022 [P] [US1] Update TaskForm component with spacing scale utilities in frontend/components/task-form.tsx
- [x] T023 [P] [US1] Update Modal component with spacing scale utilities in frontend/components/modal.tsx
- [x] T024 [P] [US1] Update Button component with spacing scale utilities in frontend/components/ui/button.tsx
- [x] T025 [P] [US1] Update page layout with spacing scale utilities in frontend/app/page.tsx
- [x] T026 [US1] Apply typography hierarchy to task titles (text-lg font-semibold leading-tight)
- [x] T027 [US1] Apply typography hierarchy to task descriptions (text-base font-normal leading-normal)
- [x] T028 [US1] Apply typography hierarchy to metadata (text-sm text-muted-foreground)
- [ ] T029 [US1] Verify mobile touch targets are 44x44px minimum using DevTools
- [ ] T030 [US1] Run visual hierarchy tests and verify all pass

**Checkpoint**: At this point, spacing and visual hierarchy should be consistent across all components

---

## Phase 4: User Story 2 - Smooth Animations & Transitions (Priority: P1)

**Goal**: Implement smooth, purposeful animations for all state changes with appropriate timing (150-300ms)

**Independent Test**: Create, complete, and delete tasks - verify smooth fade/slide animations with no jank (60fps)

### Tests for User Story 2

- [x] T031 [P] [US2] Create animation performance test (60fps validation) in frontend/__tests__/performance/animations.test.ts
- [x] T032 [P] [US2] Create task creation animation test in frontend/__tests__/components/task-card-animations.test.tsx
- [x] T033 [P] [US2] Create modal animation test in frontend/__tests__/components/modal-animations.test.tsx
- [x] T034 [P] [US2] Create reduced motion test in frontend/__tests__/accessibility/reduced-motion.test.tsx

### Implementation for User Story 2

- [x] T035 [P] [US2] Add task creation animation (fade-in + slide-in-from-bottom) to page.tsx
- [x] T036 [P] [US2] Add task completion animation (strikethrough + opacity) to TaskCard component
- [x] T037 [P] [US2] Add task deletion animation (fade-out + slide-out-to-right) to page.tsx
- [x] T038 [US2] Add modal open animation (fade-in + zoom-in-95 + slide-in-from-bottom) to Modal component
- [x] T039 [US2] Add modal close animation (fade-out + zoom-out-95) to Modal component
- [x] T040 [US2] Add hover state transitions to all interactive elements (duration-normal)
- [x] T041 [US2] Add dark mode toggle animation (icon rotation) to DarkModeToggle component
- [x] T042 [US2] Implement prefers-reduced-motion support (disable animations when enabled)
- [ ] T043 [US2] Test animations with Chrome DevTools Performance tab (verify 60fps)
- [ ] T044 [US2] Run animation tests and verify all pass

**Checkpoint**: All state changes should have smooth animations maintaining 60fps

---

## Phase 5: User Story 3 - Professional Color Palette & Typography (Priority: P1)

**Goal**: Implement cohesive color scheme and typography system with WCAG AA compliance

**Independent Test**: View interface in light and dark modes - verify harmonious colors and clear typography hierarchy

### Tests for User Story 3

- [x] T045 [P] [US3] Create color contrast test (WCAG AA) in frontend/__tests__/accessibility/contrast.test.tsx
- [x] T046 [P] [US3] Create typography hierarchy test in frontend/__tests__/design-tokens/typography.test.ts
- [x] T047 [P] [US3] Create priority badge color test in frontend/__tests__/components/task-card.test.tsx

### Implementation for User Story 3

- [x] T048 [P] [US3] Implement priority badge colors in TaskCard component (high=red, medium=amber, low=green)
- [x] T049 [P] [US3] Apply semantic colors to status indicators in TaskCard component
- [x] T050 [P] [US3] Update button colors to use semantic color tokens in Button component
- [x] T051 [P] [US3] Update form validation colors to use status tokens in TaskForm component
- [x] T052 [US3] Verify all text meets 4.5:1 contrast ratio in light mode using DevTools
- [x] T053 [US3] Verify all text meets 4.5:1 contrast ratio in dark mode using DevTools
- [x] T054 [US3] Verify all UI components meet 3:1 contrast ratio in both modes
- [x] T055 [US3] Apply typography presets consistently across all components
- [x] T056 [US3] Run color contrast tests and verify all pass

**Checkpoint**: Color palette should be harmonious and accessible in both light and dark modes

---

## Phase 6: User Story 4 - Micro-interactions & Feedback (Priority: P2)

**Goal**: Implement immediate, delightful feedback for all interactions through subtle animations

**Independent Test**: Interact with all UI elements - verify immediate visual feedback (button press, card hover, focus states)

### Tests for User Story 4

- [x] T057 [P] [US4] Create button press animation test in frontend/__tests__/components/ui/button.test.tsx
- [x] T058 [P] [US4] Create card hover animation test in frontend/__tests__/components/task-card.test.tsx
- [x] T059 [P] [US4] Create focus state test in frontend/__tests__/components/task-form.test.tsx
- [x] T060 [P] [US4] Create tag animation test in frontend/__tests__/components/tag-chip.test.tsx

### Implementation for User Story 4

- [x] T061 [P] [US4] Add button press animation (scale-95) to Button component
- [x] T062 [P] [US4] Add card hover elevation (shadow-lg) to TaskCard component
- [x] T063 [P] [US4] Add card hover icon fade-in (edit/delete icons) to TaskCard component
- [x] T064 [P] [US4] Add focus states to all form fields (border-primary + ring-2) in TaskForm component
- [x] T065 [P] [US4] Add tag add animation (fade-in + zoom-in-95) to TagInput component
- [x] T066 [P] [US4] Add tag remove animation (fade-out + zoom-out-95) to TagChip component
- [x] T067 [US4] Add dark mode toggle icon animation (rotation) to DarkModeToggle component
- [x] T068 [US4] Add toast notification animations (slide-in-from-right) to Toaster configuration
- [x] T069 [US4] Verify all micro-interactions feel immediate (150ms duration)
- [x] T070 [US4] Run micro-interaction tests and verify all pass

**Checkpoint**: All interactive elements should provide immediate, satisfying feedback

---

## Phase 7: User Story 5 - Enhanced Empty States & Illustrations (Priority: P2)

**Goal**: Implement friendly, helpful empty states with illustrations that guide users

**Independent Test**: Clear all tasks and verify empty state shows friendly illustration with clear call-to-action

### Tests for User Story 5

- [x] T071 [P] [US5] Create empty state rendering test in frontend/__tests__/components/empty-state.test.tsx
- [x] T072 [P] [US5] Create empty state accessibility test (screen reader) in frontend/__tests__/accessibility/empty-state.test.tsx

### Implementation for User Story 5

- [x] T073 [US5] Update EmptyState component with large icon (96px-128px) from lucide-react
- [x] T074 [US5] Update EmptyState component with encouraging copy ("Ready to get organized?")
- [x] T075 [US5] Update EmptyState component with prominent CTA button
- [x] T076 [US5] Add contextual empty state for filtered results in page.tsx
- [x] T077 [US5] Style empty state icon with low opacity (30-40%) and muted color
- [x] T078 [US5] Verify empty state is accessible (keyboard navigation, screen reader)
- [x] T079 [US5] Run empty state tests and verify all pass

**Checkpoint**: Empty states should feel inviting and guide users to their first action

---

## Phase 8: User Story 6 - Polished Form Design (Priority: P2)

**Goal**: Implement modern forms with clear feedback about validation, focus states, and input requirements

**Independent Test**: Open task form and interact with all fields - verify clear focus states, validation feedback, and loading states

### Tests for User Story 6

- [x] T080 [P] [US6] Create form focus state test in frontend/__tests__/components/task-form.test.tsx
- [x] T081 [P] [US6] Create form validation test in frontend/__tests__/components/task-form.test.tsx
- [x] T082 [P] [US6] Create form loading state test in frontend/__tests__/components/task-form.test.tsx

### Implementation for User Story 6

- [x] T083 [P] [US6] Add focus states to all input fields (border-primary + ring-2) in TaskForm component
- [x] T084 [P] [US6] Add validation error states (border-error + ring-error) in TaskForm component
- [x] T085 [P] [US6] Add validation error animations (smooth appearance) in TaskForm component
- [x] T086 [P] [US6] Add required field indicators (asterisk or label) in TaskForm component
- [x] T087 [P] [US6] Add character counter to description field (if limit exists) in TaskForm component
- [x] T088 [US6] Add tag input keyboard shortcuts (Enter, comma, Backspace) in TagInput component
- [x] T089 [US6] Add form submit loading state (spinner + disabled) in TaskForm component
- [x] T090 [US6] Prevent double-submission during form processing in page.tsx
- [x] T091 [US6] Verify all form states are visually distinct and accessible
- [x] T092 [US6] Run form design tests and verify all pass

**Checkpoint**: Forms should feel modern with clear feedback at every step

---

## Phase 9: User Story 7 - Improved Loading States (Priority: P3)

**Goal**: Implement skeleton screens and progressive loading that maintain layout stability

**Independent Test**: Reload page with throttled network - verify skeleton screens appear immediately with shimmer animation

### Tests for User Story 7

- [ ] T093 [P] [US7] Create skeleton screen rendering test in frontend/__tests__/components/loading-skeleton.test.tsx
- [ ] T094 [P] [US7] Create layout shift test (CLS) in frontend/__tests__/performance/layout-shift.test.ts

### Implementation for User Story 7

- [ ] T095 [US7] Add shimmer animation to LoadingSkeleton component (subtle gradient animation)
- [ ] T096 [US7] Verify skeleton cards match final layout (same size, position) in page.tsx
- [ ] T097 [US7] Add content fade-in animation when data loads in page.tsx
- [ ] T098 [US7] Verify no layout shift when content replaces skeletons (CLS < 0.1)
- [ ] T099 [US7] Add optimistic update feedback indicators (subtle loading state) in page.tsx
- [ ] T100 [US7] Verify loading states appear within 100ms of user action
- [ ] T101 [US7] Run loading state tests and verify all pass

**Checkpoint**: Loading states should maintain layout stability and provide clear feedback

---

## Phase 10: User Story 8 - Responsive Design Refinements (Priority: P3)

**Goal**: Implement mobile-optimized layout and interactions specifically for touch and smaller screens

**Independent Test**: View app on mobile device - verify full-width cards, bottom-sheet modals, and thumb-friendly interactions

### Tests for User Story 8

- [ ] T102 [P] [US8] Create mobile layout test in frontend/__tests__/responsive/mobile.test.tsx
- [ ] T103 [P] [US8] Create mobile touch target test in frontend/__tests__/accessibility/mobile-touch.test.tsx
- [ ] T104 [P] [US8] Create mobile modal test in frontend/__tests__/components/modal.test.tsx

### Implementation for User Story 8

- [ ] T105 [P] [US8] Update TaskCard for mobile (full-width, always-visible actions) in task-card.tsx
- [ ] T106 [P] [US8] Update Modal for mobile (slide-up from bottom) in modal.tsx
- [ ] T107 [P] [US8] Update form fields for mobile (keyboard doesn't obscure fields) in TaskForm component
- [ ] T108 [US8] Add swipe actions for mobile (optional - swipe to reveal edit/delete) in TaskCard component
- [ ] T109 [US8] Verify all touch targets are 44x44px minimum on mobile
- [ ] T110 [US8] Test on actual mobile devices (iOS and Android)
- [ ] T111 [US8] Run responsive design tests and verify all pass

**Checkpoint**: Mobile experience should be optimized for touch with thumb-friendly interactions

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] T112 [P] Run full accessibility audit with jest-axe on all components
- [ ] T113 [P] Run Lighthouse audit and verify scores ≥90 (performance, accessibility, best practices)
- [ ] T114 [P] Verify bundle size increase is <500KB using npm run build
- [ ] T115 [P] Test with prefers-reduced-motion enabled (verify animations disabled)
- [ ] T116 [P] Test keyboard navigation through entire app (verify no keyboard traps)
- [ ] T117 [P] Test with screen reader (NVDA/VoiceOver) and verify all content announced
- [ ] T118 Run all manual test scenarios from quickstart.md
- [ ] T119 Fix any issues found during manual testing
- [ ] T120 Create performance baseline documentation (bundle size, Lighthouse scores)
- [ ] T121 Update component documentation with new design token usage
- [ ] T122 Code cleanup and remove any unused CSS or utilities
- [ ] T123 Final code review and ensure constitution compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Independent of US1, US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 8 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Tasks marked [P] can run in parallel (different files)
- Tasks without [P] have dependencies on previous tasks in the same story
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T007, T009)
- All Foundational tasks marked [P] can run in parallel (T013-T015)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Implementation tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create spacing scale test in frontend/__tests__/design-tokens/spacing.test.ts"
Task: "Create visual hierarchy test for TaskCard in frontend/__tests__/components/task-card.test.tsx"
Task: "Create touch target size test in frontend/__tests__/accessibility/touch-targets.test.tsx"

# Launch all component updates for User Story 1 together:
Task: "Update TaskCard component with spacing scale utilities"
Task: "Update TaskForm component with spacing scale utilities"
Task: "Update Modal component with spacing scale utilities"
Task: "Update Button component with spacing scale utilities"
Task: "Update page layout with spacing scale utilities"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Create animation performance test in frontend/__tests__/performance/animations.test.ts"
Task: "Create task creation animation test in frontend/__tests__/components/task-card.test.tsx"
Task: "Create modal animation test in frontend/__tests__/components/modal.test.tsx"
Task: "Create reduced motion test in frontend/__tests__/accessibility/reduced-motion.test.tsx"

# Launch all animation implementations together:
Task: "Add task creation animation to page.tsx"
Task: "Add task completion animation to TaskCard component"
Task: "Add task deletion animation to page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only - All P1)

1. Complete Phase 1: Setup (design tokens)
2. Complete Phase 2: Foundational (base styles, utilities)
3. Complete Phase 3: User Story 1 (visual hierarchy & spacing)
4. Complete Phase 4: User Story 2 (smooth animations)
5. Complete Phase 5: User Story 3 (color palette & typography)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Run Lighthouse audit and verify scores ≥90
8. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo (MVP complete!)
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Add User Story 8 → Test independently → Deploy/Demo
10. Complete Polish phase → Final validation → Production deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Visual Hierarchy)
   - Developer B: User Story 2 (Animations)
   - Developer C: User Story 3 (Colors & Typography)
3. After P1 stories complete:
   - Developer A: User Story 4 (Micro-interactions)
   - Developer B: User Story 5 (Empty States)
   - Developer C: User Story 6 (Form Design)
4. After P2 stories complete:
   - Developer A: User Story 7 (Loading States)
   - Developer B: User Story 8 (Responsive Design)
5. Team completes Polish phase together

---

## Task Summary

**Total Tasks**: 123
- **Setup (Phase 1)**: 10 tasks
- **Foundational (Phase 2)**: 7 tasks
- **User Story 1 (P1)**: 13 tasks (3 tests + 10 implementation)
- **User Story 2 (P1)**: 14 tasks (4 tests + 10 implementation)
- **User Story 3 (P1)**: 12 tasks (3 tests + 9 implementation)
- **User Story 4 (P2)**: 14 tasks (4 tests + 10 implementation)
- **User Story 5 (P2)**: 9 tasks (2 tests + 7 implementation)
- **User Story 6 (P2)**: 13 tasks (3 tests + 10 implementation)
- **User Story 7 (P3)**: 9 tasks (2 tests + 7 implementation)
- **User Story 8 (P3)**: 10 tasks (3 tests + 7 implementation)
- **Polish (Phase 11)**: 12 tasks

**Parallel Opportunities**: 67 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-5 (User Stories 1-3, all P1) = 56 tasks

**Test Coverage**: 24 test tasks across all user stories (TDD approach)

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Write tests FIRST, ensure they FAIL, then implement (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use DevTools to verify performance (60fps), accessibility (contrast ratios), and layout stability (CLS)
- Respect prefers-reduced-motion throughout implementation
- Maintain zero bundle size impact (use existing dependencies only)
- All changes are enhancements to existing components (no new features)
