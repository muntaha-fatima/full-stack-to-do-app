'use client';

import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  
  // Call useAuth at the top level to comply with React Hooks rules
  const authContext = useAuth();
  const { isAuthenticated, loading } = authContext;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Handle auth context errors
  // Note: We're not handling auth context errors here anymore since we removed the error state

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}