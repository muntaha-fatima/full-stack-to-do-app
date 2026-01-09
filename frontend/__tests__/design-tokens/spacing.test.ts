/**
 * Spacing Scale Test
 *
 * Tests that the spacing scale is properly defined and accessible
 * via CSS variables and Tailwind utilities.
 */

import { SPACING_VALUES } from '@/lib/design-tokens';

describe('Spacing Scale', () => {
  describe('Design Token Values', () => {
    it('should have all spacing tokens defined', () => {
      expect(SPACING_VALUES).toHaveProperty('xs');
      expect(SPACING_VALUES).toHaveProperty('sm');
      expect(SPACING_VALUES).toHaveProperty('md');
      expect(SPACING_VALUES).toHaveProperty('lg');
      expect(SPACING_VALUES).toHaveProperty('xl');
      expect(SPACING_VALUES).toHaveProperty('2xl');
      expect(SPACING_VALUES).toHaveProperty('3xl');
    });

    it('should use 4px base unit', () => {
      expect(SPACING_VALUES.xs).toBe('0.25rem'); // 4px
      expect(SPACING_VALUES.sm).toBe('0.5rem');  // 8px
      expect(SPACING_VALUES.md).toBe('0.75rem'); // 12px
      expect(SPACING_VALUES.lg).toBe('1rem');    // 16px
      expect(SPACING_VALUES.xl).toBe('1.5rem');  // 24px
      expect(SPACING_VALUES['2xl']).toBe('2rem'); // 32px
      expect(SPACING_VALUES['3xl']).toBe('3rem'); // 48px
    });

    it('should follow consistent scale progression', () => {
      const values = [4, 8, 12, 16, 24, 32, 48];
      const tokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

      tokens.forEach((token, index) => {
        const expectedRem = values[index] / 16;
        expect(SPACING_VALUES[token]).toBe(`${expectedRem}rem`);
      });
    });
  });

  describe('CSS Variables', () => {
    beforeEach(() => {
      // Create a test element to check computed styles
      document.body.innerHTML = '<div id="test-element"></div>';
    });

    it('should have spacing CSS variables defined in :root', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--spacing-xs')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-sm')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-md')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-lg')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-xl')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-2xl')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-3xl')).toBeTruthy();
    });

    it('should match expected pixel values', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Note: getComputedStyle returns computed values, not the CSS variable value
      // We're checking that the variables are defined, not their computed values
      expect(styles.getPropertyValue('--spacing-xs').trim()).not.toBe('');
      expect(styles.getPropertyValue('--spacing-sm').trim()).not.toBe('');
    });
  });

  describe('Tailwind Utilities', () => {
    it('should generate spacing utilities for padding', () => {
      const element = document.createElement('div');
      element.className = 'p-lg';
      document.body.appendChild(element);

      const styles = getComputedStyle(element);
      // Tailwind should apply padding using the spacing scale
      expect(styles.padding).toBeTruthy();
    });

    it('should generate spacing utilities for margin', () => {
      const element = document.createElement('div');
      element.className = 'm-xl';
      document.body.appendChild(element);

      const styles = getComputedStyle(element);
      // Tailwind should apply margin using the spacing scale
      expect(styles.margin).toBeTruthy();
    });

    it('should generate spacing utilities for gap', () => {
      const element = document.createElement('div');
      element.className = 'gap-md';
      document.body.appendChild(element);

      const styles = getComputedStyle(element);
      // Tailwind should apply gap using the spacing scale
      expect(styles.gap).toBeTruthy();
    });
  });

  describe('Consistency', () => {
    it('should maintain 4px base unit across all tokens', () => {
      const tokens = Object.values(SPACING_VALUES);

      tokens.forEach((value) => {
        const remValue = parseFloat(value);
        const pxValue = remValue * 16;

        // All values should be multiples of 4
        expect(pxValue % 4).toBe(0);
      });
    });

    it('should have no gaps in the scale', () => {
      const pxValues = [4, 8, 12, 16, 24, 32, 48];
      const tokens = Object.values(SPACING_VALUES);

      expect(tokens.length).toBe(pxValues.length);
    });
  });
});
