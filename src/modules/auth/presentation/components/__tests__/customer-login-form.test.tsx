import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerLoginForm } from '../customer-login-form';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.usecase';
import { AuthUser } from '@/modules/auth/domain/entities/auth-user';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CustomerLoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCustomerUser = new AuthUser({
    id: 'user-cust-1',
    email: 'customer@example.com',
    name: '일반고객',
    role: 'customer',
  });

  const mockUseCase = {
    execute: vi.fn().mockResolvedValue(mockCustomerUser),
  } as unknown as LoginUseCase;

  it('쇼핑몰 고객 로그인 폼 요소들을 올바르게 렌더링한다', () => {
    render(<CustomerLoginForm loginUseCase={mockUseCase} />);

    expect(screen.getByText('쇼핑몰 고객 로그인')).toBeDefined();
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined();
    expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeDefined();
    expect(screen.getByRole('button', { name: /쇼핑몰 로그인/i })).toBeDefined();
    expect(screen.getByText(/회원가입하기/i)).toBeDefined();
    expect(screen.getByText(/관리자 센터 로그인/i)).toBeDefined();
  });

  it('데모 계정 자동 입력 버튼 클릭 시 고객 정보가 입력된다', () => {
    render(<CustomerLoginForm loginUseCase={mockUseCase} />);

    const autoFillBtn = screen.getByRole('button', { name: /자동 입력/i });
    fireEvent.click(autoFillBtn);

    const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요') as HTMLInputElement;

    expect(emailInput.value).toBe('customer@example.com');
    expect(passwordInput.value).toBe('customer1234!');
  });

  it('일반 고객 로그인 성공 시 쇼핑몰 홈(/)으로 이동한다', async () => {
    render(<CustomerLoginForm loginUseCase={mockUseCase} />);

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요');
    const submitBtn = screen.getByRole('button', { name: /쇼핑몰 로그인/i });

    fireEvent.change(emailInput, { target: { value: 'customer@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'customer1234!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        email: 'customer@example.com',
        password: 'customer1234!',
        rememberMe: true,
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
