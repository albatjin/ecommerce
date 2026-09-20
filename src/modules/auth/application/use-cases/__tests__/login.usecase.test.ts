import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from '../login.usecase';
import { IAuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthUser } from '../../../domain/entities/auth-user';

describe('LoginUseCase (Unit Test)', () => {
  let mockAuthRepo: IAuthRepository;
  let useCase: LoginUseCase;

  beforeEach(() => {
    mockAuthRepo = {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
    };
    useCase = new LoginUseCase(mockAuthRepo);
  });

  it('올바른 계정 정보로 로그인 시 AuthUser를 정상 반환한다', async () => {
    const mockUser = new AuthUser({
      id: 'user-123',
      email: 'admin@commercehub.co.kr',
      name: '김은영',
      role: 'admin',
    });

    vi.mocked(mockAuthRepo.login).mockResolvedValue(mockUser);

    const result = await useCase.execute({
      email: 'admin@commercehub.co.kr',
      password: 'password123!',
    });

    expect(result).toEqual(mockUser);
    expect(mockAuthRepo.login).toHaveBeenCalledWith({
      email: 'admin@commercehub.co.kr',
      password: 'password123!',
      rememberMe: undefined,
    });
  });

  it('이메일 또는 비밀번호가 틀린 경우 정해진 안내 문구를 던진다', async () => {
    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('Invalid login credentials'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'wrong-password',
      })
    ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다');
  });

  it('invalid_credentials 또는 email not confirmed 에러 시 정해진 안내 문구를 던진다', async () => {
    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('invalid_credentials'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'wrong-password',
      })
    ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다');

    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('email not confirmed'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'wrong-password',
      })
    ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다');
  });

  it('인터넷 연결 문제 또는 서버 통신 불가 시 정해진 안내 문구를 던진다', async () => {
    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('Failed to fetch'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'password123!',
      })
    ).rejects.toThrow('서버에 연결할 수 없습니다. 다시 시도해 주세요');
  });

  it('네트워크 fetch failed 또는 timeout 에러 발생 시에도 정해진 안내 문구를 던진다', async () => {
    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('fetch failed'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'password123!',
      })
    ).rejects.toThrow('서버에 연결할 수 없습니다. 다시 시도해 주세요');

    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('request timeout'));

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'password123!',
      })
    ).rejects.toThrow('서버에 연결할 수 없습니다. 다시 시도해 주세요');
  });

  it('기타 일반 Error 또는 비Error 객체 예외 시 적절히 처리한다', async () => {
    const customError = new Error('커스텀 비즈니스 예외');
    vi.mocked(mockAuthRepo.login).mockRejectedValue(customError);

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'password123!',
      })
    ).rejects.toThrow('커스텀 비즈니스 예외');

    vi.mocked(mockAuthRepo.login).mockRejectedValue('unknown string error');

    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: 'password123!',
      })
    ).rejects.toThrow('서버에 연결할 수 없습니다. 다시 시도해 주세요');
  });

  it('이메일이 비어있는 경우 유효성 검증 오류를 던진다', async () => {
    await expect(
      useCase.execute({
        email: '',
        password: 'password123!',
      })
    ).rejects.toThrow('이메일을 입력해 주세요.');
  });

  it('비밀번호가 비어있는 경우 유효성 검증 오류를 던진다', async () => {
    await expect(
      useCase.execute({
        email: 'admin@commercehub.co.kr',
        password: '',
      })
    ).rejects.toThrow('비밀번호를 입력해 주세요.');
  });
});

