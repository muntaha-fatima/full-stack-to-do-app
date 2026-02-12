'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-[hsl(var(--background))] dark:to-[hsl(var(--background))]">
      <div className="max-w-md w-full p-8 bg-white dark:bg-[hsl(var(--background))] rounded-xl shadow-lg border border-gray-200 dark:border-[hsl(var(--border))]">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-gradient-to-r from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-purple))] hover:from-[hsl(var(--brand-cyan)/0.8)] hover:to-[hsl(var(--brand-purple)/0.8)] text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}