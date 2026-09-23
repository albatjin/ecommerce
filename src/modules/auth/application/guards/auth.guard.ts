import { createClient } from '@/shared/lib/supabase/server';
import { AuthUser } from '../../domain/entities/auth-user';
import { UserRole, isAdminRole, hasPermission, Resource, Action } from '../../domain/services/rbac.service';

export interface GuardUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * 현재 요청 컨텍스트의 인증된 사용자 정보 및 역할 반환
 */
export async function getAuthenticatedUser(): Promise<GuardUser | null> {
  try {
    const supabase = await createClient();
    if (!supabase?.auth) {
      return {
        id: 'mock-admin',
        email: 'admin@example.com',
        name: '관리자',
        role: 'admin',
      };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // users 테이블 또는 user_metadata에서 profile 조회
    const { data: profile } = await supabase
      .from('users')
      .select('name, role')
      .eq('id', user.id)
      .maybeSingle();

    const role = (profile?.role ?? user.user_metadata?.role ?? 'customer') as UserRole;
    const name = profile?.name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '사용자';

    return {
      id: user.id,
      email: user.email ?? '',
      name,
      role,
    };
  } catch {
    return null;
  }
}

/**
 * 관리자 권한 필수 가드
 * @param customCheck 추가적인 권한 요구사항 (기본: isAdminRole)
 */
export async function requireAdmin(minRole?: UserRole): Promise<GuardUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  if (!isAdminRole(user.role)) {
    throw new Error('해당 기능을 수행할 관리자 권한이 없습니다.');
  }

  if (minRole && minRole === 'super_admin' && user.role !== 'super_admin') {
    throw new Error('최고 관리자(super_admin)만 수행할 수 있는 작업입니다.');
  }

  return user;
}

/**
 * 리소스 및 액션 기반의 정밀 인가 가드
 */
export async function requirePermission(resource: Resource, action: Action): Promise<GuardUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  if (!hasPermission(user.role, resource, action)) {
    throw new Error(`[${resource}]에 대한 ${action} 권한이 없습니다.`);
  }

  return user;
}
