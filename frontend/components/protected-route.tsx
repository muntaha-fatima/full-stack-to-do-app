'use client';

import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  let authContext;
  try {
    authContext = useAuth();
  } catch (error: any) {
    setAuthError(error.message);
    console.error('Auth context error:', error.message);
    return <LoadingSkeleton />;
  }

  const { isAuthenticated, loading } = authContext;

  useEffect(() => {
    if (!loading && !isAuthenticated && !authError) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, authError]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}