# Research: Frontend UI/UX Polish

**Feature**: 002-frontend-ui-polish
**Date**: 2026-01-08
**Purpose**: Document technology decisions and best practices for UI/UX enhancements

## Overview

This document captures research findings and architectural decisions for implementing professional UI/UX polish on the existing Next.js Todo App frontend. All decisions prioritize minimal bundle size impact, performance, and maintainability while achieving the visual quality goals defined in the specification.

---

## Decision 1: Animation Implementation Approach

### Options Considered

1. **Tailwind CSS + tailwindcss-animate (CHOSEN)**
   - Pros: Already installed, zero bundle size increase, utility-first approach, excellent performance
   - Cons: Limited to predefined animations, requires custom CSS for complex animations
   - Bundle Impact: 0 KB (already installed)

2. **Framer Motion**
   - Pros: Powerful animation library, gesture support, spring physics, declarative API
   - Cons: ~30KB gzipped bundle size, overkill for simple transitions, learning curve
   - Bundle Impact: +30 KB

3. **React Spring**
   - Pros: Physics-based animations, excellent performance, flexible
   - Cons: ~20KB gzipped, complex API, unnecessary for simple UI polish
   - Bundle Impact: +20 KB

### Decision: Tailwind CSS + tailwindcss-animate

**Rationale**:
- Already installed in the project (tailwindcss-animate 1.0.7)
- Covers 90% of animation needs: fade, slide, scale, spin
- Zero bundle size increase
- Consistent with constitution principle VII (Tailwind CSS for 95%+ of styling)
- Can supplement with custom CSS keyframes for the remaining 10% if needed

**Implementation Strategy**:
- Use Tailwind animate utilities: `animate-in`, `fade-in`, `slide-in`, `zoom-in`
- Define custom animations in `globals.css` only when Tailwind utilities insufficient
- Use CSS transitions for hover/focus states: `transition-all duration-200 ease-in-out`
- Respect `prefers-reduced-motion` with Tailwind's `motion-reduce:` prefix

**Best Practices**:
- Keep animations under 300ms for perceived performance (SC-002)
- Use `transform` and `opacity` for GPU-accelerated animations (60fps target)
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Use `will-change` sparingly and only during animation

---

## Decision 2: Design Token Implementation

### Options Considered

1. **CSS Custom Properties in globals.css (CHOSEN)**
   - Pros: Runtime theming, dark mode support, browser-native, no build step
   - Cons: No type safety, requires fallback values
   - Approach: Extend existing CSS variables in globals.css

2. **Tailwind Config Only**
   - Pros: Type-safe, build-time optimization, IntelliSense support
   - Cons: No runtime theming, harder to override dynamically
   - Approach: Extend theme in tailwind.config.ts

3. **Hybrid Approach (CSS Variables + Tailwind Config)**
   - Pros: Best of both worlds, type-safe with runtime flexibility
   - Cons: Slight complexity increase, duplication
   - Approach: Define CSS variables, reference in Tailwind config

### Decision: Hybrid Approach (CSS Variables + Tailwind Config)

**Rationale**:
- Existing implementation already uses this pattern (see tailwind.config.ts lines 20-52)
- Supports dark mode via CSS variables (next-themes already installed)
- Provides type safety through Tailwind IntelliSense
- Allows runtime theming if needed in future
- Consistent with existing codebase patterns

**Implementation Strategy**:
1. Define new CSS variables in `app/globals.css`:
   ```css
   :root {
     /* Spacing scale (4px base) */
     --spacing-xs: 0.25rem;  /* 4px */
     --spacing-sm: 0.5rem;   /* 8px */
     --spacing-md: 0.75rem;  /* 12px */
     --spacing-lg: 1rem;     /* 16px */
     --spacing-xl: 1.5rem;   /* 24px */
     --spacing-2xl: 2rem;    /* 32px */
     --spacing-3xl: 3rem;    /* 48px */

     /* Animation durations */
     --duration-fast: 150ms;
     --duration-normal: 200ms;
     --duration-slow: 300ms;

     /* Elevation (shadows) */
     --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
     --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
     --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
   }
   ```

