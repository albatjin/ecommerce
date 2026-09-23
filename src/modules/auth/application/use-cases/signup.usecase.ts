import { IAuthRepository } from '../../domain/repositories/auth.repository';
import { AuthUser } from '../../domain/entities/auth-user';

export interface SignupInput {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
}

export class SignupUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignupInput): Promise<AuthUser> {
    const email = input.email?.trim();
    const name = input.name?.trim();
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    if (!name || name.length < 2) {
      throw new Error('이름은 2글자 이상 입력해 주세요.');
    }

    if (!email) {
      throw new Error('이메일을 입력해 주세요.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식을 입력해 주세요.');
    }

    if (!password || password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    return await this.authRepository.signup({
      email,
      name,
      password,
    });
  }
}

