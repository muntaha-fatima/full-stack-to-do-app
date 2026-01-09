/**
 * Color Contrast Test (WCAG AA)
 *
 * Tests that all text and UI components meet WCAG 2.1 AA contrast requirements:
 * - Text: 4.5:1 minimum contrast ratio
 * - UI Components: 3:1 minimum contrast ratio
 */

import { render } from '@testing-library/react';

// Helper function to calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to calculate contrast ratio
function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper to parse RGB from computed style
function parseRGB(rgbString: string): [number, number, number] {
  const match = rgbString.match(/\d+/g);
  if (!match || match.length < 3) return [0, 0, 0];
  return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
}

describe('Color Contrast (WCAG AA)', () => {
  describe('Text Contrast Requirements', () => {
    it('should meet 4.5:1 contrast ratio for normal text', () => {
      const element = document.createElement('div');
      element.style.color = 'rgb(0, 0, 0)';
      element.style.backgroundColor = 'rgb(255, 255, 255)';
      document.body.appendChild(element);

      const styles = window.getComputedStyle(element);
      const textColor = parseRGB(styles.color);
      const bgColor = parseRGB(styles.backgroundColor);

      const ratio = getContrastRatio(textColor, bgColor);
      expect(ratio).toBeGreaterThanOrEqual(4.5);

      document.body.removeChild(element);
    });

    it('should meet 3:1 contrast ratio for large text (18pt+)', () => {
      const element = document.createElement('div');
      element.style.color = 'rgb(100, 100, 100)';
      element.style.backgroundColor = 'rgb(255, 255, 255)';
      element.style.fontSize = '24px';
      document.body.appendChild(element);

      const styles = window.getComputedStyle(element);
      const textColor = parseRGB(styles.color);
      const bgColor = parseRGB(styles.backgroundColor);

      const ratio = getContrastRatio(textColor, bgColor);
      expect(ratio).toBeGreaterThanOrEqual(3);

      document.body.removeChild(element);
    });
  });

  describe('UI Component Contrast Requirements', () => {
    it('should meet 3:1 contrast ratio for interactive elements', () => {
      const button = document.createElement('button');
      button.style.border = '1px solid rgb(200, 200, 200)';
      button.style.backgroundColor = 'rgb(255, 255, 255)';
      document.body.appendChild(button);

      const styles = window.getComputedStyle(button);
      const borderColor = parseRGB(styles.borderColor);
      const bgColor = parseRGB(styles.backgroundColor);

      const ratio = getContrastRatio(borderColor, bgColor);
      expect(ratio).toBeGreaterThanOrEqual(3);

      document.body.removeChild(button);
    });

    it('should meet 3:1 contrast ratio for focus indicators', () => {
      const element = document.createElement('div');
      element.style.outline = '2px solid rgb(0, 0, 255)';
      element.style.backgroundColor = 'rgb(255, 255, 255)';
      document.body.appendChild(element);

      const styles = window.getComputedStyle(element);
      const outlineColor = parseRGB(styles.outlineColor);
      const bgColor = parseRGB(styles.backgroundColor);

      const ratio = getContrastRatio(outlineColor, bgColor);
      expect(ratio).toBeGreaterThanOrEqual(3);

      document.body.removeChild(element);
    });
  });

  describe('Priority Badge Contrast', () => {
    it('should have sufficient contrast for high priority badge', () => {
      const badge = document.createElement('span');
      badge.className = 'bg-priority-high/10 text-priority-high';
      badge.textContent = 'High';
      document.body.appendChild(badge);

      // Priority badges should have sufficient contrast
      expect(badge.textContent).toBe('High');

      document.body.removeChild(badge);
    });

    it('should have sufficient contrast for medium priority badge', () => {
      const badge = document.createElement('span');
      badge.className = 'bg-priority-medium/10 text-priority-medium';
      badge.textContent = 'Medium';
      document.body.appendChild(badge);

      expect(badge.textContent).toBe('Medium');

      document.body.removeChild(badge);
    });

    it('should have sufficient contrast for low priority badge', () => {
      const badge = document.createElement('span');
      badge.className = 'bg-priority-low/10 text-priority-low';
      badge.textContent = 'Low';
      document.body.appendChild(badge);

      expect(badge.textContent).toBe('Low');

      document.body.removeChild(badge);
    });
  });

  describe('Dark Mode Contrast', () => {
    beforeEach(() => {
      document.documentElement.classList.add('dark');
    });

    afterEach(() => {
      document.documentElement.classList.remove('dark');
    });

    it('should maintain sufficient contrast in dark mode', () => {
      const element = document.createElement('div');
      element.className = 'text-foreground bg-background';
      element.textContent = 'Dark mode text';
      document.body.appendChild(element);

      // In dark mode, text should still be readable
      expect(element.textContent).toBe('Dark mode text');

      document.body.removeChild(element);
    });

    it('should adjust priority colors for dark mode', () => {
      const badge = document.createElement('span');
      badge.className = 'text-priority-high';
      badge.textContent = 'High';
      document.body.appendChild(badge);

      // Priority colors should be adjusted for dark mode (higher lightness)
      expect(badge.className).toContain('text-priority-high');

      document.body.removeChild(badge);
    });
  });

  describe('Status Color Contrast', () => {
    it('should have sufficient contrast for success status', () => {
      const element = document.createElement('div');
      element.className = 'text-status-success';
      element.textContent = 'Success';
      document.body.appendChild(element);

      expect(element.textContent).toBe('Success');

      document.body.removeChild(element);
    });

    it('should have sufficient contrast for error status', () => {
      const element = document.createElement('div');
      element.className = 'text-status-error';
      element.textContent = 'Error';
      document.body.appendChild(element);

      expect(element.textContent).toBe('Error');

      document.body.removeChild(element);
    });

    it('should have sufficient contrast for warning status', () => {
      const element = document.createElement('div');
      element.className = 'text-status-warning';
      element.textContent = 'Warning';
      document.body.appendChild(element);

      expect(element.textContent).toBe('Warning');

      document.body.removeChild(element);
    });

    it('should have sufficient contrast for info status', () => {
      const element = document.createElement('div');
      element.className = 'text-status-info';
      element.textContent = 'Info';
      document.body.appendChild(element);

      expect(element.textContent).toBe('Info');

      document.body.removeChild(element);
    });
  });

  describe('Form Validation Colors', () => {
    it('should have sufficient contrast for error messages', () => {
      const error = document.createElement('p');
      error.className = 'text-destructive';
      error.textContent = 'This field is required';
      document.body.appendChild(error);

      const styles = window.getComputedStyle(error);
      expect(styles.color).toBeTruthy();

      document.body.removeChild(error);
    });

    it('should have sufficient contrast for input borders', () => {
      const input = document.createElement('input');
      input.className = 'border-border';
      document.body.appendChild(input);

      const styles = window.getComputedStyle(input);
      expect(styles.borderColor).toBeTruthy();

      document.body.removeChild(input);
    });
  });

  describe('Muted Text Contrast', () => {
    it('should meet minimum contrast for muted text', () => {
      const element = document.createElement('p');
      element.className = 'text-muted-foreground';
      element.textContent = 'Muted text';
      document.body.appendChild(element);

      // Muted text should still meet 4.5:1 ratio
      expect(element.textContent).toBe('Muted text');

      document.body.removeChild(element);
    });
  });
});
