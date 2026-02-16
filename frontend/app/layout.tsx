import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ServerHeader from '@/components/ServerHeader';
import { ThemeProvider } from '@/components/theme-provider';
import PurplePinkSmokeBackground from '@/components/PurplePinkSmokeBackground';
import { Suspense } from 'react';
import SlidingChatPanel from '@/components/SlidingChatPanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A production-ready Todo application built with Next.js and FastAPI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-300/25 to-purple-300/20 blur-3xl -z-10"></div>
              <div className="absolute top-3/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-300/20 blur-3xl -z-10"></div>
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-200/15 to-purple-200/10 blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200/15 to-pink-200/10 blur-3xl -z-10"></div>
              <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-purple-300/15 to-pink-300/10 blur-3xl -z-10"></div>
              <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full bg-gradient-to-r from-pink-300/15 to-purple-300/10 blur-3xl -z-10"></div>
            </div>
            <PurplePinkSmokeBackground />
            <ServerHeader />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div><p className="text-gray-700 dark:text-gray-300">Loading...</p></div></div>}>
              <Providers>{children}</Providers>
            </Suspense>
            <SlidingChatPanel />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