2. Reference in `tailwind.config.ts`:
   ```typescript
   theme: {
     extend: {
       spacing: {
         'xs': 'var(--spacing-xs)',
         'sm': 'var(--spacing-sm)',
         // ... etc
       },
       transitionDuration: {
         'fast': 'var(--duration-fast)',
         'normal': 'var(--duration-normal)',
         'slow': 'var(--duration-slow)',
       }
     }
   }
   ```

3. Create TypeScript definitions in `lib/design-tokens.ts` for type safety

**Best Practices**:
- Use semantic naming (e.g., `--spacing-lg` not `--spacing-16`)
- Provide dark mode overrides where needed
- Document all tokens in data-model.md
- Keep token count minimal (avoid token explosion)

---

## Decision 3: Color Palette Enhancement

### Options Considered

1. **Extend Existing Palette (CHOSEN)**
   - Pros: Maintains consistency, minimal changes, leverages existing dark mode
   - Cons: Limited to existing color system
   - Approach: Add semantic colors for priority badges, status indicators

2. **New Color System (Radix Colors, Tailwind UI)**
   - Pros: Professional, comprehensive, well-tested
   - Cons: Breaking change, requires refactoring all components
   - Approach: Replace entire color system

### Decision: Extend Existing Palette

**Rationale**:
- Existing palette already uses HSL with CSS variables (good foundation)
- Dark mode support already implemented via next-themes
- Specification requires semantic colors (high/medium/low priority, success/warning/error)
- Minimal risk, no breaking changes

**Implementation Strategy**:
1. Add semantic color variables to `globals.css`:
   ```css
   :root {
     /* Priority colors */
     --priority-high: 0 84% 60%;      /* Red */
     --priority-medium: 38 92% 50%;   /* Amber */
     --priority-low: 142 76% 36%;     /* Green */

     /* Status colors */
     --status-success: 142 76% 36%;   /* Green */
     --status-warning: 38 92% 50%;    /* Amber */
     --status-error: 0 84% 60%;       /* Red */
     --status-info: 221 83% 53%;      /* Blue */
   }

   .dark {
     /* Adjust for dark mode (higher lightness) */
     --priority-high: 0 84% 70%;
     --priority-medium: 38 92% 60%;
     --priority-low: 142 76% 46%;
   }
   ```

2. Reference in Tailwind config for utility classes

**Best Practices**:
- Ensure WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)
- Test all colors in both light and dark modes
- Use HSL format for easier manipulation (adjust lightness for dark mode)
- Document color usage in data-model.md

---

## Decision 4: Typography System

### Options Considered

1. **Extend Tailwind Default Scale (CHOSEN)**
   - Pros: Already familiar, well-tested, responsive by default
   - Cons: Limited customization
   - Approach: Use existing scale with custom line heights

2. **Custom Type Scale (Modular Scale)**
   - Pros: Perfect mathematical ratios, professional
   - Cons: Overkill for small app, requires custom configuration
   - Approach: Define custom scale in Tailwind config

### Decision: Extend Tailwind Default Scale

**Rationale**:
- Tailwind's default scale is well-designed and sufficient
- Specification requires clear hierarchy (headings, body, captions)
- Existing implementation doesn't define custom typography
- Focus on line height and font weight for hierarchy, not size alone

**Implementation Strategy**:
1. Define typography tokens in `globals.css`:
   ```css
   :root {
     /* Font sizes (use Tailwind defaults) */
     /* text-xs: 0.75rem (12px) */
     /* text-sm: 0.875rem (14px) */
     /* text-base: 1rem (16px) */
     /* text-lg: 1.125rem (18px) */
     /* text-xl: 1.25rem (20px) */

     /* Line heights */
     --leading-tight: 1.25;
     --leading-normal: 1.5;
     --leading-relaxed: 1.75;
   }
   ```

2. Use Tailwind utilities consistently:
   - Task titles: `text-lg font-semibold leading-tight`
   - Task descriptions: `text-base font-normal leading-normal`
   - Metadata: `text-sm text-muted-foreground leading-normal`
   - Captions: `text-xs text-muted-foreground leading-tight`

**Best Practices**:
- Maintain 1.5 line height for body text (readability)
- Use font weight for hierarchy (regular, medium, semibold, bold)
- Ensure minimum 16px font size for body text (mobile readability)
- Test with long text to ensure proper wrapping

---

## Decision 5: Micro-interaction Implementation

### Options Considered

