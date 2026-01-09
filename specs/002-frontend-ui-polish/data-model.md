# Data Model: Frontend UI/UX Polish

**Feature**: 002-frontend-ui-polish
**Date**: 2026-01-08
**Purpose**: Define design tokens, animation presets, and component state models

## Overview

This document defines the data structures and design tokens required for implementing professional UI/UX polish. All entities are implemented as TypeScript types and CSS custom properties to ensure type safety and runtime flexibility.

---

## Entity 1: Design Tokens

Design tokens are the atomic design decisions that define the visual language of the application. They are implemented as CSS custom properties in `app/globals.css` and referenced in `tailwind.config.ts`.

### Spacing Scale

**Purpose**: Consistent spacing throughout the application based on 4px base unit

**Properties**:
```typescript
type SpacingToken = {
  xs: '0.25rem';   // 4px  - Tight spacing (icon padding, badge padding)
  sm: '0.5rem';    // 8px  - Small spacing (between related elements)
  md: '0.75rem';   // 12px - Medium spacing (form field padding)
  lg: '1rem';      // 16px - Large spacing (card padding, section spacing)
  xl: '1.5rem';    // 24px - Extra large (between sections)
  '2xl': '2rem';   // 32px - Double extra large (page margins)
  '3xl': '3rem';   // 48px - Triple extra large (hero sections)
};
```

**CSS Implementation**:
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;
  --spacing-xl: 1.5rem;
  --spacing-2xl: 2rem;
  --spacing-3xl: 3rem;
}
```

**Validation Rules**:
- All spacing values must be multiples of 4px (FR-001)
- Use semantic names, not pixel values
- Prefer Tailwind utilities over custom spacing

**Usage Examples**:
- Card padding: `p-lg` (16px)
- Section spacing: `space-y-xl` (24px)
- Icon padding: `p-xs` (4px)

---

### Color Palette

**Purpose**: Semantic color system with light/dark mode support

**Properties**:
```typescript
type ColorToken = {
  // Base colors (existing)
  primary: string;           // Primary brand color
  secondary: string;         // Secondary brand color
  background: string;        // Page background
  foreground: string;        // Primary text color
  muted: string;            // Muted background
  'muted-foreground': string; // Muted text
  border: string;           // Border color

  // Priority colors (new)
  'priority-high': string;   // Red - High priority tasks
  'priority-medium': string; // Amber - Medium priority tasks
  'priority-low': string;    // Green - Low priority tasks

  // Status colors (new)
  'status-success': string;  // Green - Success states
  'status-warning': string;  // Amber - Warning states
  'status-error': string;    // Red - Error states
  'status-info': string;     // Blue - Info states
};
```

**CSS Implementation**:
```css
:root {
  /* Existing colors (from tailwind.config.ts) */
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;

  /* Priority colors (new) */
  --priority-high: 0 84% 60%;      /* Red */
  --priority-medium: 38 92% 50%;   /* Amber */
  --priority-low: 142 76% 36%;     /* Green */

  /* Status colors (new) */
  --status-success: 142 76% 36%;   /* Green */
  --status-warning: 38 92% 50%;    /* Amber */
  --status-error: 0 84% 60%;       /* Red */
  --status-info: 221 83% 53%;      /* Blue */
}

