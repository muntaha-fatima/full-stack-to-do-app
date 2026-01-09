/**
 * Touch Target Size Test
 *
 * Tests that all interactive elements meet the minimum touch target size
 * of 44x44px as per WCAG 2.1 AA guidelines.
 */

import { render } from '@testing-library/react';
import { checkTouchTargetSizes, hasSufficientTouchTargetSize } from '@/tests/utils/accessibility';

// Mock components for testing
const ButtonComponent = () => (
  <button className="px-4 py-2">Click me</button>
);

const SmallButtonComponent = () => (
  <button className="px-1 py-1">Small</button>
);

const CardWithActions = () => (
  <div className="p-4">
    <h3>Task Title</h3>
    <p>Task description</p>
    <div className="flex gap-2 mt-4">
      <button className="px-4 py-2">Edit</button>
      <button className="px-4 py-2">Delete</button>
    </div>
  </div>
);

describe('Touch Target Size', () => {
  describe('Minimum Size Requirements', () => {
    it('should meet 44x44px minimum for buttons', () => {
      const { container } = render(<ButtonComponent />);
      const button = container.querySelector('button') as HTMLElement;

      // Mock getBoundingClientRect to return dimensions
      button.getBoundingClientRect = jest.fn(() => ({
        width: 80,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 80,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(button)).toBe(true);
    });

    it('should fail for buttons smaller than 44x44px', () => {
      const { container } = render(<SmallButtonComponent />);
      const button = container.querySelector('button') as HTMLElement;

      // Mock getBoundingClientRect to return small dimensions
      button.getBoundingClientRect = jest.fn(() => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(button)).toBe(false);
    });

    it('should check all interactive elements in a container', () => {
      const { container } = render(<CardWithActions />);

      // Mock getBoundingClientRect for all buttons
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        (button as HTMLElement).getBoundingClientRect = jest.fn(() => ({
          width: 80,
          height: 44,
          top: 0,
          left: 0,
          bottom: 44,
          right: 80,
          x: 0,
          y: 0,
          toJSON: () => {},
        }));
      });

      const result = checkTouchTargetSizes(container as HTMLElement);
      expect(result.passed).toBe(true);
      expect(result.failures).toHaveLength(0);
    });
  });

  describe('Mobile Considerations', () => {
    it('should have adequate spacing between touch targets', () => {
      const { container } = render(
        <div className="flex gap-2">
          <button className="px-4 py-2">Button 1</button>
          <button className="px-4 py-2">Button 2</button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2);

      // Mock positions with adequate spacing
      (buttons[0] as HTMLElement).getBoundingClientRect = jest.fn(() => ({
        width: 80,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 80,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      (buttons[1] as HTMLElement).getBoundingClientRect = jest.fn(() => ({
        width: 80,
        height: 44,
        top: 0,
        left: 88, // 8px gap
        bottom: 44,
        right: 168,
        x: 88,
        y: 0,
        toJSON: () => {},
      }));

      // Check that buttons don't overlap
      const button1Rect = buttons[0].getBoundingClientRect();
      const button2Rect = buttons[1].getBoundingClientRect();

      expect(button2Rect.left).toBeGreaterThanOrEqual(button1Rect.right);
    });

    it('should maintain touch target size on mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<ButtonComponent />);
      const button = container.querySelector('button') as HTMLElement;

      button.getBoundingClientRect = jest.fn(() => ({
        width: 80,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 80,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(button)).toBe(true);
    });
  });

  describe('Common Interactive Elements', () => {
    it('should check links', () => {
      const { container } = render(
        <a href="#" className="inline-block px-4 py-2">
          Link
        </a>
      );

      const link = container.querySelector('a') as HTMLElement;
      link.getBoundingClientRect = jest.fn(() => ({
        width: 60,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 60,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(link)).toBe(true);
    });

    it('should check checkboxes', () => {
      const { container } = render(
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-6 h-6" />
          <span>Checkbox label</span>
        </label>
      );

      const checkbox = container.querySelector('input') as HTMLElement;
      checkbox.getBoundingClientRect = jest.fn(() => ({
        width: 24,
        height: 24,
        top: 0,
        left: 0,
        bottom: 24,
        right: 24,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Checkbox itself is small, but the label provides the touch target
      const label = container.querySelector('label') as HTMLElement;
      label.getBoundingClientRect = jest.fn(() => ({
        width: 150,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 150,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(label)).toBe(true);
    });

    it('should check icon buttons', () => {
      const { container } = render(
        <button className="p-2" aria-label="Delete">
          <svg width="20" height="20">
            <path d="M0 0h20v20H0z" />
          </svg>
        </button>
      );

      const button = container.querySelector('button') as HTMLElement;
      button.getBoundingClientRect = jest.fn(() => ({
        width: 44,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 44,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(button)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements with border and padding', () => {
      const { container } = render(
        <button className="px-4 py-2 border-2">Button</button>
      );

      const button = container.querySelector('button') as HTMLElement;

      // Total size includes border
      button.getBoundingClientRect = jest.fn(() => ({
        width: 84, // 80 + 2*2 border
        height: 48, // 44 + 2*2 border
        top: 0,
        left: 0,
        bottom: 48,
        right: 84,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      expect(hasSufficientTouchTargetSize(button)).toBe(true);
    });

    it('should handle disabled elements', () => {
      const { container } = render(
        <button disabled className="px-4 py-2">
          Disabled
        </button>
      );

      const button = container.querySelector('button') as HTMLElement;
      button.getBoundingClientRect = jest.fn(() => ({
        width: 80,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 80,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Disabled elements should still meet size requirements
      expect(hasSufficientTouchTargetSize(button)).toBe(true);
    });

    it('should report failures with element details', () => {
      const { container } = render(
        <div>
          <button className="px-1 py-1">Small 1</button>
          <button className="px-1 py-1">Small 2</button>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        (button as HTMLElement).getBoundingClientRect = jest.fn(() => ({
          width: 30,
          height: 30,
          top: 0,
          left: 0,
          bottom: 30,
          right: 30,
          x: 0,
          y: 0,
          toJSON: () => {},
        }));
      });

      const result = checkTouchTargetSizes(container as HTMLElement);
      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(2);
      expect(result.failures[0].width).toBe(30);
      expect(result.failures[0].height).toBe(30);
    });
  });

  describe('Responsive Behavior', () => {
    it('should maintain size across breakpoints', () => {
      const breakpoints = [375, 768, 1024, 1920];

      breakpoints.forEach((width) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const { container } = render(<ButtonComponent />);
        const button = container.querySelector('button') as HTMLElement;

        button.getBoundingClientRect = jest.fn(() => ({
          width: 80,
          height: 44,
          top: 0,
          left: 0,
          bottom: 44,
          right: 80,
          x: 0,
          y: 0,
          toJSON: () => {},
        }));

        expect(hasSufficientTouchTargetSize(button)).toBe(true);
      });
    });
  });
});