1. **CSS Transitions + Tailwind Utilities (CHOSEN)**
   - Pros: Simple, performant, no JavaScript, declarative
   - Cons: Limited to CSS-animatable properties
   - Approach: Use `transition-*` utilities with hover/focus states

2. **JavaScript-based Animations (GSAP, Anime.js)**
   - Pros: Complex animations, timeline control, callbacks
   - Cons: Bundle size, overkill for simple interactions
   - Approach: Import animation library

### Decision: CSS Transitions + Tailwind Utilities

**Rationale**:
- Specification requires simple micro-interactions (hover, focus, press)
- CSS transitions are sufficient for scale, opacity, color changes
- Zero bundle size increase
- Better performance (GPU-accelerated)
- Declarative and maintainable

**Implementation Strategy**:
1. Button press animation:
   ```tsx
   <button className="transition-transform duration-fast active:scale-95">
   ```

2. Card hover elevation:
   ```tsx
   <div className="transition-shadow duration-normal hover:shadow-lg">
   ```

3. Focus states:
   ```tsx
   <input className="transition-colors duration-fast focus:border-primary focus:ring-2 focus:ring-primary/20">
   ```

**Best Practices**:
- Use `duration-fast` (150ms) for immediate feedback (button press)
- Use `duration-normal` (200ms) for hover states
- Use `duration-slow` (300ms) for complex state changes
- Always include `ease-in-out` for natural motion
- Respect `prefers-reduced-motion` with `motion-reduce:` prefix

---

## Decision 6: Empty State Illustrations

### Options Considered

1. **SVG Icons from lucide-react (CHOSEN)**
   - Pros: Already installed, consistent style, zero bundle increase
   - Cons: Simple icons, not full illustrations
   - Approach: Use large icons with custom styling

2. **Illustration Libraries (unDraw, Storyset)**
   - Pros: Professional illustrations, free, customizable colors
   - Cons: External dependency, file size, licensing considerations
   - Approach: Download SVGs, optimize, include in repo

3. **Custom Illustrations**
   - Pros: Unique, perfectly tailored
   - Cons: Requires design skills, time-consuming
   - Approach: Design in Figma, export as SVG

### Decision: SVG Icons from lucide-react

**Rationale**:
- lucide-react already installed (0.562.0)
- Consistent with existing icon usage in the app
- Zero bundle size increase (tree-shaking)
- Simple, clean aesthetic matches minimal design
- Specification says "friendly illustration (not just text)" - large styled icons qualify

**Implementation Strategy**:
1. Use large icons (96px-128px) with custom styling:
   ```tsx
   <CheckCircle2 className="w-24 h-24 text-muted-foreground/30" />
   ```

2. Combine with encouraging copy:
   ```tsx
   <div className="text-center space-y-4">
     <CheckCircle2 className="w-24 h-24 mx-auto text-muted-foreground/30" />
     <h3 className="text-lg font-semibold">Ready to get organized?</h3>
     <p className="text-sm text-muted-foreground">Create your first task to get started</p>
   </div>
   ```

**Best Practices**:
- Use semantic icons (CheckCircle for tasks, Inbox for empty state)
- Apply low opacity to icons (30-40%) for subtle appearance
- Center-align empty state content
- Include clear call-to-action button

---

## Decision 7: Accessibility Testing Strategy

### Options Considered

1. **jest-axe + Manual Testing (CHOSEN)**
   - Pros: Already installed, automated + manual coverage, comprehensive
   - Cons: Requires discipline for manual testing
   - Approach: Automated tests + manual keyboard/screen reader testing

2. **Automated Only (jest-axe, Lighthouse CI)**
   - Pros: Fast, consistent, CI integration
   - Cons: Misses nuanced issues, false positives
   - Approach: Run in CI pipeline

3. **Manual Only**
   - Pros: Catches real-world issues
   - Cons: Time-consuming, inconsistent, not scalable
   - Approach: Manual testing checklist

### Decision: jest-axe + Manual Testing

**Rationale**:
- jest-axe already installed (10.0.0)
- Constitution requires WCAG 2.1 AA compliance
- Automated tests catch 30-40% of accessibility issues
- Manual testing required for keyboard navigation, screen readers
- Lighthouse audit provides additional validation

