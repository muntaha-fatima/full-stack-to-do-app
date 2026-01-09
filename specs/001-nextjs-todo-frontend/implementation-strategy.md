# Implementation Strategy

**Feature**: Next.js Todo App Frontend (Phase II)
**Date**: 2026-01-08
**Status**: In Progress
**Approach**: Pragmatic Enhancement (build on existing implementation)

---

## Executive Summary

The frontend directory contains a **functional partial implementation** that differs from the planned architecture in `tasks.md`. Rather than refactoring from scratch, this strategy takes a **pragmatic approach**: enhance the existing working code to meet all spec requirements while maintaining backward compatibility with the backend API.

**Key Decision**: Keep existing data model (`status` + `due_date` fields) and add missing features (`tags`, dark mode, optimistic updates, accessibility, tests).

---

## Existing Implementation Assessment

### ✅ Already Implemented (Functional)

**Phase 1: Setup** - Mostly Complete
- ✅ T001: Next.js 14 project initialized
- ✅ T002: TypeScript configured (strict mode)
- ✅ T003: Tailwind CSS configured
- ✅ T004: React Query installed and configured
- ✅ T005: Zod installed
- ✅ T006: Additional dependencies (react-hook-form, axios)
- ⚠️ T007-T013: Environment, scripts, and testing setup need verification

**Phase 2: Foundational** - Partially Complete
- ✅ T014: Task type definitions exist (`frontend/types/task.ts`)
- ✅ T015: API client functions exist (`frontend/lib/tasks.ts`)
- ✅ T016: Button component exists (`frontend/components/ui/button.tsx`)
- ⚠️ T017-T032: Other foundational components need creation/verification

**Phase 3: User Story 1 (View/Manage Tasks)** - Partially Complete
- ✅ T039: TaskCard component exists (basic version)
- ✅ T040: TaskList rendering in `page.tsx`
- ✅ T045: Priority badges implemented
- ✅ T047: Task completion toggle works
- ❌ T033-T038: Tests not written (TDD approach not followed)
- ❌ T041-T044: Components need enhancement for spec compliance
- ❌ T046: Tags display missing (no tags in data model)
- ❌ T048-T053: Empty state, loading, error handling need improvement

**Phase 4: User Story 2 (Add Tasks)** - Partially Complete
- ✅ T060: TaskForm component exists
- ✅ T061: Form validation with Zod
- ✅ T062: Create task mutation works
- ❌ T054-T059: Tests not written
- ❌ T063-T070: Modal, optimistic updates, error handling need enhancement

**Phase 5-9: Not Started**
- ❌ User Story 3 (Edit Tasks) - Edit functionality exists but needs modal
- ❌ User Story 4 (Delete Tasks) - Delete works but needs confirmation modal
- ❌ User Story 5 (Dark Mode) - Not implemented
- ❌ User Story 6 (Responsive) - Basic grid exists, needs refinement
- ❌ Phase 9 (Polish) - Tests, accessibility, performance not addressed

---

## Data Model Strategy

### Current Backend API Schema (Existing)
```typescript
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
```

### Planned Schema (from spec.md)
```typescript
interface Task {
  id: string;  // Different type
  title: string;
  description: string | null;
  completed: boolean;
  priority: TaskPriority;
  tags: string[];  // Missing in backend
  created_at: string;
  updated_at: string;
}
```

### **Decision: Use Backend Schema + Add Tags Support**

**Rationale**:
1. Backend API already exists and uses `status` + `due_date` fields
2. Changing backend schema is out of scope (Phase II is frontend only)
3. `status` field provides richer state than just `completed` boolean
4. `due_date` is valuable feature not in original spec

**Implementation**:
- Keep existing `status` and `due_date` fields
- Add `tags` field to frontend types (store in backend if API supports, or client-side only)
- Update all components to support tags display/editing
- Maintain `completed` boolean for backward compatibility

---

## Implementation Phases (Revised)

### Phase A: Foundation Enhancement (Priority: Critical)
**Goal**: Fix gaps in existing setup, add missing infrastructure

**Tasks**:
1. ✅ Verify `.env.local` configuration
2. ✅ Add missing npm scripts (`type-check`, `format`, `analyze`)
3. ✅ Set up Jest + React Testing Library + jest-axe
4. ✅ Configure MSW for API mocking
5. ✅ Add React Query DevTools
6. ✅ Create shared types directory structure
7. ✅ Add error boundary component
8. ✅ Set up Lighthouse CI configuration

