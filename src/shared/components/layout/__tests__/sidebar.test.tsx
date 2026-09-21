import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Sidebar } from '../sidebar';

describe('Sidebar Component (Integration Test)', () => {
  it('브랜드 로고와 6대 내비게이션 메뉴를 올바르게 렌더링한다', () => {
    render(<Sidebar currentPath="/dashboard" />);

    // 브랜드 로고
    expect(screen.getByText('CommerceHub')).toBeInTheDocument();

    // 6개 내비게이션 메뉴
    const menuItems = [
      { name: '대시보드', href: '/dashboard' },
      { name: '상품관리', href: '/products' },
      { name: '주문관리', href: '/orders' },
      { name: '고객관리', href: '/customers' },
      { name: '분석', href: '/sales' },
      { name: '설정', href: '/settings' },
    ];

    menuItems.forEach((item) => {
      const link = screen.getByRole('link', { name: new RegExp(item.name, 'i') });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
    });

    // 시스템 정상 상태 표시
    expect(screen.getByText('시스템 정상 가동 중')).toBeInTheDocument();
  });

  it('현재 경로인 메뉴에 파란색 활성(active) 스타일이 적용된다', () => {
    render(<Sidebar currentPath="/dashboard" />);

    const dashboardLink = screen.getByRole('link', { name: /대시보드/i });
    expect(dashboardLink.getAttribute('data-active')).toBe('true');
  });

  it('상품 관련 경로일 때 상품 목록과 상품 등록 서브메뉴가 노출된다', () => {
    render(<Sidebar currentPath="/products/create" />);

    expect(screen.getByRole('link', { name: /상품 목록/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /상품 등록/i })).toHaveAttribute('href', '/products/create');
  });

  it('고객 관련 경로일 때 고객 목록과 고객 상세 서브메뉴가 노출된다', () => {
    render(<Sidebar currentPath="/customers/detail" />);

    expect(screen.getByRole('link', { name: /고객 목록/i })).toHaveAttribute('href', '/customers');
    expect(screen.getByRole('link', { name: /고객 상세/i })).toHaveAttribute('href', '/customers/detail');
  });

  it('주문 관련 경로일 때 주문 목록과 주문 상세 서브메뉴가 노출된다', () => {
    render(<Sidebar currentPath="/orders/detail" />);

    expect(screen.getByRole('link', { name: /• 주문 목록/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /• 주문 상세/i })).toHaveAttribute('href', '/orders/detail');
  });
});


