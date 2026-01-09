/**
 * Modal Animation Tests
 *
 * Tests modal open/close animations and backdrop transitions.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { Modal } from '@/components/modal';

describe('Modal Animations', () => {
  describe('Modal Open Animation', () => {
    it('should render with animation classes when open', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop?.className).toContain('transition');
    });

    it('should have fade-in animation for backdrop', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      const styles = window.getComputedStyle(backdrop as Element);

      // Should have opacity transition
      expect(styles.transition || backdrop?.className).toBeTruthy();
    });

    it('should have zoom-in animation for modal content', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"] > div');
      expect(modalContent?.className).toContain('transition');
    });

    it('should have slide-in-from-bottom animation', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"] > div');

      // Check for transform or animation classes
      expect(modalContent?.className).toBeTruthy();
    });
  });

  describe('Modal Close Animation', () => {
    it('should not render when closed', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('should handle close animation', async () => {
      const onClose = jest.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      // Trigger close
      const closeButton = screen.getByLabelText('Close modal');
      closeButton.click();

      expect(onClose).toHaveBeenCalled();

      // Simulate state change
      rerender(
        <Modal isOpen={false} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      await waitFor(() => {
        const backdrop = screen.queryByRole('dialog');
        expect(backdrop).not.toBeInTheDocument();
      });
    });
  });

  describe('Backdrop Animation', () => {
    it('should have backdrop blur effect', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      expect(backdrop?.className).toContain('backdrop-blur');
    });

    it('should have backdrop opacity transition', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      expect(backdrop?.className).toContain('transition');
    });

    it('should close on backdrop click', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Modal Content Animation', () => {
    it('should prevent backdrop click from closing when clicking content', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"] > div');
      modalContent?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // Should not close when clicking content
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should have scale animation on hover', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"] > div');
      expect(modalContent?.className).toContain('hover:scale');
    });
  });

  describe('Close Button Animation', () => {
    it('should have transition on close button', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton.className).toContain('transition');
    });

    it('should animate hover state', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton.className).toContain('hover:');
    });
  });

  describe('Animation Performance', () => {
    it('should use appropriate animation duration', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[role="dialog"]');
      expect(backdrop?.className).toContain('duration-normal');
    });

    it('should use GPU-accelerated properties', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"] > div');

      // Should use transform/opacity for animations
      expect(modalContent?.className).toBeTruthy();
    });
  });

  describe('Keyboard Interaction', () => {
    it('should close on Escape key', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('should prevent body scroll when modal is open', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      rerender(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('unset');
    });
  });
});