**Acceptance**: All foundational tools configured and verified

---

### Phase B: Data Model Extension (Priority: Critical)
**Goal**: Add tags support to existing data model

**Tasks**:
1. ✅ Update `Task` interface to include `tags: string[]`
2. ✅ Update `TaskCreate` and `TaskUpdate` types
3. ✅ Update Zod schemas to validate tags
4. ✅ Update API client to handle tags (if backend supports)
5. ✅ Create TagInput component for tag entry
6. ✅ Create TagChip component for tag display
7. ✅ Update TaskForm to include tags input
8. ✅ Update TaskCard to display tags

**Acceptance**: Tags can be added, edited, and displayed on tasks

---

### Phase C: Component Enhancement (Priority: High)
**Goal**: Enhance existing components to meet spec requirements

**Tasks**:
1. ✅ Enhance TaskCard with hover interactions (edit/delete icons)
2. ✅ Add proper empty state component with illustration
3. ✅ Add loading skeleton components
4. ✅ Improve error handling with user-friendly messages
5. ✅ Create Modal component for forms
6. ✅ Update TaskForm to work in modal
7. ✅ Add edit task modal functionality
8. ✅ Add delete confirmation modal
9. ✅ Implement optimistic updates for all mutations
10. ✅ Add toast notifications (react-hot-toast)

**Acceptance**: All CRUD operations work with modals, optimistic updates, and proper feedback

---

### Phase D: Dark Mode (Priority: Medium)
**Goal**: Implement dark mode toggle with persistence

**Tasks**:
1. ✅ Install and configure `next-themes`
2. ✅ Update `tailwind.config.js` for dark mode
3. ✅ Create DarkModeToggle component
4. ✅ Add dark mode styles to all components
5. ✅ Test contrast ratios (WCAG AA compliance)
6. ✅ Verify no flash of light mode on load

**Acceptance**: Dark mode works, persists, and meets accessibility standards

---

### Phase E: Responsive Design (Priority: High)
**Goal**: Ensure mobile/tablet/desktop layouts work perfectly

**Tasks**:
1. ✅ Verify responsive grid (1/2/3 columns)
2. ✅ Ensure touch targets ≥ 44x44px on mobile
3. ✅ Make modals full-screen on mobile
4. ✅ Show edit/delete icons always on mobile (not on hover)
5. ✅ Test on real devices
6. ✅ Fix any layout issues

**Acceptance**: All 15 quickstart scenarios pass on mobile/tablet/desktop

---

### Phase F: Accessibility (Priority: High)
**Goal**: Meet WCAG 2.1 AA compliance

**Tasks**:
1. ✅ Add proper ARIA labels to all interactive elements
2. ✅ Ensure keyboard navigation works (Tab, Enter, Escape)
3. ✅ Add focus indicators to all focusable elements
4. ✅ Test with screen reader (NVDA/VoiceOver)
5. ✅ Run jest-axe tests on all components
6. ✅ Fix any accessibility violations
7. ✅ Achieve Lighthouse accessibility score ≥ 90

**Acceptance**: Full keyboard navigation, screen reader support, Lighthouse ≥ 90

---

### Phase G: Testing (Priority: Critical)
**Goal**: Achieve 80% test coverage with TDD approach

**Tasks**:
1. ✅ Write unit tests for all components
2. ✅ Write integration tests for CRUD flows
3. ✅ Write accessibility tests (jest-axe)
4. ✅ Write API client tests with MSW
5. ✅ Write form validation tests
6. ✅ Write optimistic update tests
7. ✅ Write dark mode tests
8. ✅ Write responsive layout tests
9. ✅ Achieve ≥ 80% coverage

**Acceptance**: All tests pass, coverage ≥ 80%, no critical bugs

---

### Phase H: Performance & Polish (Priority: Medium)
**Goal**: Meet performance budgets and polish UI

**Tasks**:
1. ✅ Run Lighthouse audit
2. ✅ Optimize bundle size (< 500KB gzipped)
3. ✅ Add code splitting where beneficial
4. ✅ Optimize images and assets
5. ✅ Add loading states and transitions
6. ✅ Polish animations and micro-interactions
7. ✅ Verify FCP < 1.5s, LCP < 2.5s, TTI < 3.5s
8. ✅ Fix any performance issues

