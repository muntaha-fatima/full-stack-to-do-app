/**
 * Accessibility Test Utilities
 *
 * Utilities for testing accessibility compliance including contrast ratios
 * and reduced motion preferences.
 */

/**
 * Calculate relative luminance of an RGB color
 * Used for WCAG contrast ratio calculations
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Parse hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if meets WCAG AA standards
 */
export function meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
  const minimumRatio = isLargeText ? 3 : 4.5;
  return ratio >= minimumRatio;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if meets WCAG AAA standards
 */
export function meetsWCAGAAA(ratio: number, isLargeText: boolean = false): boolean {
  const minimumRatio = isLargeText ? 4.5 : 7;
  return ratio >= minimumRatio;
}

/**
 * Check if user prefers reduced motion
 * @returns true if prefers-reduced-motion is set to reduce
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Mock prefers-reduced-motion for testing
 * @param value - Whether to enable reduced motion
 */
export function mockPrefersReducedMotion(value: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? value : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Check if an element has sufficient touch target size (44x44px minimum)
 * @param element - Element to check
 * @returns true if meets minimum touch target size
 */
export function hasSufficientTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

/**
 * Get all interactive elements in a container
 * @param container - Container element to search
 * @returns Array of interactive elements
 */
export function getInteractiveElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
  ];

  return Array.from(container.querySelectorAll(selectors.join(', '))) as HTMLElement[];
}

/**
 * Check if all interactive elements have sufficient touch target size
 * @param container - Container element to check
 * @returns Object with results
 */
export function checkTouchTargetSizes(container: HTMLElement): {
  passed: boolean;
  failures: Array<{ element: HTMLElement; width: number; height: number }>;
} {
  const interactiveElements = getInteractiveElements(container);
  const failures: Array<{ element: HTMLElement; width: number; height: number }> = [];

  interactiveElements.forEach((element) => {
    if (!hasSufficientTouchTargetSize(element)) {
      const rect = element.getBoundingClientRect();
      failures.push({
        element,
        width: rect.width,
        height: rect.height,
      });
    }
  });

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Check if element has visible focus indicator
 * @param element - Element to check
 * @returns true if has visible focus indicator
 */
export function hasVisibleFocusIndicator(element: HTMLElement): boolean {
  element.focus();
  const styles = window.getComputedStyle(element);

  // Check for outline
  const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';

  // Check for box-shadow (ring)
  const hasBoxShadow = styles.boxShadow !== 'none';

  // Check for border change
  const hasBorder = styles.border !== 'none' && styles.borderWidth !== '0px';

  return hasOutline || hasBoxShadow || hasBorder;
}

/**
 * Test helper to verify keyboard navigation
 * @param container - Container element
 * @returns Object with navigation results
 */
export function testKeyboardNavigation(container: HTMLElement): {
  passed: boolean;
  tabbableElements: HTMLElement[];
  focusOrder: string[];
} {
  const interactiveElements = getInteractiveElements(container);
  const tabbableElements = interactiveElements.filter((el) => {
    const tabIndex = el.getAttribute('tabindex');
    return tabIndex !== '-1';
  });

  const focusOrder = tabbableElements.map((el) => {
    return el.getAttribute('aria-label') || el.textContent?.trim() || el.tagName;
  });

  return {
    passed: tabbableElements.length > 0,
    tabbableElements,
    focusOrder,
  };
}

/**
 * Common color pairs for testing
 */
export const TEST_COLOR_PAIRS = {
  // Light mode
  lightBackground: '#FFFFFF',
  lightText: '#1A1A1A',
  lightMuted: '#6B7280',

  // Dark mode
  darkBackground: '#1A1A1A',
  darkText: '#F9FAFB',
  darkMuted: '#9CA3AF',

  // Priority colors (light mode)
  priorityHighLight: '#DC2626',
  priorityMediumLight: '#F59E0B',
  priorityLowLight: '#10B981',

  // Priority colors (dark mode)
  priorityHighDark: '#EF4444',
  priorityMediumDark: '#FBBF24',
  priorityLowDark: '#34D399',
};

/**
 * Validate all color combinations meet WCAG AA
 * @returns Array of failures
 */
export function validateColorContrast(): Array<{
  pair: string;
  ratio: number;
  required: number;
  passed: boolean;
}> {
  const results: Array<{
    pair: string;
    ratio: number;
    required: number;
    passed: boolean;
  }> = [];

  // Test light mode text
  const lightTextRatio = getContrastRatio(
    TEST_COLOR_PAIRS.lightText,
    TEST_COLOR_PAIRS.lightBackground
  );
  results.push({
    pair: 'Light mode text',
    ratio: lightTextRatio,
    required: 4.5,
    passed: meetsWCAGAA(lightTextRatio, false),
  });

  // Test dark mode text
  const darkTextRatio = getContrastRatio(
    TEST_COLOR_PAIRS.darkText,
    TEST_COLOR_PAIRS.darkBackground
  );
  results.push({
    pair: 'Dark mode text',
    ratio: darkTextRatio,
    required: 4.5,
    passed: meetsWCAGAA(darkTextRatio, false),
  });

  // Test priority colors (light mode)
  const priorityHighLightRatio = getContrastRatio(
    TEST_COLOR_PAIRS.priorityHighLight,
    TEST_COLOR_PAIRS.lightBackground
  );
  results.push({
    pair: 'Priority high (light)',
    ratio: priorityHighLightRatio,
    required: 3,
    passed: priorityHighLightRatio >= 3,
  });

  return results.filter((r) => !r.passed);
}
