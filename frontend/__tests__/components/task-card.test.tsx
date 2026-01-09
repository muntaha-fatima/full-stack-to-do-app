/**
 * Visual Hierarchy Test for TaskCard
 *
 * Tests that TaskCard component has clear visual hierarchy with
 * proper spacing, typography, and visual weight.
 */

import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/task-card';

const mockTask = {
  id: '1',
  title: 'Test Task Title',
  description: 'This is a test task description with some content.',
  status: 'todo' as const,
  priority: 'high' as const,
  tags: ['urgent', 'important'],
  due_date: '2026-01-15',
  created_at: '2026-01-08',
  updated_at: '2026-01-08',
};

describe('TaskCard Visual Hierarchy', () => {
  describe('Typography Hierarchy', () => {
    it('should render title with larger font size than description', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const title = screen.getByText(mockTask.title);
      const description = screen.getByText(mockTask.description);

      const titleStyles = window.getComputedStyle(title);
      const descStyles = window.getComputedStyle(description);

      const titleSize = parseFloat(titleStyles.fontSize);
      const descSize = parseFloat(descStyles.fontSize);

      expect(titleSize).toBeGreaterThan(descSize);
    });

    it('should render title with bolder font weight than description', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const title = screen.getByText(mockTask.title);
      const description = screen.getByText(mockTask.description);

      const titleStyles = window.getComputedStyle(title);
      const descStyles = window.getComputedStyle(description);

      const titleWeight = parseInt(titleStyles.fontWeight);
      const descWeight = parseInt(descStyles.fontWeight);

      expect(titleWeight).toBeGreaterThanOrEqual(600); // semibold or bold
      expect(descWeight).toBeLessThanOrEqual(400); // normal
    });

    it('should render metadata with smaller font size than description', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const description = screen.getByText(mockTask.description);

      // Find metadata elements (priority badge, due date, etc.)
      const priorityBadge = screen.getByText(/high/i);

      const descStyles = window.getComputedStyle(description);
      const metadataStyles = window.getComputedStyle(priorityBadge);

      const descSize = parseFloat(descStyles.fontSize);
      const metadataSize = parseFloat(metadataStyles.fontSize);

      expect(metadataSize).toBeLessThanOrEqual(descSize);
    });
  });

  describe('Spacing Consistency', () => {
    it('should have consistent spacing between elements', () => {
      const { container } = render(
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />
      );

      const card = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(card);

      // Check that padding uses spacing scale
      const padding = styles.padding;
      expect(padding).toBeTruthy();

      // Padding should be from our spacing scale (multiples of 4px)
      const paddingValue = parseFloat(padding);
      expect(paddingValue % 4).toBe(0);
    });

    it('should have consistent gap between child elements', () => {
      const { container } = render(
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />
      );

      const card = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(card);

      // Check for gap or margin between elements
      const gap = styles.gap;
      if (gap && gap !== 'normal') {
        const gapValue = parseFloat(gap);
        expect(gapValue % 4).toBe(0);
      }
    });
  });

  describe('Visual Weight', () => {
    it('should make title visually prominent', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const title = screen.getByText(mockTask.title);
      const styles = window.getComputedStyle(title);

      // Title should be bold or semibold
      const fontWeight = parseInt(styles.fontWeight);
      expect(fontWeight).toBeGreaterThanOrEqual(600);

      // Title should have appropriate line height
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeightRatio = lineHeight / fontSize;

      // Should use tight line height (1.25) for headings
      expect(lineHeightRatio).toBeCloseTo(1.25, 1);
    });

    it('should make priority badge visually distinct', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const priorityBadge = screen.getByText(/high/i);
      const styles = window.getComputedStyle(priorityBadge);

      // Priority badge should have background color
      expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(styles.backgroundColor).not.toBe('transparent');

      // Priority badge should have padding
      expect(styles.padding).toBeTruthy();
    });
  });

  describe('Readability', () => {
    it('should use appropriate line height for description', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const description = screen.getByText(mockTask.description);
      const styles = window.getComputedStyle(description);

      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeightRatio = lineHeight / fontSize;

      // Should use normal line height (1.5) for body text
      expect(lineHeightRatio).toBeCloseTo(1.5, 1);
    });

    it('should have sufficient spacing for scanning', () => {
      const { container } = render(
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />
      );

      const card = container.firstChild as HTMLElement;
      const children = Array.from(card.children) as HTMLElement[];

      // Check spacing between major sections
      if (children.length > 1) {
        children.forEach((child) => {
          const styles = window.getComputedStyle(child);
          const marginBottom = parseFloat(styles.marginBottom);

          // Should have at least 8px spacing between sections
          if (marginBottom > 0) {
            expect(marginBottom).toBeGreaterThanOrEqual(8);
          }
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should maintain clear distinction between elements for screen readers', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      const title = screen.getByText(mockTask.title);
      const description = screen.getByText(mockTask.description);

      // Elements should be in separate containers for proper semantic structure
      expect(title.parentElement).not.toBe(description.parentElement);
    });

    it('should have proper heading hierarchy', () => {
      render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} onToggleStatus={() => {}} />);

      // Title should be in a heading element or have appropriate role
      const title = screen.getByText(mockTask.title);
      const tagName = title.tagName.toLowerCase();

      // Should be h1-h6 or have role="heading"
      const isHeading = /^h[1-6]$/.test(tagName) || title.getAttribute('role') === 'heading';
      expect(isHeading).toBe(true);
    });
  });
});
