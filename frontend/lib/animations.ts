/**
 * Animation Preset Type Definitions
 *
 * This file defines TypeScript types for animation presets and configurations.
 * These types ensure consistent animation behavior across all components.
 *
 * @see specs/002-frontend-ui-polish/data-model.md for detailed documentation
 */

// ============================================================================
// Animation Duration Tokens
// ============================================================================

/**
 * Animation duration tokens
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

export const ANIMATION_DURATION_VALUES: Record<AnimationDuration, string> = {
  fast: '150ms',    // Immediate feedback (button press, checkbox)
  normal: '200ms',  // Standard transitions (hover, focus)
  slow: '300ms',    // Complex state changes (modal open, theme switch)
} as const;

/**
 * Get Tailwind duration class
 */
export function getDurationClass(duration: AnimationDuration): string {
  const durationMap: Record<AnimationDuration, string> = {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300',
  };
  return durationMap[duration];
}

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Easing function tokens
 */
export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export const EASING_VALUES: Record<EasingFunction, string> = {
  linear: 'linear',
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Get Tailwind easing class
 */
export function getEasingClass(easing: EasingFunction): string {
  return `ease-${easing}`;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Fade animation types
 */
export type FadeAnimation = 'fade-in' | 'fade-out';

/**
 * Slide animation types
 */
export type SlideAnimation =
  | 'slide-in-from-top'
  | 'slide-in-from-bottom'
  | 'slide-in-from-left'
  | 'slide-in-from-right'
  | 'slide-out-to-top'
  | 'slide-out-to-bottom'
  | 'slide-out-to-left'
  | 'slide-out-to-right';

/**
 * Scale animation types
 */
export type ScaleAnimation = 'zoom-in' | 'zoom-out' | 'zoom-in-95' | 'zoom-out-95';

/**
 * All animation types
 */
export type AnimationType = FadeAnimation | SlideAnimation | ScaleAnimation;

// ============================================================================
// Animation Presets
// ============================================================================

/**
 * Animation configuration
 */
export interface AnimationConfig {
  type: AnimationType[];
  duration: AnimationDuration;
  easing: EasingFunction;
  delay?: number;
}

/**
 * Get Tailwind animation classes from config
 */
export function getAnimationClasses(config: AnimationConfig): string {
  const classes: string[] = [];

  // Determine if it's an entrance or exit animation
  const isEntrance = config.type.some((t) => t.includes('in'));
  classes.push(isEntrance ? 'animate-in' : 'animate-out');

  // Add animation types
  config.type.forEach((type) => {
    classes.push(type);
  });

  // Add duration
  classes.push(getDurationClass(config.duration));

  // Add easing (default to ease-in-out)
  if (config.easing !== 'ease-in-out') {
    classes.push(getEasingClass(config.easing));
  }

  // Add delay if specified
  if (config.delay) {
    classes.push(`delay-${config.delay}`);
  }

  return classes.join(' ');
}

// ============================================================================
// Component Animation Presets
// ============================================================================

/**
 * Button press animation preset
 */
export const BUTTON_PRESS_ANIMATION: AnimationConfig = {
  type: [],
  duration: 'fast',
  easing: 'ease-in-out',
};

/**
 * Get button press animation classes
 */
export function getButtonPressClasses(): string {
  return 'transition-transform duration-150 ease-in-out active:scale-95';
}

/**
 * Card hover animation preset
 */
export const CARD_HOVER_ANIMATION: AnimationConfig = {
  type: [],
  duration: 'normal',
  easing: 'ease-in-out',
};

/**
 * Get card hover animation classes
 */
export function getCardHoverClasses(): string {
  return 'transition-shadow duration-200 ease-in-out hover:shadow-lg';
}

/**
 * Tag add animation preset
 */
export const TAG_ADD_ANIMATION: AnimationConfig = {
  type: ['fade-in', 'zoom-in-95'],
  duration: 'normal',
  easing: 'ease-out',
};

/**
 * Get tag add animation classes
 */
export function getTagAddClasses(): string {
  return getAnimationClasses(TAG_ADD_ANIMATION);
}

/**
 * Tag remove animation preset
 */
export const TAG_REMOVE_ANIMATION: AnimationConfig = {
  type: ['fade-out', 'zoom-out-95'],
  duration: 'normal',
  easing: 'ease-in',
};

/**
 * Get tag remove animation classes
 */
export function getTagRemoveClasses(): string {
  return getAnimationClasses(TAG_REMOVE_ANIMATION);
}

/**
 * Modal open animation preset
 */
export const MODAL_OPEN_ANIMATION: AnimationConfig = {
  type: ['fade-in', 'zoom-in-95', 'slide-in-from-bottom'],
  duration: 'slow',
  easing: 'ease-out',
};

/**
 * Get modal open animation classes
 */
export function getModalOpenClasses(): string {
  return getAnimationClasses(MODAL_OPEN_ANIMATION);
}

/**
 * Modal close animation preset
 */
export const MODAL_CLOSE_ANIMATION: AnimationConfig = {
  type: ['fade-out', 'zoom-out-95', 'slide-out-to-bottom'],
  duration: 'normal',
  easing: 'ease-in',
};

/**
 * Get modal close animation classes
 */
export function getModalCloseClasses(): string {
  return getAnimationClasses(MODAL_CLOSE_ANIMATION);
}

/**
 * Modal backdrop animation preset
 */
export const MODAL_BACKDROP_ANIMATION: AnimationConfig = {
  type: ['fade-in'],
  duration: 'slow',
  easing: 'ease-out',
};

/**
 * Get modal backdrop animation classes
 */
export function getModalBackdropClasses(): string {
  return getAnimationClasses(MODAL_BACKDROP_ANIMATION);
}

/**
 * Toast enter animation preset
 */
export const TOAST_ENTER_ANIMATION: AnimationConfig = {
  type: ['fade-in', 'slide-in-from-right'],
  duration: 'normal',
  easing: 'ease-out',
};

/**
 * Get toast enter animation classes
 */
export function getToastEnterClasses(): string {
  return getAnimationClasses(TOAST_ENTER_ANIMATION);
}

/**
 * Toast exit animation preset
 */
export const TOAST_EXIT_ANIMATION: AnimationConfig = {
  type: ['fade-out', 'slide-out-to-right'],
  duration: 'normal',
  easing: 'ease-in',
};

/**
 * Get toast exit animation classes
 */
export function getToastExitClasses(): string {
  return getAnimationClasses(TOAST_EXIT_ANIMATION);
}

/**
 * Task creation animation preset
 */
export const TASK_CREATE_ANIMATION: AnimationConfig = {
  type: ['fade-in', 'slide-in-from-bottom'],
  duration: 'normal',
  easing: 'ease-out',
};

/**
 * Get task creation animation classes
 */
export function getTaskCreateClasses(): string {
  return getAnimationClasses(TASK_CREATE_ANIMATION);
}

/**
 * Task deletion animation preset
 */
export const TASK_DELETE_ANIMATION: AnimationConfig = {
  type: ['fade-out', 'slide-out-to-right'],
  duration: 'normal',
  easing: 'ease-in',
};

/**
 * Get task deletion animation classes
 */
export function getTaskDeleteClasses(): string {
  return getAnimationClasses(TASK_DELETE_ANIMATION);
}

// ============================================================================
// Component State Animations
// ============================================================================

/**
 * Component state for animations
 */
export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading' | 'error';

/**
 * Transition configuration for state changes
 */
export interface StateTransitionConfig {
  properties: string[];
  duration: AnimationDuration;
  easing: EasingFunction;
}

/**
 * Default state transition configuration
 */
export const DEFAULT_STATE_TRANSITION: StateTransitionConfig = {
  properties: ['all'],
  duration: 'normal',
  easing: 'ease-in-out',
};

/**
 * Get state transition classes
 */
export function getStateTransitionClasses(config: StateTransitionConfig = DEFAULT_STATE_TRANSITION): string {
  const property = config.properties.includes('all') ? 'all' : config.properties.join('-');
  return `transition-${property} ${getDurationClass(config.duration)} ${getEasingClass(config.easing)}`;
}

/**
 * Fast state transition (for immediate feedback)
 */
export const FAST_STATE_TRANSITION: StateTransitionConfig = {
  properties: ['all'],
  duration: 'fast',
  easing: 'ease-in-out',
};

/**
 * Slow state transition (for complex changes)
 */
export const SLOW_STATE_TRANSITION: StateTransitionConfig = {
  properties: ['all'],
  duration: 'slow',
  easing: 'ease-in-out',
};

// ============================================================================
// Accessibility: Reduced Motion
// ============================================================================

/**
 * Check if user prefers reduced motion
 * This should be used to conditionally apply animations
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation classes with reduced motion support
 * Returns empty string if user prefers reduced motion
 */
export function getAnimationClassesWithA11y(config: AnimationConfig): string {
  if (prefersReducedMotion()) {
    return '';
  }
  return getAnimationClasses(config);
}

/**
 * Tailwind class prefix for reduced motion
 * Use this to disable animations when user prefers reduced motion
 */
export const REDUCED_MOTION_PREFIX = 'motion-reduce:';

/**
 * Get animation classes with Tailwind reduced motion support
 * Adds motion-reduce: prefix to disable animations
 */
export function getAnimationClassesWithTailwindA11y(config: AnimationConfig): string {
  const classes = getAnimationClasses(config);
  const reducedMotionClasses = classes
    .split(' ')
    .map((cls) => `${REDUCED_MOTION_PREFIX}${cls}`)
    .join(' ');
  return `${classes} ${reducedMotionClasses}`;
}

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * Properties that can be animated with GPU acceleration
 */
export const GPU_ACCELERATED_PROPERTIES = ['transform', 'opacity'] as const;

/**
 * Properties that should be avoided for animation (cause reflow)
 */
export const REFLOW_PROPERTIES = ['width', 'height', 'top', 'left', 'margin', 'padding'] as const;

/**
 * Check if a property is GPU-accelerated
 */
export function isGPUAccelerated(property: string): boolean {
  return GPU_ACCELERATED_PROPERTIES.some((gpuProp) => gpuProp === property);
}

/**
 * Check if a property causes reflow
 */
export function causesReflow(property: string): boolean {
  return REFLOW_PROPERTIES.some((reflowProp) => reflowProp === property);
}

/**
 * Validate animation performance
 * Returns warnings if animation uses non-performant properties
 */
export function validateAnimationPerformance(properties: string[]): string[] {
  const warnings: string[] = [];

  properties.forEach((prop) => {
    if (causesReflow(prop)) {
      warnings.push(`Property "${prop}" causes reflow. Consider using transform instead.`);
    }
    if (!isGPUAccelerated(prop) && prop !== 'color' && prop !== 'background-color') {
      warnings.push(`Property "${prop}" is not GPU-accelerated. Consider using transform or opacity.`);
    }
  });

  return warnings;
}

// ============================================================================
// Animation Timing Validation
// ============================================================================

/**
 * Maximum animation duration (300ms per spec)
 */
export const MAX_ANIMATION_DURATION_MS = 300;

/**
 * Target frame rate (60fps per spec)
 */
export const TARGET_FPS = 60;

/**
 * Frame duration at 60fps (16.67ms)
 */
export const FRAME_DURATION_MS = 1000 / TARGET_FPS;

/**
 * Validate animation duration
 * Returns error if duration exceeds maximum
 */
export function validateAnimationDuration(durationMs: number): string | null {
  if (durationMs > MAX_ANIMATION_DURATION_MS) {
    return `Animation duration ${durationMs}ms exceeds maximum ${MAX_ANIMATION_DURATION_MS}ms`;
  }
  return null;
}

/**
 * Convert duration token to milliseconds
 */
export function durationToMs(duration: AnimationDuration): number {
  const durationMap: Record<AnimationDuration, number> = {
    fast: 150,
    normal: 200,
    slow: 300,
  };
  return durationMap[duration];
}
