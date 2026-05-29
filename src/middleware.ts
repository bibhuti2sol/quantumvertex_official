import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Auth Guard
  const token = request.cookies.get('auth_token')?.value;
  const isPublicRoute = ['/login', '/signup', '/forget-password', '/product', '/'].includes(
    pathname
  );

  // If no token and trying to access protected route -> Redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access login/signup -> Redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────
// Optimize middleware by only running on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.png (standard icon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
};
