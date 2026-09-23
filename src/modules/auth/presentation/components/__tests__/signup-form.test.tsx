import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../signup-form';
import { SignupUseCase } from '@/modules/auth/application/use-cases/signup.usecase';
import { AuthUser } from '@/modules/auth/domain/entities/auth-user';

// mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('SignupForm', () => {
  const mockUseCase = {
    execute: vi.fn().mockResolvedValue(
      new AuthUser({
        id: 'user-1',
        email: 'test@example.com',
        name: '홍길동',
        role: 'customer',
      })
    ),
  } as unknown as SignupUseCase;

  it('회원가입 폼 요소들을 올바르게 렌더링한다', () => {
    render(<SignupForm signupUseCase={mockUseCase} />);

    expect(screen.getByText('신규 회원가입')).toBeDefined();
    expect(screen.getByPlaceholderText('홍길동')).toBeDefined();
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined();
    expect(screen.getByPlaceholderText('최소 6자 이상')).toBeDefined();
    expect(screen.getByPlaceholderText('비밀번호 재입력')).toBeDefined();
    expect(screen.getByRole('button', { name: /회원가입 완료/i })).toBeDefined();
  });

  it('약관 미동의 시 에러 메시지를 표시한다', async () => {
    render(<SignupForm signupUseCase={mockUseCase} />);

    const nameInput = screen.getByPlaceholderText('홍길동');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const pwdInput = screen.getByPlaceholderText('최소 6자 이상');
    const confirmInput = screen.getByPlaceholderText('비밀번호 재입력');
    const submitBtn = screen.getByRole('button', { name: /회원가입 완료/i });

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(pwdInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/이용약관 및 개인정보 처리방침에 동의해 주세요/i)).toBeDefined();
  });

  it('약관 동의 후 정상 제출 시 완료 안내가 표시된다', async () => {
    render(<SignupForm signupUseCase={mockUseCase} />);

    const nameInput = screen.getByPlaceholderText('홍길동');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const pwdInput = screen.getByPlaceholderText('최소 6자 이상');
    const confirmInput = screen.getByPlaceholderText('비밀번호 재입력');
    const checkbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: /회원가입 완료/i });

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(pwdInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('회원가입이 완료되었습니다!')).toBeDefined();
    });
  });
});

