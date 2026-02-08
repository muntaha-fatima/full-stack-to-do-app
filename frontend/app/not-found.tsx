import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-[hsl(var(--background))] dark:to-[hsl(var(--background))]">
      <div className="max-w-md w-full p-8 bg-white dark:bg-[hsl(var(--background))] rounded-xl shadow-lg border border-gray-200 dark:border-[hsl(var(--border))]">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Page Not Found</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Could not find the requested page.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}