import { describe, it, expect, vi } from 'vitest';
import { SignupUseCase } from '../signup.usecase';
import { IAuthRepository } from '@/modules/auth/domain/repositories/auth.repository';
import { AuthUser } from '@/modules/auth/domain/entities/auth-user';

describe('SignupUseCase', () => {
  const mockCreatedUser = new AuthUser({
    id: 'user-new-1',
    email: 'newuser@example.com',
    name: '홍길동',
    role: 'customer',
  });

  const createMockRepo = (): IAuthRepository => ({
    login: vi.fn(),
    signup: vi.fn().mockResolvedValue(mockCreatedUser),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  });

  it('올바른 회원 정보 입력 시 회원가입이 성공하고 AuthUser를 반환한다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new SignupUseCase(mockRepo);

    const user = await useCase.execute({
      name: '홍길동',
      email: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(mockRepo.signup).toHaveBeenCalledWith({
      name: '홍길동',
      email: 'newuser@example.com',
      password: 'password123',
    });
    expect(user.id).toBe('user-new-1');
    expect(user.role).toBe('customer');
  });

  it('이름이 2글자 미만인 경우 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new SignupUseCase(mockRepo);

    await expect(
      useCase.execute({
        name: '홍',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('이름은 2글자 이상 입력해 주세요.');
  });

  it('이메일 형식이 잘못된 경우 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new SignupUseCase(mockRepo);

    await expect(
      useCase.execute({
        name: '홍길동',
        email: 'invalid-email',
        password: 'password123',
      })
    ).rejects.toThrow('올바른 이메일 형식을 입력해 주세요.');
  });

  it('비밀번호가 6자 미만인 경우 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new SignupUseCase(mockRepo);

    await expect(
      useCase.execute({
        name: '홍길동',
        email: 'test@example.com',
        password: '123',
      })
    ).rejects.toThrow('비밀번호는 최소 6자 이상이어야 합니다.');
  });

  it('비밀번호와 비밀번호 확인이 일치하지 않는 경우 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new SignupUseCase(mockRepo);

    await expect(
      useCase.execute({
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password999',
      })
    ).rejects.toThrow('비밀번호가 일치하지 않습니다.');
  });
});

