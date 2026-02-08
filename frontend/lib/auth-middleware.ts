/**
 * Middleware to protect routes that require authentication using Better Auth.
 */

// Better Auth handles authentication via cookies and server-side session validation
// This file is kept for reference but the actual authentication is handled by:
// 1. Better Auth's API routes at /api/auth/*
// 2. The ProtectedRoute component in the frontend
// 3. The auth middleware in the root middleware.ts file

// Example of how to use this in middleware.ts with Better Auth
/*
import { auth } from './src/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Get session using Better Auth
  const session = await auth.$ctx.getSession({
    headers: request.headers,
  });
  
  const isAuthenticated = !!session;

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes) - except auth routes which are handled separately
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon|robots|sitemap).*)',
  ],
};
*/