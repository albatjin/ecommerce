import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository, LoginCredentials, SignupCredentials } from '../domain/repositories/auth.repository';
import { AuthUser } from '../domain/entities/auth-user';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private supabase: SupabaseClient) {}

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('User not found');
    }

    // Try to fetch profile from public.users
    const { data: profile } = await this.supabase
      .from('users')
      .select('name, role, avatar_url')
      .eq('id', data.user.id)
      .maybeSingle();

    return new AuthUser({
      id: data.user.id,
      email: data.user.email ?? credentials.email,
      name: profile?.name ?? data.user.user_metadata?.name ?? '관리자',
      role: profile?.role ?? data.user.user_metadata?.role ?? 'admin',
      avatarUrl: profile?.avatar_url ?? data.user.user_metadata?.avatar_url ?? null,
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          role: 'customer',
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('회원가입 처리 중 오류가 발생했습니다.');
    }

    try {
      await this.supabase.from('users').insert({
        id: data.user.id,
        email: credentials.email,
        name: credentials.name,
        role: 'customer',
      });
    } catch {
      // Ignore if users table not available in mock/local test
    }

    return new AuthUser({
      id: data.user.id,
      email: data.user.email ?? credentials.email,
      name: credentials.name,
      role: 'customer',
      avatarUrl: null,
    });
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data: profile } = await this.supabase
      .from('users')
      .select('name, role, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    return new AuthUser({
      id: user.id,
      email: user.email ?? '',
      name: profile?.name ?? user.user_metadata?.name ?? '관리자',
      role: profile?.role ?? user.user_metadata?.role ?? 'admin',
      avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    });
  }
}

