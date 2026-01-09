/**
 * Design Token Type Definitions
 *
 * This file defines TypeScript types for all design tokens used in the application.
 * These types ensure type safety when working with design tokens programmatically.
 *
 * @see specs/002-frontend-ui-polish/data-model.md for detailed documentation
 */

// ============================================================================
// Spacing Tokens
// ============================================================================

/**
 * Spacing scale based on 4px base unit
 * Maps to CSS custom properties in app/globals.css
 */
export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export const SPACING_VALUES: Record<SpacingToken, string> = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
} as const;

// ============================================================================
// Color Tokens
// ============================================================================

/**
 * Base color tokens (existing)
 */
export type BaseColorToken =
  | 'primary'
  | 'secondary'
  | 'background'
  | 'foreground'
  | 'muted'
  | 'muted-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground';

/**
 * Priority color tokens (new)
 */
export type PriorityColorToken = 'priority-high' | 'priority-medium' | 'priority-low';

/**
 * Status color tokens (new)
 */
export type StatusColorToken = 'status-success' | 'status-warning' | 'status-error' | 'status-info';

/**
 * All color tokens
 */
export type ColorToken = BaseColorToken | PriorityColorToken | StatusColorToken;

/**
 * Priority levels for tasks
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * Map priority to color token
 */
export const PRIORITY_COLOR_MAP: Record<Priority, PriorityColorToken> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
} as const;

/**
 * Status types for notifications and feedback
 */
export type Status = 'success' | 'warning' | 'error' | 'info';

/**
 * Map status to color token
 */
export const STATUS_COLOR_MAP: Record<Status, StatusColorToken> = {
  success: 'status-success',
  warning: 'status-warning',
  error: 'status-error',
  info: 'status-info',
} as const;

// ============================================================================
// Typography Tokens
// ============================================================================

/**
 * Font size tokens (using Tailwind defaults)
 */
export type FontSizeToken = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

export const FONT_SIZE_VALUES: Record<FontSizeToken, string> = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
} as const;

/**
 * Line height tokens
 */
export type LineHeightToken = 'tight' | 'normal' | 'relaxed';

export const LINE_HEIGHT_VALUES: Record<LineHeightToken, number> = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Font weight tokens
 */
export type FontWeightToken = 'normal' | 'medium' | 'semibold' | 'bold';

export const FONT_WEIGHT_VALUES: Record<FontWeightToken, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Typography preset for consistent text styling
 */
export interface TypographyPreset {
  fontSize: FontSizeToken;
  fontWeight: FontWeightToken;
  lineHeight: LineHeightToken;
}

/**
 * Common typography presets
 */
export const TYPOGRAPHY_PRESETS: Record<string, TypographyPreset> = {
  'heading-lg': { fontSize: 'xl', fontWeight: 'bold', lineHeight: 'tight' },
  'heading-md': { fontSize: 'lg', fontWeight: 'semibold', lineHeight: 'tight' },
  'heading-sm': { fontSize: 'base', fontWeight: 'semibold', lineHeight: 'tight' },
  'body-lg': { fontSize: 'lg', fontWeight: 'normal', lineHeight: 'normal' },
  'body': { fontSize: 'base', fontWeight: 'normal', lineHeight: 'normal' },
  'body-sm': { fontSize: 'sm', fontWeight: 'normal', lineHeight: 'normal' },
  'caption': { fontSize: 'xs', fontWeight: 'normal', lineHeight: 'tight' },
  'label': { fontSize: 'sm', fontWeight: 'medium', lineHeight: 'normal' },
} as const;

// ============================================================================
// Shadow Tokens (Elevation)
// ============================================================================

/**
 * Shadow tokens for elevation
 */
export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const SHADOW_VALUES: Record<ShadowToken, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// Border Radius Tokens
// ============================================================================

/**
 * Border radius tokens
 */
export type BorderRadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'full';

export const BORDER_RADIUS_VALUES: Record<BorderRadiusToken, string> = {
  none: '0',
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  full: '9999px',
} as const;

// ============================================================================
// Design Token Utilities
// ============================================================================

/**
 * Get CSS variable name for a color token
 */
export function getColorVariable(token: ColorToken): string {
  return `hsl(var(--${token}))`;
}

/**
 * Get CSS variable name for a spacing token
 */
export function getSpacingVariable(token: SpacingToken): string {
  return `var(--spacing-${token})`;
}

/**
 * Get Tailwind class for priority color
 */
export function getPriorityColorClass(priority: Priority): string {
  const colorToken = PRIORITY_COLOR_MAP[priority];
  return `text-${colorToken}`;
}

/**
 * Get Tailwind class for status color
 */
export function getStatusColorClass(status: Status): string {
  const colorToken = STATUS_COLOR_MAP[status];
  return `text-${colorToken}`;
}

/**
 * Get Tailwind classes for typography preset
 */
export function getTypographyClasses(preset: keyof typeof TYPOGRAPHY_PRESETS): string {
  const { fontSize, fontWeight, lineHeight } = TYPOGRAPHY_PRESETS[preset];
  return `text-${fontSize} font-${fontWeight} leading-${lineHeight}`;
}
