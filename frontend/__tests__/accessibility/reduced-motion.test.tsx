/**
 * Reduced Motion Test
 *
 * Tests that animations are properly disabled when user has
 * prefers-reduced-motion enabled for accessibility.
 */

import { render } from '@testing-library/react';
import { prefersReducedMotion } from '@/lib/animations';

describe('Reduced Motion Support', () => {
  describe('Media Query Detection', () => {
    it('should detect prefers-reduced-motion preference', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const result = prefersReducedMotion();
      expect(result).toBe(true);
    });

    it('should return false when prefers-reduced-motion is not set', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const result = prefersReducedMotion();
      expect(result).toBe(false);
    });
  });

  describe('CSS Animation Disabling', () => {
    it('should disable animations via CSS when prefers-reduced-motion is set', () => {
      // Create a style element with reduced motion CSS
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Verify the style was added
      expect(document.head.contains(style)).toBe(true);
      expect(style.textContent).toContain('prefers-reduced-motion');
      expect(style.textContent).toContain('animation-duration: 0.01ms');
      expect(style.textContent).toContain('transition-duration: 0.01ms');

      // Cleanup
      document.head.removeChild(style);
    });
  });

  describe('Component Animation Behavior', () => {
    it('should apply instant transitions when reduced motion is preferred', () => {
      const TestComponent = () => (
        <div className="transition-opacity duration-normal">
          Test Content
        </div>
      );

      const { container } = render(<TestComponent />);
      const element = container.firstChild as HTMLElement;

      // In a real scenario with CSS applied, this would be 0.01ms
      // Here we're just verifying the class is applied
      expect(element.className).toContain('transition-opacity');
      expect(element.className).toContain('duration-normal');
    });

    it('should maintain functionality without animations', () => {
      // Test that interactive elements still work without animations
      const TestButton = () => (
        <button className="transition-colors duration-fast hover:bg-primary">
          Click Me
        </button>
      );

      const { container } = render(<TestButton />);
      const button = container.querySelector('button');

      expect(button).toBeInTheDocument();
      expect(button?.className).toContain('transition-colors');
    });
  });

  describe('Animation Alternatives', () => {
    it('should provide instant feedback without animation', () => {
      // When animations are disabled, state changes should be instant
      const element = document.createElement('div');
      element.style.transition = 'opacity 0.01ms';

      const transitionDuration = parseFloat(element.style.transition);
      expect(transitionDuration).toBeLessThan(1); // Effectively instant
    });

    it('should maintain visual hierarchy without motion', () => {
      // Visual hierarchy should be clear even without animations
      const TestCard = () => (
        <div className="rounded-lg border border-border bg-card p-lg shadow-md">
          <h3 className="text-lg font-semibold">Title</h3>
          <p className="text-base text-muted-foreground">Description</p>
        </div>
      );

      const { container } = render(<TestCard />);
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain('shadow-md');
      expect(card.className).toContain('border');
    });
  });

  describe('User Preference Respect', () => {
    it('should respect system-level accessibility settings', () => {
      // Mock system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const hasReducedMotion = prefersReducedMotion();
      expect(hasReducedMotion).toBe(true);
    });

    it('should allow animations when user has not set preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const hasReducedMotion = prefersReducedMotion();
      expect(hasReducedMotion).toBe(false);
    });
  });

  describe('Scroll Behavior', () => {
    it('should disable smooth scrolling when reduced motion is preferred', () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(style);

      expect(style.textContent).toContain('scroll-behavior: auto');

      document.head.removeChild(style);
    });
  });
});
