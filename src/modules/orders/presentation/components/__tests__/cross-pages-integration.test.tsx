import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Sidebar } from '@/shared/components/layout/sidebar';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/orders/detail',
}));

describe('Cross-Pages Integration & Conflict Check (상품등록, 고객상세, 주문상세)', () => {
  it('주문 상세 페이지 경로(/orders/detail)일 때 주문 메뉴 및 주문 상세 서브메뉴만 정확히 활성화된다', () => {
    render(<Sidebar currentPath="/orders/detail" />);

    // 주문 서브메뉴 표시 확인
    expect(screen.getByRole('link', { name: /• 주문 목록/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /• 주문 상세/i })).toHaveAttribute('href', '/orders/detail');

    // 타 메뉴 서브메뉴 비활성화 확인 (충돌 방지)
    expect(screen.queryByRole('link', { name: /• 상품 등록/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /• 고객 상세/i })).not.toBeInTheDocument();
  });

  it('상품 등록 페이지 경로(/products/create)일 때 상품 메뉴 및 상품 등록 서브메뉴만 정확히 활성화된다', () => {
    render(<Sidebar currentPath="/products/create" />);

    expect(screen.getByRole('link', { name: /• 상품 목록/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /• 상품 등록/i })).toHaveAttribute('href', '/products/create');

    expect(screen.queryByRole('link', { name: /• 주문 상세/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /• 고객 상세/i })).not.toBeInTheDocument();
  });

  it('고객 상세 페이지 경로(/customers/detail)일 때 고객 메뉴 및 고객 상세 서브메뉴만 정확히 활성화된다', () => {
    render(<Sidebar currentPath="/customers/detail" />);

    expect(screen.getByRole('link', { name: /• 고객 목록/i })).toHaveAttribute('href', '/customers');
    expect(screen.getByRole('link', { name: /• 고객 상세/i })).toHaveAttribute('href', '/customers/detail');

    expect(screen.queryByRole('link', { name: /• 상품 등록/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /• 주문 상세/i })).not.toBeInTheDocument();
  });
});

