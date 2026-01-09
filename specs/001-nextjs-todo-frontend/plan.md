# Implementation Plan: Next.js Todo App Frontend (Phase II)

**Branch**: `001-nextjs-todo-frontend` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nextjs-todo-frontend/spec.md`

## Summary

Build a modern, polished Next.js 14 frontend for the Todo application with emphasis on user experience, performance, and accessibility. The frontend will consume an existing FastAPI backend and provide a premium productivity tool experience inspired by Todoist, Notion, and Linear. Key features include task CRUD operations with optimistic updates, dark mode support, responsive design, and comprehensive accessibility.

**Technical Approach**: Next.js 14 App Router with React Server Components by default, TypeScript strict mode, Tailwind CSS for styling, React Query for data fetching with optimistic updates, and comprehensive testing with Jest and React Testing Library.

## Technical Context


**Language/Version**: TypeScript 5.x with strict mode enabled
**Primary Dependencies**: Next.js 14.x, React 18.x, Tailwind CSS 3.x, React Query 5.x, Zod 3.x
**Storage**: Backend API (FastAPI + PostgreSQL) - frontend is stateless except localStorage for dark mode preference
**Testing**: Jest 29.x + React Testing Library + jest-axe for accessibility testing
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Web application (frontend only)
**Performance Goals**: FCP < 1.5s, LCP < 2.5s, TTI < 3.5s, bundle < 500KB gzipped
**Constraints**: WCAG 2.1 AA compliance, 80% test coverage, Lighthouse scores ≥ 90
**Scale/Scope**: Single-user experience, ~20 components, 6 user stories, MVP-first approach

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check (Phase 0)

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Frontend Excellence First | Clean, minimal, modern aesthetic | ✅ PASS | Spec emphasizes polished UI inspired by premium tools |
| II. Type Safety Everywhere | TypeScript strict mode | ✅ PASS | Strict mode required, Zod for runtime validation |
| III. Component-Driven Architecture | Small, reusable components | ✅ PASS | Component hierarchy defined below |
| IV. Test-First Development | TDD with 80% coverage | ✅ PASS | Testing strategy defined in research.md |
| V. Performance & Accessibility | Lighthouse ≥ 90, WCAG AA | ✅ PASS | Performance budgets and a11y requirements in spec |
| VI. API Integration Discipline | Optimistic updates, error handling | ✅ PASS | React Query with optimistic updates planned |
| VII. Styling Consistency | Tailwind CSS for 95%+ styling | ✅ PASS | Tailwind chosen as primary styling solution |

**Result**: ✅ All principles satisfied. Proceed to Phase 0 research.

### Post-Design Check (Phase 1)

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Frontend Excellence First | Design system with tokens | ✅ PASS | Tailwind config with semantic colors, spacing scale |
| II. Type Safety Everywhere | Shared types, Zod schemas | ✅ PASS | Types in shared/types/, schemas in lib/schemas/ |
| III. Component-Driven Architecture | RSC by default, clear hierarchy | ✅ PASS | Component tree defined, RSC vs Client Components marked |
| IV. Test-First Development | Test files for all components | ✅ PASS | Test structure mirrors component structure |
| V. Performance & Accessibility | Code splitting, semantic HTML | ✅ PASS | App Router auto-splits, ARIA labels where needed |
| VI. API Integration Discipline | Custom hooks, error boundaries | ✅ PASS | Hooks in lib/hooks/, error handling in all mutations |
| VII. Styling Consistency | No custom CSS except animations | ✅ PASS | 95%+ Tailwind, CSS modules only for complex animations |

**Result**: ✅ All principles satisfied. Proceed to Phase 2 tasks.

## Project Structure

### Documentation (this feature)

```text
specs/001-nextjs-todo-frontend/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Technology decisions (completed)
├── data-model.md        # Data structures (completed)
├── quickstart.md        # Test scenarios (completed)
├── contracts/           # API contracts (completed)
│   └── api-endpoints.md
├── checklists/          # Quality checklists
│   └── requirements.md
└── tasks.md             # Task breakdown (next: /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (RSC) - ThemeProvider, QueryProvider
│   ├── page.tsx                 # Home page (RSC) - TaskList container
│   ├── loading.tsx              # Loading UI (RSC) - Skeleton loaders
│   ├── error.tsx                # Error boundary (Client) - Error display
│   └── globals.css              # Global styles - Tailwind directives
│
├── components/                   # React components
│   ├── Header/                  # App header
│   │   ├── Header.tsx           # (RSC) - App title, dark mode toggle
│   │   ├── DarkModeToggle.tsx   # (Client) - Theme switcher
│   │   └── Header.test.tsx
│   │
│   ├── TaskList/                # Task list container
│   │   ├── TaskList.tsx         # (Client) - Fetches and displays tasks
│   │   ├── TaskListSkeleton.tsx # (RSC) - Loading skeleton
│   │   ├── EmptyState.tsx       # (RSC) - No tasks message
│   │   └── TaskList.test.tsx
│   │
│   ├── TaskCard/                # Individual task display
│   │   ├── TaskCard.tsx         # (Client) - Task item with interactions
│   │   ├── TaskCheckbox.tsx     # (Client) - Completion toggle
│   │   ├── PriorityBadge.tsx    # (RSC) - Priority indicator
│   │   ├── TagChip.tsx          # (RSC) - Tag display
│   │   └── TaskCard.test.tsx
│   │
│   ├── TaskModal/               # Add/Edit task modal
│   │   ├── TaskModal.tsx        # (Client) - Modal container
│   │   ├── TaskForm.tsx         # (Client) - Form with validation
│   │   ├── PrioritySelector.tsx # (Client) - Priority picker
│   │   ├── TagInput.tsx         # (Client) - Tag input field
│   │   └── TaskModal.test.tsx
│   │
│   ├── AddTaskButton/           # Floating action button
│   │   ├── AddTaskButton.tsx    # (Client) - Opens modal
│   │   └── AddTaskButton.test.tsx
│   │
│   └── ui/                      # Reusable UI primitives
│       ├── Button.tsx           # (RSC) - Button component
│       ├── Input.tsx            # (RSC) - Input field
│       ├── Textarea.tsx         # (RSC) - Textarea field
│       ├── Modal.tsx            # (Client) - Modal wrapper
│       ├── Toast.tsx            # (Client) - Toast notification
│       └── Skeleton.tsx         # (RSC) - Loading skeleton
│
├── lib/                         # Utilities and configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTasks.ts          # Fetch all tasks
│   │   ├── useCreateTask.ts     # Create task mutation
│   │   ├── useUpdateTask.ts     # Update task mutation
│   │   ├── useDeleteTask.ts     # Delete task mutation
│   │   └── useTaskForm.ts       # Form state management
│   │
│   ├── schemas/                 # Zod validation schemas
│   │   ├── task.ts              # Task schema
│   │   └── task-input.ts        # Create/Update input schemas
│   │
│   ├── utils/                   # Utility functions
│   │   ├── api.ts               # API client configuration
│   │   ├── api-error.ts         # Error parsing
│   │   ├── cn.ts                # Tailwind class merger (clsx + twMerge)
│   │   └── format-date.ts       # Date formatting
│   │
│   ├── react-query/             # React Query configuration
│   │   ├── provider.tsx         # QueryClientProvider wrapper
│   │   └── config.ts            # Query client config
│   │
│   └── constants/               # App constants
│       ├── priorities.ts        # Priority definitions
│       └── colors.ts            # Color mappings
│
├── shared/                      # Shared with backend (symlink or copy)
│   └── types/
│       └── task.ts              # Task TypeScript interface
│
├── __tests__/                   # Test files
│   ├── integration/             # Integration tests
│   │   ├── task-crud.test.tsx   # Full CRUD flow
│   │   └── dark-mode.test.tsx   # Dark mode flow
│   │
│   ├── a11y/                    # Accessibility tests
│   │   └── keyboard-nav.test.tsx
│   │
│   └── setup.ts                 # Test setup and mocks
│
├── public/                      # Static assets
│   ├── favicon.ico
│   └── images/
│       └── empty-state.svg      # Empty state illustration
│
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── jest.config.js               # Jest configuration
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── package.json                 # Dependencies
└── .env.local.example           # Environment variables template
```

**Structure Decision**: Web application structure with Next.js App Router. Frontend-only implementation consuming existing backend API. Components organized by feature/function (not by type). Clear separation between Server Components (RSC) and Client Components for optimal performance.

## Component Architecture

### Component Hierarchy

```
App (layout.tsx)
├── ThemeProvider (next-themes)
├── QueryClientProvider (React Query)
└── Page (page.tsx)
    ├── Header (RSC)
    │   ├── AppTitle (RSC)
    │   └── DarkModeToggle (Client)
    │
    ├── TaskList (Client) - Data fetching
    │   ├── TaskListSkeleton (RSC) - Loading state
    │   ├── EmptyState (RSC) - No tasks
    │   └── TaskCard[] (Client) - Task items
    │       ├── TaskCheckbox (Client)
    │       ├── TaskTitle (RSC)
    │       ├── TaskDescription (RSC)
    │       ├── PriorityBadge (RSC)
    │       ├── TagChip[] (RSC)
    │       └── TaskActions (Client)
    │           ├── EditButton (Client)
    │           └── DeleteButton (Client)
    │
    ├── AddTaskButton (Client)
    │
    └── TaskModal (Client) - Conditional render
        └── TaskForm (Client)
            ├── Input (title)
            ├── Textarea (description)
            ├── PrioritySelector (Client)
            └── TagInput (Client)
