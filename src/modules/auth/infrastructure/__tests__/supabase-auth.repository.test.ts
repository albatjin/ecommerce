/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuthRepository } from '../supabase-auth.repository';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupabaseAuthRepository (Integration Test)', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let repository: SupabaseAuthRepository;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      } as unknown as SupabaseClient['auth'],
      from: vi.fn(),
    };
    repository = new SupabaseAuthRepository(mockSupabase as SupabaseClient);
  });

  it('로그인 성공 시 Supabase 응답을 AuthUser 객체로 변환하여 반환한다', async () => {
    vi.mocked(mockSupabase.auth!.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: 'u-1',
          email: 'admin@commercehub.co.kr',
          user_metadata: { name: '김은영', role: 'admin' },
        },
        session: {},
      },
      error: null,
    } as any);

    vi.mocked(mockSupabase.from!).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { name: '김은영', role: 'admin', avatar_url: null },
            error: null,
          }),
        }),
      }),
    } as any);

    const user = await repository.login({
      email: 'admin@commercehub.co.kr',
      password: 'password123',
    });

    expect(user.id).toBe('u-1');
    expect(user.email).toBe('admin@commercehub.co.kr');
    expect(user.name).toBe('김은영');
    expect(user.role).toBe('admin');
  });

  it('로그인 실패 시 에러를 던진다', async () => {
    vi.mocked(mockSupabase.auth!.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Invalid login credentials') as any,
    });

    await expect(
      repository.login({
        email: 'admin@commercehub.co.kr',
        password: 'wrong',
      })
    ).rejects.toThrow('Invalid login credentials');
  });

  it('로그아웃 성공 시 오류 없이 완료된다', async () => {
    vi.mocked(mockSupabase.auth!.signOut).mockResolvedValue({
      error: null,
    });

    await expect(repository.logout()).resolves.toBeUndefined();
    expect(mockSupabase.auth!.signOut).toHaveBeenCalledTimes(1);
  });

  it('로그아웃 실패 시 오류를 던진다', async () => {
    vi.mocked(mockSupabase.auth!.signOut).mockResolvedValue({
      error: new Error('Signout failed') as any,
    });

    await expect(repository.logout()).rejects.toThrow('Signout failed');
  });

  it('getCurrentUser 호출 시 현재 로그인된 사용자를 반환한다', async () => {
    vi.mocked(mockSupabase.auth!.getUser).mockResolvedValue({
      data: {
        user: {
          id: 'u-2',
          email: 'manager@test.com',
          user_metadata: { name: '매니저', role: 'manager' },
        },
      },
      error: null,
    } as any);

    vi.mocked(mockSupabase.from!).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { name: '매니저', role: 'manager', avatar_url: null },
            error: null,
          }),
        }),
      }),
    } as any);

    const user = await repository.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.id).toBe('u-2');
    expect(user?.role).toBe('manager');
  });

  it('로그인 세션이 없을 때 getCurrentUser는 null을 반환한다', async () => {
    vi.mocked(mockSupabase.auth!.getUser).mockResolvedValue({
      data: { user: null },
      error: new Error('No session') as any,
    });

    const user = await repository.getCurrentUser();
    expect(user).toBeNull();
  });
});

