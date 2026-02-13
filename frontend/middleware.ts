import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

export function middleware(request: NextRequest) {

  const token = request.cookies.get("refresh_token");
  const authenticated = !!token;

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  if (!isPublicRoute && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && authenticated &&
      (request.nextUrl.pathname === "/login" ||
       request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|robots|sitemap).*)",
  ],
};
