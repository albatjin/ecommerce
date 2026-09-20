import { IAuthRepository, LoginCredentials } from '../../domain/repositories/auth.repository';
import { AuthUser } from '../../domain/entities/auth-user';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthUser> {
    const email = credentials.email?.trim();
    const password = credentials.password;

    if (!email) {
      throw new Error('이메일을 입력해 주세요.');
    }
    if (!password) {
      throw new Error('비밀번호를 입력해 주세요.');
    }

    try {
      return await this.authRepository.login({
        email,
        password,
        rememberMe: credentials.rememberMe,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message.toLowerCase() : '';

      // Supabase / Auth credentials mismatch
      if (
        message.includes('invalid login credentials') ||
        message.includes('invalid_credentials') ||
        message.includes('email not confirmed') ||
        message.includes('user not found')
      ) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
      }

      // Network / Connection errors
      if (
        message.includes('failed to fetch') ||
        message.includes('fetch failed') ||
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('abort')
      ) {
        throw new Error('서버에 연결할 수 없습니다. 다시 시도해 주세요');
      }

      // Default fallback if another specific error occurs
      throw error instanceof Error ? error : new Error('서버에 연결할 수 없습니다. 다시 시도해 주세요');
    }
  }
}

