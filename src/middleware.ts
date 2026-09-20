import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const isAuthRoute = pathname.startsWith('/login');
  const isRootRoute = pathname === '/';

  // 1. If user is logged in
  if (user) {
    // If logged-in user visits /login or /, redirect to /dashboard
    if (isAuthRoute || isRootRoute) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return response;
  }

  // 2. If user is NOT logged in
  if (!user) {
    // If unauthenticated user visits /, redirect to /login
    if (isRootRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If unauthenticated user visits any protected route (not /login)
    if (!isAuthRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset images / svgs
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