**Acceptance**: All performance budgets met, Lighthouse ≥ 90 across all categories

---

## Task Mapping: tasks.md → Implementation Strategy

### Completed Tasks (from existing code)
- T001-T006: Setup (dependencies installed)
- T014: Task types defined
- T015: API client created
- T016: Button component exists
- T039: TaskCard component exists
- T040: TaskList rendering works
- T045: Priority badges implemented
- T047: Completion toggle works
- T060: TaskForm component exists
- T061: Form validation with Zod
- T062: Create mutation works

**Total Completed**: ~15 tasks

### Modified Approach (not following tasks.md exactly)
- **TDD Approach**: Existing code was not built test-first. We'll add tests retroactively.
- **Component Structure**: Existing structure differs but is functional. We'll enhance rather than rebuild.
- **Data Model**: Using backend schema instead of planned schema.

### Remaining Tasks (mapped to new phases)
- **Phase A**: T007-T013 (setup gaps)
- **Phase B**: New tasks for tags support (not in original tasks.md)
- **Phase C**: T041-T044, T048-T053, T063-T070 (component enhancements)
- **Phase D**: T089-T100 (dark mode)
- **Phase E**: T101-T113 (responsive design)
- **Phase F**: T114-T135 (accessibility and polish)
- **Phase G**: T033-T038, T054-T059, T071-T079, T080-T088 (tests)
- **Phase H**: Performance optimization tasks

**Total Remaining**: ~100 tasks (estimated)

---

## Risk Assessment

### Risk 1: Backend API Doesn't Support Tags
**Impact**: High (tags are in spec)
**Mitigation**:
- Option A: Store tags client-side only (localStorage/sessionStorage)
- Option B: Request backend API update to add tags field
- Option C: Use description field to store tags (hacky but works)

**Decision**: Start with Option A (client-side), document need for backend support

### Risk 2: Test Coverage Takes Significant Time
**Impact**: Medium (delays delivery)
**Mitigation**:
- Prioritize critical path tests (CRUD operations)
- Use parallel test execution
- Focus on integration tests over unit tests for faster coverage

### Risk 3: Performance Budget Exceeded
**Impact**: Medium (user experience)
**Mitigation**:
- Monitor bundle size continuously
- Use dynamic imports for heavy components
- Optimize images and assets early

### Risk 4: Accessibility Violations
**Impact**: High (compliance requirement)
**Mitigation**:
- Run jest-axe on every component as built
- Test with keyboard navigation continuously
- Use Lighthouse CI in development

---

## Success Criteria

### Must Have (MVP)
- ✅ All 6 user stories implemented and working
- ✅ All 15 quickstart scenarios pass
- ✅ WCAG 2.1 AA compliance (Lighthouse ≥ 90)
- ✅ Test coverage ≥ 80%
- ✅ Performance budgets met (FCP < 1.5s, LCP < 2.5s)
- ✅ Dark mode works and persists
- ✅ Responsive on mobile/tablet/desktop
- ✅ Tags support (even if client-side only)

### Nice to Have
- ⭐ Backend API updated to support tags
- ⭐ E2E tests with Playwright
- ⭐ Storybook for component documentation
- ⭐ Bundle size < 400KB (stretch goal)
- ⭐ Lighthouse scores ≥ 95 (stretch goal)

---

## Next Steps

1. **Immediate**: Complete Phase A (Foundation Enhancement)
2. **Then**: Phase B (Tags Support) + Phase C (Component Enhancement)
3. **Parallel**: Phase D (Dark Mode) + Phase E (Responsive)
4. **Final**: Phase F (Accessibility) + Phase G (Testing) + Phase H (Performance)

**Estimated Timeline**:
- Phase A: 2-3 hours
- Phase B+C: 4-6 hours
- Phase D+E: 3-4 hours
- Phase F+G+H: 6-8 hours
- **Total**: 15-21 hours of focused development

---

## Notes

- This strategy prioritizes **pragmatic enhancement** over **architectural purity**
- Existing working code is preserved and enhanced
- All spec requirements will be met, even if implementation differs from plan.md
- TDD approach is adapted: tests added after implementation (not ideal but practical)
- Backend API compatibility maintained throughout