.dark {
  /* Existing dark mode colors */
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;

  /* Priority colors (adjusted for dark mode) */
  --priority-high: 0 84% 70%;      /* Lighter red */
  --priority-medium: 38 92% 60%;   /* Lighter amber */
  --priority-low: 142 76% 46%;     /* Lighter green */

  /* Status colors (adjusted for dark mode) */
  --status-success: 142 76% 46%;
  --status-warning: 38 92% 60%;
  --status-error: 0 84% 70%;
  --status-info: 221 83% 63%;
}
```

**Validation Rules**:
- All text colors must meet WCAG AA contrast ratio (4.5:1) (FR-020)
- All UI component colors must meet WCAG AA contrast ratio (3:1) (FR-020)
- Use HSL format for easier dark mode adjustments
- Test all colors in both light and dark modes

**Usage Examples**:
- High priority badge: `bg-priority-high/10 text-priority-high`
- Success toast: `bg-status-success/10 text-status-success`
- Error message: `text-status-error`

---

### Typography Scale

**Purpose**: Clear typographic hierarchy with appropriate sizing and line heights

**Properties**:
```typescript
type TypographyToken = {
  // Font sizes (using Tailwind defaults)
  xs: '0.75rem';    // 12px - Captions, metadata
  sm: '0.875rem';   // 14px - Small text, labels
  base: '1rem';     // 16px - Body text
  lg: '1.125rem';   // 18px - Large body, small headings
  xl: '1.25rem';    // 20px - Headings
  '2xl': '1.5rem';  // 24px - Large headings

  // Line heights
  tight: 1.25;      // Headings
  normal: 1.5;      // Body text
  relaxed: 1.75;    // Long-form content

  // Font weights
  normal: 400;      // Body text
  medium: 500;      // Emphasis
  semibold: 600;    // Subheadings
  bold: 700;        // Headings
};
```

**CSS Implementation**:
```css
:root {
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

**Validation Rules**:
- Minimum 16px font size for body text (mobile readability)
- Use 1.5 line height for body text (readability)
- Use font weight for hierarchy, not just size
- Maintain consistent scale across all components

**Usage Examples**:
- Task title: `text-lg font-semibold leading-tight`
- Task description: `text-base font-normal leading-normal`
- Metadata: `text-sm text-muted-foreground leading-normal`
- Caption: `text-xs text-muted-foreground leading-tight`

---

### Shadow Scale (Elevation)

**Purpose**: Consistent elevation system for depth and hierarchy

**Properties**:
```typescript
type ShadowToken = {
  none: 'none';
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)';
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)';
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)';
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)';
};
```

**CSS Implementation**:
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.dark {
  /* Slightly stronger shadows in dark mode */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.3);
}
```

**Validation Rules**:
- Use shadows sparingly (avoid shadow overload)
- Increase shadow on hover for interactive elements (FR-017)
- Adjust shadow opacity for dark mode
- Use `shadow-md` as default for cards

**Usage Examples**:
- Card default: `shadow-md`
- Card hover: `hover:shadow-lg`
- Modal: `shadow-xl`
- Button: `shadow-sm`

---

### Border Radius Scale

**Purpose**: Consistent corner rounding across components

**Properties**:
```typescript
type BorderRadiusToken = {
  none: '0';
  sm: '0.25rem';  // 4px  - Small elements (badges, tags)
  md: '0.5rem';   // 8px  - Medium elements (buttons, inputs)
  lg: '0.75rem';  // 12px - Large elements (cards, modals)
  full: '9999px'; // Fully rounded (pills, avatars)
};
```

**CSS Implementation**:
```css
:root {
  --radius: 0.5rem; /* Base radius (8px) */
}
```

**Validation Rules**:
- Use consistent radius across similar components (FR-018)
- Small elements: 4px (badges, tags)
- Medium elements: 8px (buttons, inputs)
- Large elements: 12px (cards, modals)

**Usage Examples**:
- Badge: `rounded-sm` (4px)
- Button: `rounded-md` (8px)
- Card: `rounded-lg` (12px)
- Avatar: `rounded-full`

---

## Entity 2: Animation Presets

Animation presets define reusable animation configurations for consistent motion throughout the application.

### Duration Presets

**Purpose**: Standardized animation durations for consistent timing

**Properties**:
```typescript
type AnimationDuration = {
  fast: '150ms';    // Immediate feedback (button press, checkbox)
  normal: '200ms';  // Standard transitions (hover, focus)
  slow: '300ms';    // Complex state changes (modal open, theme switch)
};
```

**CSS Implementation**:
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

**Validation Rules**:
- All animations must complete within 300ms (FR-003, SC-002)
- Use `fast` for immediate feedback
- Use `normal` for hover/focus states
- Use `slow` for complex transitions
- Respect `prefers-reduced-motion` (FR-012)

**Usage Examples**:
- Button press: `transition-transform duration-fast active:scale-95`
- Card hover: `transition-shadow duration-normal hover:shadow-lg`
- Modal open: `transition-all duration-slow`

---

### Easing Functions

**Purpose**: Natural motion curves for animations

**Properties**:
```typescript
type EasingFunction = {
  linear: 'linear';
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)';
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)';
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)';
};
```

**Validation Rules**:
- Use `ease-in-out` for most transitions (natural motion)
- Use `ease-out` for entrances (elements appearing)
- Use `ease-in` for exits (elements disappearing)
- Avoid `linear` except for continuous animations (spinners)

**Usage Examples**:
- Default: `ease-in-out`
- Fade in: `ease-out`
- Fade out: `ease-in`

---

### Animation Types

**Purpose**: Predefined animation patterns using Tailwind utilities

**Properties**:
```typescript
type AnimationType = {
  // Fade animations
  fadeIn: 'animate-in fade-in';
  fadeOut: 'animate-out fade-out';

  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top';
  slideInFromBottom: 'animate-in slide-in-from-bottom';
  slideInFromLeft: 'animate-in slide-in-from-left';
  slideInFromRight: 'animate-in slide-in-from-right';

  // Scale animations
  scaleIn: 'animate-in zoom-in';
  scaleOut: 'animate-out zoom-out';

  // Combined animations
  fadeInScale: 'animate-in fade-in zoom-in-95';
  fadeOutScale: 'animate-out fade-out zoom-out-95';
};
```

**Validation Rules**:
- Combine animations for richer effects (fade + scale)
- Use appropriate direction for context (modal from bottom on mobile)
- Keep animations subtle (95% scale, not 50%)
- Test on low-end devices (maintain 60fps)

**Usage Examples**:
- Task creation: `animate-in fade-in slide-in-from-bottom duration-normal`
- Task deletion: `animate-out fade-out slide-out-to-right duration-normal`
- Modal open: `animate-in fade-in zoom-in-95 duration-slow`
- Toast notification: `animate-in slide-in-from-right duration-normal`

---

## Entity 3: Component States

Component states define the visual appearance of interactive elements across different interaction states.

### Interactive Component States

**Purpose**: Consistent visual feedback for all interactive elements

**Properties**:
```typescript
type ComponentState = {
  default: {
    opacity: 1;
    scale: 1;
    shadow: 'shadow-md';
    border: 'border-border';
  };

  hover: {
    opacity: 1;
    scale: 1;
    shadow: 'shadow-lg';
    border: 'border-primary';
    cursor: 'pointer';
  };

  focus: {
    opacity: 1;
    scale: 1;
    shadow: 'shadow-md';
    border: 'border-primary';
    ring: 'ring-2 ring-primary/20';
  };

  active: {
    opacity: 1;
    scale: 0.95;
    shadow: 'shadow-sm';
    border: 'border-primary';
  };

  disabled: {
    opacity: 0.5;
    scale: 1;
    shadow: 'shadow-none';
    border: 'border-border';
    cursor: 'not-allowed';
  };

  loading: {
    opacity: 0.7;
    scale: 1;
    shadow: 'shadow-md';
    border: 'border-border';
    cursor: 'wait';
  };

  error: {
    opacity: 1;
    scale: 1;
    shadow: 'shadow-md';
    border: 'border-status-error';
    ring: 'ring-2 ring-status-error/20';
  };
};
```

**Validation Rules**:
- All interactive elements must have hover state (FR-004)
- All focusable elements must have visible focus indicator (FR-005)
- Disabled elements must have reduced opacity and not-allowed cursor
- Loading states must be visually distinct from default state
- Error states must use error color with sufficient contrast

**State Transitions**:
```typescript
type StateTransition = {
  from: ComponentState;
  to: ComponentState;
  duration: AnimationDuration;
  easing: EasingFunction;
};
```

**Usage Examples**:

**Button States**:
```tsx
<button className="
  // Default
  bg-primary text-primary-foreground shadow-md

  // Hover
  hover:shadow-lg

  // Focus
  focus:ring-2 focus:ring-primary/20

  // Active
  active:scale-95

  // Disabled
  disabled:opacity-50 disabled:cursor-not-allowed

  // Transitions
  transition-all duration-normal ease-in-out
