import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const isAuthRoute = pathname.startsWith('/login');

  // 관리자 대시보드 전용 보호 경로
  const adminRoutes = [
    '/dashboard',
    '/products',
    '/orders',
    '/customers',
    '/sales',
    '/settings',
  ];

  const isProtectedAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. 이미 로그인된 사용자가 /login 에 접근할 때만 /dashboard 로 리다이렉트
  if (user && isAuthRoute) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. 비로그인 사용자가 관리자 전용 경로에 접근할 경우 /login 으로 리다이렉트
  if (!user && isProtectedAdminRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. 쇼핑몰 공개 경로 (/, /shop, /cart 등)는 로그인 여부와 관계없이 자유롭게 통과
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
