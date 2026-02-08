import { Suspense } from 'react';
import ClientHeader from './ClientHeader';

export default function ServerHeader() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/30 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-white text-lg">TD</span>
              </div>
              <span className="self-center text-xl font-semibold tracking-wide text-gray-900">Todo App</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
    }>
      <ClientHeader />
    </Suspense>
  );
}