">
```

**Card States**:
```tsx
<div className="
  // Default
  bg-card border border-border shadow-md rounded-lg

  // Hover
  hover:shadow-lg hover:border-primary/50

  // Transitions
  transition-all duration-normal ease-in-out
">
```

**Input States**:
```tsx
<input className="
  // Default
  border border-border bg-background

  // Focus
  focus:border-primary focus:ring-2 focus:ring-primary/20

  // Error
  data-[error]:border-status-error data-[error]:ring-2 data-[error]:ring-status-error/20

  // Disabled
  disabled:opacity-50 disabled:cursor-not-allowed

  // Transitions
  transition-all duration-fast ease-in-out
">
```

---

## Entity 4: Micro-interaction Patterns

Micro-interaction patterns define specific animation behaviors for common user interactions.

### Button Press Animation

**Purpose**: Provide tactile feedback for button clicks

**Implementation**:
```typescript
type ButtonPressAnimation = {
  trigger: 'active';
  transform: 'scale(0.95)';
  duration: '150ms';
  easing: 'ease-in-out';
};
```

**CSS Classes**: `transition-transform duration-fast active:scale-95`

---

### Card Hover Elevation

**Purpose**: Indicate interactivity and provide depth

**Implementation**:
```typescript
type CardHoverAnimation = {
  trigger: 'hover';
  shadow: 'shadow-lg';
  duration: '200ms';
  easing: 'ease-in-out';
};
```

**CSS Classes**: `transition-shadow duration-normal hover:shadow-lg`

---

### Tag Add/Remove Animation

**Purpose**: Smooth appearance/disappearance of tags

**Implementation**:
```typescript
type TagAnimation = {
  add: {
    animation: 'animate-in fade-in zoom-in-95';
    duration: '200ms';
  };
  remove: {
    animation: 'animate-out fade-out zoom-out-95';
    duration: '200ms';
  };
};
```

**CSS Classes**:
- Add: `animate-in fade-in zoom-in-95 duration-normal`
- Remove: `animate-out fade-out zoom-out-95 duration-normal`

---

### Modal Open/Close Animation

**Purpose**: Smooth modal transitions with backdrop fade

**Implementation**:
```typescript
type ModalAnimation = {
  open: {
    backdrop: 'animate-in fade-in';
    content: 'animate-in fade-in zoom-in-95 slide-in-from-bottom';
    duration: '300ms';
  };
  close: {
    backdrop: 'animate-out fade-out';
    content: 'animate-out fade-out zoom-out-95 slide-out-to-bottom';
    duration: '200ms';
  };
};
```

**CSS Classes**:
- Backdrop open: `animate-in fade-in duration-slow`
- Content open: `animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-slow`
- Backdrop close: `animate-out fade-out duration-normal`
- Content close: `animate-out fade-out zoom-out-95 slide-out-to-bottom-4 duration-normal`

---

### Toast Notification Animation

**Purpose**: Attention-grabbing entrance with auto-dismiss

**Implementation**:
```typescript
type ToastAnimation = {
  enter: {
    animation: 'animate-in slide-in-from-right fade-in';
    duration: '200ms';
  };
  exit: {
    animation: 'animate-out slide-out-to-right fade-out';
    duration: '200ms';
  };
};
```

**CSS Classes**:
- Enter: `animate-in slide-in-from-right fade-in duration-normal`
- Exit: `animate-out slide-out-to-right fade-out duration-normal`

---

## Validation Rules Summary

### Performance Constraints
- All animations must maintain 60fps (SC-003)
- Animation duration must not exceed 300ms (FR-003, SC-002)
- Use GPU-accelerated properties only (transform, opacity)
- Avoid animating width, height, top, left (causes reflow)

### Accessibility Constraints
- All text must meet 4.5:1 contrast ratio (FR-020, SC-004)
- All UI components must meet 3:1 contrast ratio (FR-020, SC-004)
- Respect `prefers-reduced-motion` setting (FR-012, SC-009)
- All interactive elements must have visible focus indicators (FR-005)

### Consistency Constraints
- Use design tokens for all spacing, colors, typography (FR-001, FR-002, FR-006)
- Use animation presets for all transitions (FR-003)
- Use component states for all interactive elements (FR-004, FR-005)
- Maintain consistent border radius across similar components (FR-018)

---

## Implementation Notes

### CSS Custom Properties Location
All design tokens are defined in `frontend/app/globals.css` with light and dark mode variants.

### Tailwind Configuration
Design tokens are referenced in `frontend/tailwind.config.ts` to enable utility class usage.

### TypeScript Definitions
Type definitions for design tokens and animation presets are in `frontend/lib/design-tokens.ts` and `frontend/lib/animations.ts`.

### Testing Strategy
- Visual regression tests for component states
- jest-axe tests for accessibility compliance
- Performance tests for animation frame rates
- Manual testing for `prefers-reduced-motion`

---

## Next Steps

1. Create TypeScript type definitions in `contracts/` directory
2. Implement CSS custom properties in `app/globals.css`
3. Update `tailwind.config.ts` to reference new tokens
4. Create utility functions in `lib/design-tokens.ts` and `lib/animations.ts`
5. Update components to use design tokens and animation presets
6. Write tests for all component states and animations
