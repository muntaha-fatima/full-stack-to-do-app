# Research & Technology Decisions

**Feature**: Next.js Todo App Frontend (Phase II)
**Date**: 2026-01-08
**Purpose**: Document all technology choices, rationale, and alternatives considered

## Technology Stack Decisions

### Decision 1: Next.js 14+ with App Router

**Chosen**: Next.js 14.0+ with App Router (not Pages Router)

**Rationale**:
- App Router is the modern, recommended approach for new Next.js projects
- React Server Components by default reduce client bundle size
- Improved performance with streaming and suspense
- Better developer experience with file-based routing
- Built-in support for layouts and loading states
- Aligns with Constitution Principle III (Component-Driven Architecture)

**Alternatives Considered**:
- **Next.js Pages Router**: Older, more stable but lacks RSC benefits. Rejected because App Router is the future and provides better performance.
- **Create React App**: Simpler but no SSR/SSG, worse performance, deprecated. Rejected for lack of modern features.
- **Vite + React**: Fast dev experience but requires manual SSR setup. Rejected because Next.js provides batteries-included solution.

**Implementation Notes**:
- Use `app/` directory structure
- Server Components by default, Client Components only when needed (interactivity, hooks, browser APIs)
- Leverage built-in `loading.tsx` and `error.tsx` for better UX

---

### Decision 2: TypeScript Strict Mode

**Chosen**: TypeScript 5.x with `strict: true` in tsconfig.json

**Rationale**:
- Catches bugs at compile time before they reach users
- Excellent IDE support with autocomplete and refactoring
- Self-documenting code through type annotations
- Aligns with Constitution Principle II (Type Safety Everywhere)
- Shared types between frontend and backend via `shared/types/`

**Alternatives Considered**:
- **JavaScript**: Faster to write but error-prone, no type safety. Rejected per constitution requirement.
- **TypeScript with loose mode**: Easier migration but defeats purpose. Rejected per constitution requirement.

**Implementation Notes**:
- Enable all strict flags: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.
- Define explicit return types for all functions
- Use Zod for runtime validation at API boundaries
- Share types via `shared/types/task.ts`

---

### Decision 3: Tailwind CSS for Styling

**Chosen**: Tailwind CSS 3.x with custom configuration

**Rationale**:
- Utility-first approach speeds development
- Consistent design system through configuration
- Excellent responsive design support
- Built-in dark mode support via `dark:` prefix
- Aligns with Constitution Principle VII (Styling Consistency)
- Smaller bundle size than traditional CSS frameworks

**Alternatives Considered**:
- **CSS Modules**: More traditional but verbose, harder to maintain consistency. Rejected for slower development.
- **Styled Components**: Runtime overhead, larger bundle. Rejected for performance concerns.
- **Plain CSS**: Maximum flexibility but no consistency guarantees. Rejected per constitution requirement.

**Implementation Notes**:
- Configure design tokens in `tailwind.config.js`:
  - 4px base spacing unit
  - Semantic color palette (primary, secondary, success, error, warning)
  - Custom breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Use `@tailwindcss/forms` plugin for better form styling
- Dark mode via `class` strategy (user-controlled toggle)

---

### Decision 4: React Query (TanStack Query) for Data Fetching

**Chosen**: @tanstack/react-query v5.x

**Rationale**:
- Automatic caching and request deduplication
- Built-in optimistic updates support
- Excellent loading and error state management
- Automatic background refetching
- Aligns with Constitution Principle VI (API Integration Discipline)
- Industry standard for React data fetching

**Alternatives Considered**:
- **SWR**: Similar features but less mature ecosystem. Rejected for smaller community.
- **Native fetch with useState**: Manual cache management, no deduplication. Rejected for complexity.
- **Redux Toolkit Query**: Overkill for simple CRUD, requires Redux. Rejected for unnecessary complexity.

