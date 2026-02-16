import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/api/auth/callback"]; // Added callback route

export function middleware(request: NextRequest) {
  // Check for refresh token in cookies
  const refreshToken = request.cookies.get("refresh_token")?.value;
  
  // Check for access token in cookies
  const accessToken = request.cookies.get("access_token")?.value;
  
  // Simple check: if neither token exists, definitely not authenticated
  if (!refreshToken && !accessToken) {
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
    
    // Redirect unauthenticated users to login for protected routes
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
  }
  
  // If we have tokens, we'll consider the user potentially authenticated
  // but we need to be more careful about redirecting from auth pages
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If on auth pages and have tokens, check if they're valid
  if (isPublicRoute && (refreshToken || accessToken)) {
    // Don't immediately redirect - let the auth context handle validation
    // This allows users to see the login page and potentially log out
    // if their tokens are invalid
    
    // Only redirect if we're certain the user is authenticated
    // For now, we'll allow access to login page even if tokens exist
    // The auth context will handle invalid tokens
    return NextResponse.next();
  }

  // For protected routes, redirect to login if not authenticated
  if (!isPublicRoute) {
    // If we have tokens, they might be valid, so allow access
    // If they're invalid, the auth context will handle the logout
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|robots|sitemap).*)",
  ],
};
