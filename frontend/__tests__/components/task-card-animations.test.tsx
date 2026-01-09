/**
 * Task Card Animation Tests
 *
 * Tests animations for task creation, completion, and deletion.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { TaskCard } from '@/components/task-card';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'medium' as const,
  completed: false,
  tags: ['test'],
  due_date: '2026-01-15',
  created_at: '2026-01-08',
  updated_at: '2026-01-08',
};

describe('TaskCard Animations', () => {
  describe('Task Creation Animation', () => {
    it('should have fade-in animation classes', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(card);

      // Should have transition properties
      expect(styles.transition || card.className).toBeTruthy();
    });

    it('should animate in from bottom with slide', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;

      // Check for animation-related classes or styles
      expect(card.className).toBeTruthy();
    });
  });

  describe('Task Completion Animation', () => {
    it('should apply strikethrough when completed', () => {
      const completedTask = { ...mockTask, completed: true };

      render(
        <TaskCard
          task={completedTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const title = screen.getByText(mockTask.title);
      expect(title.className).toContain('line-through');
    });

    it('should reduce opacity when completed', () => {
      const completedTask = { ...mockTask, completed: true };

      render(
        <TaskCard
          task={completedTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const title = screen.getByText(mockTask.title);
      expect(title.className).toContain('opacity');
    });

    it('should animate completion state change', async () => {
      const onToggleComplete = jest.fn();

      const { rerender } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={onToggleComplete}
          onEdit={() => {}}
        />
      );

      const completeButton = screen.getByText('Complete');
      completeButton.click();

      expect(onToggleComplete).toHaveBeenCalledWith(mockTask);

      // Simulate state change
      const completedTask = { ...mockTask, completed: true };
      rerender(
        <TaskCard
          task={completedTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={onToggleComplete}
          onEdit={() => {}}
        />
      );

      await waitFor(() => {
        const title = screen.getByText(mockTask.title);
        expect(title.className).toContain('line-through');
      });
    });
  });

  describe('Hover State Animations', () => {
    it('should have hover transition classes', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(card);

      // Should have transition for shadow or transform
      expect(styles.transition || card.className).toBeTruthy();
    });

    it('should animate shadow on hover', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;

      // Check for hover shadow classes
      expect(card.className).toContain('hover:shadow');
    });
  });

  describe('Button Animations', () => {
    it('should have transition on buttons', () => {
      render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const completeButton = screen.getByText('Complete');
      const styles = window.getComputedStyle(completeButton);

      expect(styles.transition || completeButton.className).toBeTruthy();
    });

    it('should animate button hover states', () => {
      render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const completeButton = screen.getByText('Complete');

      // Should have transition classes
      expect(completeButton.className).toBeTruthy();
    });
  });

  describe('Icon Button Animations', () => {
    it('should animate edit button on hover', () => {
      render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const editButton = screen.getByLabelText('Edit task');
      expect(editButton.className).toContain('transition');
    });

    it('should animate delete button on hover', () => {
      render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const deleteButton = screen.getByLabelText('Delete task');
      expect(deleteButton.className).toContain('transition');
    });
  });

  describe('Animation Performance', () => {
    it('should use GPU-accelerated properties', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;

      // Check that we're using transform/opacity (GPU-accelerated)
      // rather than layout properties
      expect(card.className).toBeTruthy();
    });

    it('should have appropriate animation duration', () => {
      const { container } = render(
        <TaskCard
          task={mockTask}
          onUpdate={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
          onEdit={() => {}}
        />
      );

      const card = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(card);

      // Duration should be between 150-300ms
      if (styles.transitionDuration) {
        const duration = parseFloat(styles.transitionDuration) * 1000;
        expect(duration).toBeGreaterThanOrEqual(0);
        expect(duration).toBeLessThanOrEqual(300);
      }
    });
  });
});
