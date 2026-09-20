import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { LoginForm } from '../login-form';
import { LoginUseCase } from '../../../application/use-cases/login.usecase';
import { AuthUser } from '../../../domain/entities/auth-user';

// Mock useRouter
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock @/shared/lib/supabase/client
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user', email: 'admin@test.com' } },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
  }),
}));

describe('LoginForm Component (Integration Test)', () => {
  let mockUseCase: Partial<LoginUseCase>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = {
      execute: vi.fn(),
    };
  });

  it('시안(auth.png)에 정의된 모든 주요 UI 요소가 정상 렌더링된다', () => {
    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    expect(screen.getByText('CommerceHub')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Ops v4\.1/i)).toBeInTheDocument();
    expect(screen.getByText('쇼핑몰 통합 관리자 센터')).toBeInTheDocument();
    expect(screen.getByText(/스토어 운영 관리를 위해 승인된 계정으로 로그인해 주세요/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/관리자 아이디/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@commercehub.co.kr')).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();

    expect(screen.getByText('2차 인증 (OTP) 강제 적용')).toBeInTheDocument();
    expect(screen.getByLabelText(/아이디 기억하기/i)).toBeInTheDocument();
    expect(screen.getByText(/비밀번호 찾기 \/ 계정 문의/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
    expect(screen.getByText('보안 관리 규정 안내')).toBeInTheDocument();
  });

  it('비밀번호 보기/숨기기 토글 버튼이 정상 동작한다', () => {
    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle eye button
    const toggleButton = passwordInput.parentElement?.querySelector('button');
    expect(toggleButton).not.toBeNull();
    fireEvent.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('아이디 기억하기 체크박스를 토글할 수 있다', () => {
    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    const checkbox = screen.getByLabelText(/아이디 기억하기/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('이메일/비밀번호 불일치 시 안내 에러 메시지를 표시한다', async () => {
    vi.mocked(mockUseCase.execute!).mockRejectedValue(
      new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    );

    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    fireEvent.change(screen.getByPlaceholderText('admin@commercehub.co.kr'), {
      target: { value: 'admin@commercehub.co.kr' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('네트워크 연결 문제 발생 시 안내 에러 메시지를 표시한다', async () => {
    vi.mocked(mockUseCase.execute!).mockRejectedValue(
      new Error('서버에 연결할 수 없습니다. 다시 시도해 주세요')
    );

    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    fireEvent.change(screen.getByPlaceholderText('admin@commercehub.co.kr'), {
      target: { value: 'admin@commercehub.co.kr' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: 'password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(screen.getByText('서버에 연결할 수 없습니다. 다시 시도해 주세요')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('비Error 예외 객체 발생 시 기본 에러 문구를 표시한다', async () => {
    vi.mocked(mockUseCase.execute!).mockRejectedValue('unknown error string');

    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    fireEvent.change(screen.getByPlaceholderText('admin@commercehub.co.kr'), {
      target: { value: 'admin@commercehub.co.kr' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: 'password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(screen.getByText('서버에 연결할 수 없습니다. 다시 시도해 주세요')).toBeInTheDocument();
    });
  });

  it('로그인 성공 시 대시보드(/dashboard)로 이동한다', async () => {
    const mockUser = new AuthUser({
      id: 'admin-1',
      email: 'admin@commercehub.co.kr',
      name: '최고 관리자',
      role: 'admin',
    });
    vi.mocked(mockUseCase.execute!).mockResolvedValue(mockUser);

    render(<LoginForm loginUseCase={mockUseCase as LoginUseCase} />);

    fireEvent.change(screen.getByPlaceholderText('admin@commercehub.co.kr'), {
      target: { value: 'admin@commercehub.co.kr' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: 'correct-pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('loginUseCase prop 없이 기본 렌더링되어도 정상 동작한다', () => {
    render(<LoginForm />);
    expect(screen.getByText('쇼핑몰 통합 관리자 센터')).toBeInTheDocument();
  });
});

