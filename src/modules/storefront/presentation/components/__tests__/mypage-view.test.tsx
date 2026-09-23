import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyPageView } from '../mypage-view';
import { MyOrderSummaryDto } from '@/modules/storefront/application/dto/my-order.dto';

// mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('MyPageView', () => {
  const mockOrders: MyOrderSummaryDto[] = [
    {
      id: 'order-1',
      orderNumber: 'ORD-20260924-001',
      orderDate: '2026-09-24',
      paidAmount: 54000,
      orderSummary: '무선 헤드폰 외 1건',
      status: 'SHIPPING',
      statusLabel: '배송중',
      statusBadgeClass: 'bg-blue-100 text-blue-700',
      recipientName: '홍길동',
      shippingAddress: '서울시 강남구 테헤란로 123',
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-20260924-002',
      orderDate: '2026-09-23',
      paidAmount: 120000,
      orderSummary: '기계식 키보드',
      status: 'DELIVERED',
      statusLabel: '배송완료',
      statusBadgeClass: 'bg-green-100 text-green-700',
      recipientName: '홍길동',
      shippingAddress: '서울시 강남구 테헤란로 123',
    },
  ];

  it('주문 내역이 있는 경우 주문 카드 목록과 상태 배지를 올바르게 렌더링한다', () => {
    render(<MyPageView initialOrders={mockOrders} totalCount={2} />);

    expect(screen.getByText('홍길동 고객님')).toBeDefined();
    expect(screen.getByText(/ORD-20260924-001/)).toBeDefined();
    expect(screen.getByText(/ORD-20260924-002/)).toBeDefined();
    expect(screen.getByText('무선 헤드폰 외 1건')).toBeDefined();
    expect(screen.getByText(/54,000원/)).toBeDefined();
    expect(screen.getByText('배송중')).toBeDefined();
    expect(screen.getByText('배송완료')).toBeDefined();
  });

  it('주문 내역이 없는 경우 안내 메시지와 쇼핑하러 가기 링크를 표시한다', () => {
    render(<MyPageView initialOrders={[]} totalCount={0} />);

    expect(screen.getByText('아직 주문 내역이 없습니다')).toBeDefined();
    const shoppingLink = screen.getByRole('link', { name: /상품 둘러보기/i });
    expect(shoppingLink.getAttribute('href')).toBe('/shop');
  });

  it('탭 클릭 시 해당 탭 내용으로 전환된다', () => {
    render(<MyPageView initialOrders={mockOrders} totalCount={2} />);

    const benefitTab = screen.getByRole('button', { name: /쿠폰 및 포인트 혜택/i });
    fireEvent.click(benefitTab);

    expect(screen.getByText('VIP 회원 특별 혜택')).toBeDefined();
    expect(screen.getByText(/전 상품 3% 상시 추가 적립/i)).toBeDefined();
  });
});