```

### Component Responsibilities

#### Server Components (RSC)
- **Header**: Static app title and layout
- **PriorityBadge**: Static badge rendering (no interactivity)
- **TagChip**: Static tag display
- **EmptyState**: Static empty state message
- **TaskListSkeleton**: Loading skeleton (no state)
- **UI Primitives**: Button, Input, Textarea (when no client-side state)

#### Client Components
- **DarkModeToggle**: Uses `useTheme` hook
- **TaskList**: Uses `useTasks` hook for data fetching
- **TaskCard**: Handles hover states, click events
- **TaskCheckbox**: Handles completion toggle with `useUpdateTask`
- **TaskActions**: Edit/delete button handlers
- **AddTaskButton**: Opens modal (state management)
- **TaskModal**: Modal state, form submission
- **TaskForm**: Form state, validation, submission

### Data Flow

```
[Backend API]
    ↓ (HTTP)
[React Query Cache]
    ↓ (hooks)
[TaskList Component]
    ↓ (props)
[TaskCard Components]
    ↓ (events)
[Mutation Hooks]
    ↓ (optimistic update)
[React Query Cache] → [UI Update]
    ↓ (API call)
[Backend API]
    ↓ (success/error)
[React Query Cache] → [Confirm/Rollback]
```

### State Management Strategy

**Global State**: None (React Query cache serves as global state)

**Server State** (React Query):
- Tasks list: `['tasks']` query key
- Mutations: create, update, delete with optimistic updates

**Client State** (React hooks):
- Modal open/close: `useState` in page component
- Form state: `useState` in TaskForm component
- Dark mode: `useTheme` from next-themes (persisted in localStorage)

**No Redux/Zustand needed** - React Query handles all server state, local state is minimal and component-scoped.

## API Integration Strategy

### React Query Configuration

```typescript
// lib/react-query/config.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 30,     // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error instanceof Response && error.status >= 400 && error.status < 500) {
          return false; // Don't retry client errors
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Custom Hooks Pattern

