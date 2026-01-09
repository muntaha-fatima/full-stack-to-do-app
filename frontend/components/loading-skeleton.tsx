/**
 * Loading skeleton component for task cards
 */

'use client';

export function TaskCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Tags */}
      <div className="mb-3 flex gap-2">
        <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
