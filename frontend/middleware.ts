import { NextRequest, NextResponse } from "next/server";
import { isUserAuthenticatedOnServer } from "./lib/server-auth";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/api/auth/*"];

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
    return response;
  }

  // Check if the requested route is public
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route ||
    (route.endsWith("/*") && request.nextUrl.pathname.startsWith(route.slice(0, -2)))
  );

  // Check if user is authenticated using server-side authentication
  const authenticated = await isUserAuthenticatedOnServer();

  // If accessing a protected route without authentication, redirect to login
  if (!isPublicRoute && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing a public auth-required route while authenticated, redirect to dashboard
  if (isPublicRoute && authenticated &&
      (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add CORS headers to the response
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  return response;
}

// Apply middleware to all routes except static files and API routes (except auth)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api\\/v1|_next\\/static|_next\\/image|favicon|robots|sitemap).*)",
  ],
};