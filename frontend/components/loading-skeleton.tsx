/**
 * Loading skeleton components for better UX during data fetching
 */

'use client';

export function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 dark:border-gray-700"></div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Status and Priority badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Due date */}
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton for the stats bar
export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-card p-4 rounded-lg border border-border">
          <div className="h-8 w-12 mx-auto mb-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-20 mx-auto rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for the header section
export function HeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full mr-2 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}

// Skeleton for the entire page
export function PageSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <HeaderSkeleton />
      <StatsBarSkeleton />
      <TaskListSkeleton count={6} />
    </div>
  );
}