**Implementation Notes**:
- Configure global defaults: `staleTime`, `cacheTime`, `retry` logic
- Use mutations for create/update/delete with optimistic updates
- Implement custom hooks: `useTasks`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`
- Error handling with user-friendly messages

---

### Decision 5: React Hot Toast for Notifications

**Chosen**: react-hot-toast v2.x

**Rationale**:
- Lightweight (< 5KB gzipped)
- Beautiful default styling
- Easy customization
- Supports promises for async operations
- Accessible by default

**Alternatives Considered**:
- **react-toastify**: More features but heavier (15KB+). Rejected for bundle size.
- **Custom toast component**: Full control but time-consuming. Rejected for time constraints.
- **Sonner**: Modern alternative but newer, less battle-tested. Rejected for maturity concerns.

**Implementation Notes**:
- Configure global toast settings in root layout
- Custom styling to match Tailwind theme
- Success, error, and loading toast variants
- Auto-dismiss after 3-5 seconds

---

### Decision 6: Zod for Schema Validation

**Chosen**: Zod v3.x for runtime type validation

**Rationale**:
- TypeScript-first schema validation
- Excellent error messages
- Can infer TypeScript types from schemas
- Validates API responses at runtime
- Aligns with Constitution Principle II (Type Safety Everywhere)

**Alternatives Considered**:
- **Yup**: Popular but less TypeScript-friendly. Rejected for worse DX.
- **Joi**: Node.js focused, larger bundle. Rejected for bundle size.
- **Manual validation**: Error-prone, no type inference. Rejected for safety concerns.

**Implementation Notes**:
- Define schemas in `lib/schemas/task.ts`
- Validate API responses before using data
- Use for form validation in TaskModal
- Share schemas with backend if possible

---

### Decision 7: Lucide React for Icons

**Chosen**: lucide-react v0.x (tree-shakeable icon library)

**Rationale**:
- Modern, consistent icon set
- Tree-shakeable (only bundle used icons)
- React components (not SVG sprites)
- Excellent TypeScript support
- Lightweight and performant

**Alternatives Considered**:
- **Heroicons**: Good but limited icon set. Rejected for fewer options.
- **React Icons**: Large bundle, not tree-shakeable. Rejected for bundle size.
- **Font Awesome**: Heavy, requires CSS. Rejected for performance.

**Implementation Notes**:
- Import only needed icons: `Check`, `Plus`, `Edit`, `Trash2`, `Moon`, `Sun`
- Consistent sizing: 20px for buttons, 16px for inline
- Accessible with proper ARIA labels

---

### Decision 8: Next Themes for Dark Mode

**Chosen**: next-themes v0.x

**Rationale**:
- Built specifically for Next.js
- Prevents flash of unstyled content (FOUC)
- Syncs with system preferences
- Persists preference in localStorage
- Works seamlessly with Tailwind dark mode

**Alternatives Considered**:
- **Custom implementation**: Full control but complex. Rejected for time constraints.
- **use-dark-mode hook**: Simpler but no Next.js optimizations. Rejected for FOUC issues.

**Implementation Notes**:
- Wrap app with `ThemeProvider` in root layout
- Use `useTheme` hook in header component
- Configure Tailwind with `darkMode: 'class'`
- Prevent FOUC with proper script injection

---

## Performance Strategy

**Bundle Size Budget**: < 500KB gzipped (per Success Criteria SC-012)

**Optimization Techniques**:
1. **Code Splitting**: Automatic with Next.js App Router
2. **Tree Shaking**: Import only used components/functions
3. **Image Optimization**: Use Next.js `<Image>` component (if images added)
4. **Font Optimization**: Use Next.js font optimization
5. **React Server Components**: Reduce client JavaScript by default

**Monitoring**:
- Lighthouse CI in pre-merge checks
- Bundle analyzer in development
- Performance budgets enforced in CI/CD

---

## Testing Strategy

**Test Framework**: Jest + React Testing Library

**Coverage Target**: 80% minimum (per Constitution Principle IV)

**Test Types**:
1. **Unit Tests**: Utilities, hooks, pure functions
2. **Component Tests**: Individual components in isolation
3. **Integration Tests**: User flows (add task, edit task, delete task)
4. **Accessibility Tests**: jest-axe for automated a11y checks

**TDD Approach** (per Constitution Principle IV):
1. Write failing test (Red)
2. Implement minimum code to pass (Green)
3. Refactor for quality (Refactor)

---

## Accessibility Strategy

**Target**: WCAG 2.1 AA compliance (per Constitution Principle V)

**Key Requirements**:
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- ARIA labels where semantic HTML insufficient
- Color contrast ratios ≥ 4.5:1 for text
- Touch targets ≥ 44x44px on mobile

**Tools**:
- eslint-plugin-jsx-a11y for linting
- jest-axe for automated testing
- Lighthouse accessibility audits
- Manual keyboard navigation testing

---

## Development Environment

**Node.js**: 18.x or 20.x LTS
**Package Manager**: npm 9+ (or pnpm for faster installs)
**IDE**: VS Code with recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Backend API base URL (required)
- `NODE_ENV`: development | production

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API not ready | High - blocks all features | Use mock API with MSW for development |
| Performance budget exceeded | Medium - poor UX | Monitor bundle size, use code splitting |
| Accessibility violations | High - legal/ethical | Automated testing + manual audits |
| Dark mode contrast issues | Medium - poor UX | Test all colors in both modes |
| Mobile layout breaks | Medium - poor UX | Test on real devices, use responsive design |

---

## Next Steps

1. ✅ Research complete - all technology decisions documented
2. ⏭️ Create data-model.md - define Task entity structure
3. ⏭️ Create contracts/ - define API endpoint contracts
4. ⏭️ Create quickstart.md - define test scenarios
5. ⏭️ Complete plan.md - full architecture and component design
