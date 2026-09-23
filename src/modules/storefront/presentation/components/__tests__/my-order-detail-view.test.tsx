import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyOrderDetailView } from '../my-order-detail-view';
import { MyOrderDetailDto } from '@/modules/storefront/application/dto/my-order.dto';

// mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('MyOrderDetailView', () => {
  const mockOrder: MyOrderDetailDto = {
    id: 'order-123',
    orderNumber: 'ORD-20260924-001',
    displayTitle: '주문 #ORD-20260924-001',
    status: 'SHIPPING',
    statusLabel: '배송중',
    statusBadgeClass: 'bg-blue-100 text-blue-700',
    currentStepIndex: 3,
    orderDate: '2026-09-24 10:00',
    paidDate: '2026-09-24 10:05',
    customer: {
      id: 'cust-1',
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      totalOrders: 5,
      totalSpent: 300000,
      rewardPoints: 3450,
    },
    items: [
      {
        id: 'item-1',
        productName: '무선 노이즈캔슬링 헤드폰',
        quantity: 1,
        unitPrice: 50000,
        couponDiscount: 0,
        shippingFee: 0,
        subtotal: 50000,
      },
      {
        id: 'item-2',
        productName: '휴대용 케이스',
        quantity: 2,
        unitPrice: 15000,
        couponDiscount: 0,
        shippingFee: 0,
        subtotal: 30000,
      },
    ],
    payment: {
      totalProductAmount: 80000,
      couponDiscount: 0,
      pointUsed: 0,
      shippingFee: 3000,
      finalPaidAmount: 83000,
      paymentMethod: '신용카드',
      approvedAt: '2026-09-24 10:05',
    },
    shipping: {
      recipientName: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 역삼동 123-45',
      trackingNumber: 'CJ-999888777',
      trackingCompany: 'CJ대한통운',
    },
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('주문 번호, 상품 목록 및 가격 정보를 정상적으로 렌더링한다', () => {
    render(<MyOrderDetailView order={mockOrder} />);

    expect(screen.getByText('ORD-20260924-001')).toBeDefined();
    expect(screen.getByText('무선 노이즈캔슬링 헤드폰')).toBeDefined();
    expect(screen.getByText('휴대용 케이스')).toBeDefined();
    expect(screen.getAllByText(/83,000원/).length).toBeGreaterThan(0);
    expect(screen.getByText('서울특별시 강남구 역삼동 123-45')).toBeDefined();
  });

  it('운송장 번호 복사 버튼 클릭 시 클립보드에 복사된다', async () => {
    render(<MyOrderDetailView order={mockOrder} />);

    const copyBtn = screen.getByTitle('송장번호 복사');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('CJ-999888777');
  });

  it('배송 4단계 스텝퍼가 노출된다', () => {
    render(<MyOrderDetailView order={mockOrder} />);

    expect(screen.getByText('결제완료')).toBeDefined();
    expect(screen.getByText('상품준비')).toBeDefined();
    expect(screen.getAllByText('배송중').length).toBeGreaterThan(0);
    expect(screen.getByText('배송완료')).toBeDefined();
  });
});

