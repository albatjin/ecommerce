import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnauthorizedView } from '../unauthorized-view';

// mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('UnauthorizedView', () => {
  it('403 Forbidden 배지와 접근 권한 안내 문구를 렌더링한다', () => {
    render(<UnauthorizedView targetPath="/settings" />);

    expect(screen.getByText('403 Forbidden')).toBeDefined();
    expect(screen.getByText('접근 권한이 없습니다')).toBeDefined();
    expect(screen.getByText(/접근 시도: \/settings/)).toBeDefined();
  });

  it('관리자 로그인, 쇼핑몰 홈, 마이페이지 링크를 제공한다', () => {
    render(<UnauthorizedView />);

    const loginLink = screen.getByRole('link', { name: /관리자 계정으로 로그인/i });
    expect(loginLink.getAttribute('href')).toBe('/admin/login');

    const homeLink = screen.getByRole('link', { name: /쇼핑몰 홈/i });
    expect(homeLink.getAttribute('href')).toBe('/');

    const mypageLink = screen.getByRole('link', { name: /마이페이지/i });
    expect(mypageLink.getAttribute('href')).toBe('/mypage');
  });
});

