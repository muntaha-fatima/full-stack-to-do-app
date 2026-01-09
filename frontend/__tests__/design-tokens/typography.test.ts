/**
 * Typography Hierarchy Test
 *
 * Tests that typography presets are properly defined and consistently applied
 * across the application with appropriate line heights and font weights.
 */

import { TYPOGRAPHY_PRESETS } from '@/lib/design-tokens';

describe('Typography Hierarchy', () => {
  describe('Typography Presets', () => {
    it('should have all typography presets defined', () => {
      expect(TYPOGRAPHY_PRESETS).toHaveProperty('heading');
      expect(TYPOGRAPHY_PRESETS).toHaveProperty('body');
      expect(TYPOGRAPHY_PRESETS).toHaveProperty('caption');
    });

    it('should use appropriate line heights', () => {
      expect(TYPOGRAPHY_PRESETS.heading.lineHeight).toBe('1.25'); // tight
      expect(TYPOGRAPHY_PRESETS.body.lineHeight).toBe('1.5'); // normal
      expect(TYPOGRAPHY_PRESETS.caption.lineHeight).toBe('1.25'); // tight
    });

    it('should use appropriate font weights', () => {
      expect(TYPOGRAPHY_PRESETS.heading.fontWeight).toBe('600'); // semibold
      expect(TYPOGRAPHY_PRESETS.body.fontWeight).toBe('400'); // normal
      expect(TYPOGRAPHY_PRESETS.caption.fontWeight).toBe('400'); // normal
    });

    it('should use appropriate font sizes', () => {
      expect(TYPOGRAPHY_PRESETS.heading.fontSize).toBe('1.125rem'); // 18px
      expect(TYPOGRAPHY_PRESETS.body.fontSize).toBe('1rem'); // 16px
      expect(TYPOGRAPHY_PRESETS.caption.fontSize).toBe('0.875rem'); // 14px
    });
  });

  describe('CSS Variables', () => {
    it('should have line height CSS variables defined', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--leading-tight')).toBeTruthy();
      expect(styles.getPropertyValue('--leading-normal')).toBeTruthy();
      expect(styles.getPropertyValue('--leading-relaxed')).toBeTruthy();
    });

    it('should have correct line height values', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--leading-tight').trim()).toBe('1.25');
      expect(styles.getPropertyValue('--leading-normal').trim()).toBe('1.5');
      expect(styles.getPropertyValue('--leading-relaxed').trim()).toBe('1.75');
    });
  });

  describe('Heading Styles', () => {
    it('should apply heading styles correctly', () => {
      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold leading-tight';
      heading.textContent = 'Heading Text';
      document.body.appendChild(heading);

      const styles = window.getComputedStyle(heading);

      // Font size should be larger than body text
      const fontSize = parseFloat(styles.fontSize);
      expect(fontSize).toBeGreaterThan(16);

      // Font weight should be semibold or bold
      const fontWeight = parseInt(styles.fontWeight);
      expect(fontWeight).toBeGreaterThanOrEqual(600);

      document.body.removeChild(heading);
    });

    it('should use tight line height for headings', () => {
      const heading = document.createElement('h3');
      heading.className = 'leading-tight';
      document.body.appendChild(heading);

      const styles = window.getComputedStyle(heading);
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const ratio = lineHeight / fontSize;

      // Should be approximately 1.25
      expect(ratio).toBeCloseTo(1.25, 1);

      document.body.removeChild(heading);
    });
  });

  describe('Body Text Styles', () => {
    it('should apply body text styles correctly', () => {
      const paragraph = document.createElement('p');
      paragraph.className = 'text-base leading-normal';
      paragraph.textContent = 'Body text';
      document.body.appendChild(paragraph);

      const styles = window.getComputedStyle(paragraph);

      // Font size should be base (16px)
      const fontSize = parseFloat(styles.fontSize);
      expect(fontSize).toBe(16);

      document.body.removeChild(paragraph);
    });

    it('should use normal line height for body text', () => {
      const paragraph = document.createElement('p');
      paragraph.className = 'leading-normal';
      document.body.appendChild(paragraph);

      const styles = window.getComputedStyle(paragraph);
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const ratio = lineHeight / fontSize;

      // Should be approximately 1.5
      expect(ratio).toBeCloseTo(1.5, 1);

      document.body.removeChild(paragraph);
    });
  });

  describe('Caption/Metadata Styles', () => {
    it('should apply caption styles correctly', () => {
      const caption = document.createElement('span');
      caption.className = 'text-sm text-muted-foreground';
      caption.textContent = 'Caption text';
      document.body.appendChild(caption);

      const styles = window.getComputedStyle(caption);

      // Font size should be smaller than body text
      const fontSize = parseFloat(styles.fontSize);
      expect(fontSize).toBeLessThan(16);

      document.body.removeChild(caption);
    });

    it('should use tight line height for captions', () => {
      const caption = document.createElement('span');
      caption.className = 'text-sm leading-tight';
      document.body.appendChild(caption);

      const styles = window.getComputedStyle(caption);
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const ratio = lineHeight / fontSize;

      // Should be approximately 1.25
      expect(ratio).toBeCloseTo(1.25, 1);

      document.body.removeChild(caption);
    });
  });

  describe('Typography Hierarchy Consistency', () => {
    it('should maintain clear size hierarchy', () => {
      const heading = document.createElement('h3');
      heading.className = 'text-lg';
      const body = document.createElement('p');
      body.className = 'text-base';
      const caption = document.createElement('span');
      caption.className = 'text-sm';

      document.body.appendChild(heading);
      document.body.appendChild(body);
      document.body.appendChild(caption);

      const headingSize = parseFloat(window.getComputedStyle(heading).fontSize);
      const bodySize = parseFloat(window.getComputedStyle(body).fontSize);
      const captionSize = parseFloat(window.getComputedStyle(caption).fontSize);

      expect(headingSize).toBeGreaterThan(bodySize);
      expect(bodySize).toBeGreaterThan(captionSize);

      document.body.removeChild(heading);
      document.body.removeChild(body);
      document.body.removeChild(caption);
    });

    it('should maintain clear weight hierarchy', () => {
      const heading = document.createElement('h3');
      heading.className = 'font-semibold';
      const body = document.createElement('p');
      body.className = 'font-normal';

      document.body.appendChild(heading);
      document.body.appendChild(body);

      const headingWeight = parseInt(window.getComputedStyle(heading).fontWeight);
      const bodyWeight = parseInt(window.getComputedStyle(body).fontWeight);

      expect(headingWeight).toBeGreaterThan(bodyWeight);

      document.body.removeChild(heading);
      document.body.removeChild(body);
    });
  });

  describe('Responsive Typography', () => {
    it('should maintain readability at different viewport sizes', () => {
      const viewports = [375, 768, 1024, 1920];

      viewports.forEach((width) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const paragraph = document.createElement('p');
        paragraph.className = 'text-base';
        document.body.appendChild(paragraph);

        const fontSize = parseFloat(window.getComputedStyle(paragraph).fontSize);

        // Font size should be at least 14px for readability
        expect(fontSize).toBeGreaterThanOrEqual(14);

        document.body.removeChild(paragraph);
      });
    });
  });
});
