import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAdmin, requirePermission, getAuthenticatedUser } from '../auth.guard';
import * as serverLib from '@/shared/lib/supabase/server';

vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Auth Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMockSupabase = (user: any, profile: any = null) => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user },
          error: user ? null : new Error('No user'),
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: profile }),
          }),
        }),
      }),
    };
    (serverLib.createClient as any).mockResolvedValue(mockSupabase);
    return mockSupabase;
  };

  it('비로그인 사용자가 관리자 가드 호출 시 로그인 요구 에러를 던진다', async () => {
    setupMockSupabase(null);

    await expect(requireAdmin()).rejects.toThrow('로그인이 필요한 서비스입니다.');
  });

  it('일반 고객(customer)이 관리자 가드 호출 시 권한 에러를 던진다', async () => {
    setupMockSupabase(
      { id: 'u-1', email: 'user@example.com' },
      { role: 'customer', name: '일반고객' }
    );

    await expect(requireAdmin()).rejects.toThrow('해당 기능을 수행할 관리자 권한이 없습니다.');
  });

  it('관리자(admin)가 관리자 가드 호출 시 사용자 정보를 정상 반환한다', async () => {
    setupMockSupabase(
      { id: 'adm-1', email: 'admin@example.com' },
      { role: 'admin', name: '김관리' }
    );

    const result = await requireAdmin();
    expect(result.id).toBe('adm-1');
    expect(result.role).toBe('admin');
    expect(result.name).toBe('김관리');
  });

  it('최고 관리자(super_admin) 요구 시 일반 관리자는 에러를 던진다', async () => {
    setupMockSupabase(
      { id: 'adm-2', email: 'admin@example.com' },
      { role: 'admin', name: '김관리' }
    );

    await expect(requireAdmin('super_admin')).rejects.toThrow('최고 관리자(super_admin)만 수행할 수 있는 작업입니다.');
  });

  it('requirePermission이 리소스별 권한을 정확히 검증한다', async () => {
    setupMockSupabase(
      { id: 'staff-1', email: 'staff@example.com' },
      { role: 'staff', name: '박스태프' }
    );

    // staff는 products create 가능
    const allowed = await requirePermission('products', 'create');
    expect(allowed.role).toBe('staff');

    // staff는 settings read 불가
    await expect(requirePermission('settings', 'read')).rejects.toThrow('[settings]에 대한 read 권한이 없습니다.');
  });
});

