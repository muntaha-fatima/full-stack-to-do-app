/**
 * React Query provider component.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'toast-notification',
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'hsl(var(--status-success))',
                secondary: 'hsl(var(--card))',
              },
              style: {
                background: 'hsl(var(--card) / 0.95)',
                border: '1px solid hsl(var(--status-success) / 0.3)',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: 'hsl(var(--status-error))',
                secondary: 'hsl(var(--card))',
              },
              style: {
                background: 'hsl(var(--card) / 0.95)',
                border: '1px solid hsl(var(--status-error) / 0.3)',
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
