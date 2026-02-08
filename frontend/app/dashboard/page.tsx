'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-context';
import { useEffect } from 'react';
import Home from '../todo-dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #DCE9F2, #FFFFFF)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-700">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message (though this shouldn't happen due to redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #DCE9F2, #FFFFFF)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #DCE9F2, #FFFFFF)' }}>
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={logout}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
        >
          Sign Out
        </Button>
      </div>
      <Home />
    </div>
  );
}