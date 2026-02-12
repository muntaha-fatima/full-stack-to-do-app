/**
 * LinkWrapper Component
 *
 * A utility component to prevent nested anchor tags which cause hydration errors.
 * This component helps avoid placing <a> elements inside other <a> elements,
 * which is invalid HTML and causes React hydration errors.
 */

import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkWrapperProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  isNested?: boolean; // Flag to indicate if this link is nested inside another
}

const LinkWrapper = ({
  href,
  children,
  className = '',
  onClick,
  target,
  rel,
  isNested = false
}: LinkWrapperProps) => {
  // If this link is nested inside another link, render as a span with click handler
  if (isNested) {
    return (
      <span
        className={className}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = href;
          onClick?.();
        }}
      >
        {children}
      </span>
    );
  }

  // Otherwise, render as a normal Next.js Link
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
};

export default LinkWrapper;