All API interactions go through custom hooks:

1. **useTasks**: Fetch all tasks
2. **useCreateTask**: Create task with optimistic update
3. **useUpdateTask**: Update task with optimistic update
4. **useDeleteTask**: Delete task with optimistic update

Each mutation hook implements:
- `onMutate`: Optimistic update (immediate UI feedback)
- `onError`: Rollback + error toast
- `onSuccess`: Success toast
- `onSettled`: Invalidate queries to refetch

### Error Handling

**Three-Layer Error Handling**:

1. **API Layer** (lib/utils/api-error.ts):
   - Parse error responses
   - Map HTTP status codes to user messages
   - Handle network errors

2. **Hook Layer** (lib/hooks/*.ts):
   - Catch errors from API
   - Trigger rollback for optimistic updates
   - Show error toasts

3. **Component Layer** (error.tsx):
   - Error boundary for unexpected errors
   - Fallback UI with retry option

## Styling Strategy

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... full scale
          900: '#0c4a6e',
        },
        priority: {
          low: '#10b981',    // green
          medium: '#f59e0b', // orange
          high: '#ef4444',   // red
        },
      },
      spacing: {
        // 4px base unit
      },
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### Design Tokens

- **Spacing**: 4px base unit (0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64)
- **Colors**: Semantic naming (primary, secondary, success, error, warning)
- **Typography**: System font stack for performance
- **Breakpoints**: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

### Component Styling Patterns

```typescript
// Example: TaskCard.tsx
<div className="
  group
  relative
  rounded-lg
  border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-800
  p-4
  shadow-sm hover:shadow-md
  transition-shadow duration-200
">
  {/* Content */}