**Implementation Strategy**:
1. Automated tests with jest-axe:
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';

   test('TaskCard has no accessibility violations', async () => {
     const { container } = render(<TaskCard {...props} />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

2. Manual testing checklist:
   - [ ] All interactive elements keyboard accessible (Tab, Enter, Escape)
   - [ ] Focus indicators visible and clear
   - [ ] Screen reader announces all content correctly
   - [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
   - [ ] Animations respect `prefers-reduced-motion`

3. Lighthouse audit:
   - Run before and after implementation
   - Target: ≥90 accessibility score
   - Document any violations and remediation

**Best Practices**:
- Write jest-axe tests for all new/modified components
- Test with keyboard only (no mouse)
- Test with screen reader (NVDA on Windows, VoiceOver on Mac)
- Use browser DevTools accessibility inspector
- Document accessibility considerations in component comments

---

## Decision 8: Performance Monitoring

### Options Considered

1. **Lighthouse + Bundle Analysis (CHOSEN)**
   - Pros: Comprehensive, free, industry standard
   - Cons: Manual process, requires discipline
   - Approach: Run Lighthouse before/after, analyze bundle with Next.js

2. **Real User Monitoring (RUM)**
   - Pros: Real-world data, continuous monitoring
   - Cons: Requires service (Sentry, DataDog), overkill for small app
   - Approach: Integrate RUM service

### Decision: Lighthouse + Bundle Analysis

**Rationale**:
- Lighthouse is free, comprehensive, and industry standard
- Next.js has built-in bundle analysis (`npm run build`)
- Constitution requires performance budgets (FCP <1.5s, LCP <2.5s)
- Specification requires 60fps animations and <500KB bundle increase

**Implementation Strategy**:
1. Baseline measurement (before implementation):
   ```bash
   npm run build
   # Note bundle sizes

   npx lighthouse http://localhost:3000 --view
   # Note FCP, LCP, TTI, CLS scores
   ```

2. Post-implementation measurement:
   ```bash
   npm run build
   # Compare bundle sizes (target: <500KB increase)

   npx lighthouse http://localhost:3000 --view
   # Compare performance scores (target: no regression)
   ```

3. Animation performance testing:
   - Use Chrome DevTools Performance tab
   - Record during animations
   - Verify 60fps (16.67ms per frame)
   - Check for layout thrashing, forced reflows

**Best Practices**:
- Run Lighthouse in incognito mode (no extensions)
- Test on throttled network (Fast 3G) and CPU (4x slowdown)
- Use production build, not development
- Document baseline and post-implementation scores
- Set up performance budgets in `next.config.js` if needed

---

## Summary of Decisions

| Decision | Choice | Rationale | Bundle Impact |
|----------|--------|-----------|---------------|
| Animation | Tailwind CSS + tailwindcss-animate | Already installed, zero bundle increase | 0 KB |
| Design Tokens | CSS Variables + Tailwind Config | Existing pattern, dark mode support | 0 KB |
| Color Palette | Extend existing palette | Maintains consistency, minimal risk | 0 KB |
| Typography | Extend Tailwind default scale | Sufficient for needs, well-tested | 0 KB |
| Micro-interactions | CSS Transitions + Tailwind | Simple, performant, declarative | 0 KB |
| Empty State | lucide-react icons | Already installed, consistent style | 0 KB |
| Accessibility | jest-axe + Manual Testing | Comprehensive coverage, already installed | 0 KB |
| Performance | Lighthouse + Bundle Analysis | Industry standard, free, comprehensive | 0 KB |

**Total Bundle Impact**: 0 KB (all dependencies already installed)

**Key Principles**:
- Leverage existing dependencies (zero new packages)
- Use Tailwind CSS for 95%+ of styling (constitution compliance)
- Prioritize performance (60fps, <300ms animations)
- Ensure accessibility (WCAG 2.1 AA, keyboard navigation)
- Maintain simplicity (no over-engineering)

---

## Next Steps

1. **Phase 1**: Create data-model.md with design token schema
2. **Phase 1**: Create contracts/ with TypeScript type definitions
3. **Phase 1**: Create quickstart.md with testing scenarios
4. **Phase 1**: Update agent context with new patterns
5. **Phase 2**: Generate tasks.md with atomic, testable tasks (via `/sp.tasks` command)
