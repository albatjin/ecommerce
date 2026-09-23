import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';

/**
 * 보안 강화 응답 헤더 설정
 */
function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const isAdminAuthRoute = pathname.startsWith('/admin/login');
  const isCustomerAuthRoute = pathname === '/login' || pathname === '/signup';

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

  // 1. 이미 로그인된 사용자가 관리자 로그인(/admin/login)에 접근할 때
  if (user && isAdminAuthRoute) {
    const role = user.user_metadata?.role ?? user.app_metadata?.role ?? 'admin';
    const redirectTarget = role === 'customer' ? '/unauthorized' : '/dashboard';
    const redirectUrl = new URL(redirectTarget, request.url);
    return applySecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  // 2. 이미 로그인된 사용자가 일반 고객 로그인(/login) 또는 회원가입(/signup)에 접근할 때
  if (user && isCustomerAuthRoute) {
    const role = user.user_metadata?.role ?? user.app_metadata?.role ?? 'customer';
    const redirectTarget = role === 'customer' ? '/' : '/dashboard';
    const redirectUrl = new URL(redirectTarget, request.url);
    return applySecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  // 3. 비로그인 사용자가 관리자 전용 경로에 접근할 경우 /admin/login 으로 리다이렉트
  if (!user && isProtectedAdminRoute) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // 4. 일반 고객(customer)이 관리자 전용 경로에 접근할 경우 /unauthorized 로 차단
  if (user && isProtectedAdminRoute) {
    const role = user.user_metadata?.role ?? user.app_metadata?.role ?? 'admin';
    if (role === 'customer') {
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('from', pathname);
      return applySecurityHeaders(NextResponse.redirect(unauthorizedUrl));
    }
  }

  // 5. 쇼핑몰 공개 경로 (/, /shop, /cart, /mypage, /track 등)는 보안 헤더와 함께 통과
  return applySecurityHeaders(response);
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