</div>
```

**Patterns**:
- `group` for hover effects on children
- `dark:` prefix for dark mode variants
- `transition-*` for smooth animations
- Consistent spacing with Tailwind scale

## Testing Strategy

### Test Structure

```
__tests__/
├── unit/                    # Component unit tests
│   ├── TaskCard.test.tsx
│   ├── TaskForm.test.tsx
│   └── hooks/
│       └── useTasks.test.ts
│
├── integration/             # User flow tests
│   ├── task-crud.test.tsx   # Create, read, update, delete flow
│   └── dark-mode.test.tsx   # Dark mode toggle flow
│
└── a11y/                    # Accessibility tests
    └── keyboard-nav.test.tsx
```

### Testing Approach (TDD)

**Red-Green-Refactor Cycle**:

1. **Red**: Write failing test
   ```typescript
   test('displays task title', () => {
     render(<TaskCard task={mockTask} />);
     expect(screen.getByText('Test Task')).toBeInTheDocument();
   });
   ```

2. **Green**: Implement minimum code to pass
   ```typescript
   export function TaskCard({ task }: Props) {
     return <div>{task.title}</div>;
   }
   ```

3. **Refactor**: Improve code quality
   ```typescript
   export function TaskCard({ task }: Props) {
     return (
       <div className="task-card">
         <h3 className="task-title">{task.title}</h3>
       </div>
     );
   }
   ```

### Test Coverage Targets

- **Overall**: 80% minimum
- **Critical paths**: 100% (task CRUD operations)
- **UI components**: 80%
- **Utility functions**: 100%
- **Hooks**: 90%

### Mock Strategy

**Mock Service Worker (MSW)** for API mocking:

```typescript
// __tests__/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Performance Optimization

### Bundle Size Strategy

**Target**: < 500KB gzipped

**Techniques**:
1. **Tree Shaking**: Import only used components
2. **Code Splitting**: Automatic with App Router
3. **Dynamic Imports**: For heavy components (if needed)
4. **Image Optimization**: Next.js Image component
5. **Font Optimization**: Next.js font optimization

### Rendering Strategy

- **Server Components**: Default for static content
- **Client Components**: Only for interactivity
- **Streaming**: Use Suspense for progressive rendering
- **Memoization**: React.memo for expensive components

### Caching Strategy

- **React Query**: 5-minute stale time, 30-minute cache time
- **Browser Cache**: Leverage Next.js automatic caching
- **CDN**: Static assets served from CDN (production)

## Accessibility Implementation

### WCAG 2.1 AA Compliance

**Requirements**:
1. **Keyboard Navigation**: All interactive elements accessible via Tab
2. **Focus Indicators**: Visible focus rings on all focusable elements
3. **ARIA Labels**: Where semantic HTML insufficient
4. **Color Contrast**: 4.5:1 minimum for text
5. **Touch Targets**: 44x44px minimum on mobile

### Implementation Checklist

- [ ] Semantic HTML (header, main, nav, button, etc.)
- [ ] ARIA labels for icon buttons
- [ ] Focus management in modal (trap focus, restore on close)
- [ ] Keyboard shortcuts (Escape to close modal, Enter to submit)
- [ ] Screen reader announcements for dynamic content
- [ ] Skip links for keyboard users
- [ ] Error messages associated with form fields

### Testing Tools

- **jest-axe**: Automated accessibility testing
- **eslint-plugin-jsx-a11y**: Linting for a11y issues
- **Lighthouse**: Accessibility audit
- **Manual testing**: Keyboard navigation, screen reader

## Deployment Strategy

### Build Process

```bash
# Production build
npm run build

# Output: .next/ directory with optimized bundles
```

### Environment Variables

**Required**:
- `NEXT_PUBLIC_API_URL`: Backend API base URL

**Optional**:
- `NODE_ENV`: development | production
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking (future)

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] Lighthouse scores ≥ 90
- [ ] Bundle size < 500KB gzipped
- [ ] Manual QA on staging
- [ ] Accessibility audit passed

## Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Backend API not ready | High | Medium | Use MSW for development, mock all endpoints |
| Performance budget exceeded | Medium | Low | Monitor bundle size, use code splitting |
| Accessibility violations | High | Medium | Automated testing + manual audits |
| Dark mode contrast issues | Medium | Medium | Test all colors in both modes, use contrast checker |
| Mobile layout breaks | Medium | Low | Test on real devices, use responsive design |
| Optimistic updates fail | Medium | Low | Comprehensive error handling and rollback |
| TypeScript errors block development | Low | Low | Strict mode from start, shared types |

## Implementation Phases

### Phase 1: Setup & Foundation (User Story Setup)
- Project initialization
- Dependencies installation
- Configuration files (TypeScript, Tailwind, Jest)
- Shared types
- API client setup
- React Query configuration

### Phase 2: Core UI Components (Foundational)
- UI primitives (Button, Input, Textarea, Modal)
- Layout components (Header, DarkModeToggle)
- Skeleton loaders
- Empty state

### Phase 3: User Story 1 - View and Manage Tasks (P1)
- TaskList component
- TaskCard component
- Task fetching hook (useTasks)
- Task completion toggle (useUpdateTask)
- Priority badges and tag chips
- Loading and error states

### Phase 4: User Story 2 - Add New Tasks (P1)
- AddTaskButton component
- TaskModal component
- TaskForm component
- Create task hook (useCreateTask)
- Form validation
- Optimistic updates

### Phase 5: User Story 3 - Edit Tasks (P2)
- Edit functionality in TaskModal
- Pre-fill form with task data
- Update task hook (useUpdateTask)
- Optimistic updates

### Phase 6: User Story 4 - Delete Tasks (P2)
- Delete button in TaskCard
- Delete task hook (useDeleteTask)
- Optimistic updates
- Confirmation (optional)

### Phase 7: User Story 5 - Dark Mode (P3)
- Dark mode toggle implementation
- Theme persistence
- Color scheme adjustments
- Contrast validation

### Phase 8: User Story 6 - Responsive Design (P2)
- Mobile layout (< 768px)
- Tablet layout (768-1024px)
- Desktop layout (> 1024px)
- Touch target optimization

### Phase 9: Polish & Testing
- Accessibility audit and fixes
- Performance optimization
- Integration tests
- End-to-end testing
- Documentation

## Success Metrics

### Performance Metrics
- First Contentful Paint (FCP): < 1.5s ✅
- Largest Contentful Paint (LCP): < 2.5s ✅
- Time to Interactive (TTI): < 3.5s ✅
- Cumulative Layout Shift (CLS): < 0.1 ✅
- Bundle size: < 500KB gzipped ✅

### Quality Metrics
- Test coverage: ≥ 80% ✅
- Lighthouse Performance: ≥ 90 ✅
- Lighthouse Accessibility: ≥ 90 ✅
- TypeScript strict mode: No errors ✅
- ESLint: No warnings ✅

### User Experience Metrics
- Task creation success rate: ≥ 95% ✅
- Optimistic update latency: < 100ms ✅
- Task completion toggle latency: < 50ms ✅
- Mobile usability: All touch targets ≥ 44x44px ✅

## Next Steps

1. ✅ Phase 0: Research complete (research.md)
2. ✅ Phase 1: Design complete (data-model.md, contracts/, quickstart.md)
3. ⏭️ Phase 2: Generate tasks (/sp.tasks command)
4. ⏭️ Phase 3: Begin implementation (TDD approach)

---

**Plan Status**: ✅ Complete
**Ready for**: Task generation (/sp.tasks)
**Estimated Components**: ~20
**Estimated Test Files**: ~15
**Estimated Implementation Time**: Based on task breakdown
