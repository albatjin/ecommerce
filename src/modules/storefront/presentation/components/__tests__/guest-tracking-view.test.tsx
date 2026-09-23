import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GuestTrackingView } from '../guest-tracking-view';
import * as actions from '@/modules/storefront/application/actions/tracking.actions';
import { MyOrderDetailDto } from '@/modules/storefront/application/dto/my-order.dto';

// mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('GuestTrackingView', () => {
  const mockTrackedOrder: MyOrderDetailDto = {
    id: 'ord-123',
    orderNumber: 'ORD-20260924-999',
    displayTitle: '주문 #ORD-20260924-999',
    status: 'SHIPPING',
    statusLabel: '배송중',
    statusBadgeClass: 'bg-blue-100 text-blue-700',
    currentStepIndex: 3,
    orderDate: '2026-09-24 12:00',
    customer: {
      id: 'cust-guest',
      name: '이순신',
      email: 'lee@example.com',
      phone: '010-9876-5432',
      totalOrders: 1,
      totalSpent: 48000,
      rewardPoints: 0,
    },
    items: [
      {
        id: 'item-1',
        productName: '초경량 게이밍 마우스',
        quantity: 1,
        unitPrice: 45000,
        couponDiscount: 0,
        shippingFee: 0,
        subtotal: 45000,
      },
    ],
    payment: {
      totalProductAmount: 45000,
      couponDiscount: 0,
      pointUsed: 0,
      shippingFee: 3000,
      finalPaidAmount: 48000,
      paymentMethod: '토스페이',
    },
    shipping: {
      recipientName: '이순신',
      phone: '010-9876-5432',
      address: '부산광역시 해운대구 마린시티',
      trackingNumber: 'CJ-111222333',
      trackingCompany: 'CJ대한통운',
    },
  };

  it('조회 성공 시 배송 상태와 주문 내역을 렌더링한다', async () => {
    vi.spyOn(actions, 'lookupOrderAction').mockResolvedValue({
      success: true,
      data: mockTrackedOrder,
    });

    render(<GuestTrackingView />);

    const orderInput = screen.getByPlaceholderText('ORD-YYYYMMDD-XXXXX');
    const phoneInput = screen.getByPlaceholderText('010-0000-0000');
    const form = orderInput.closest('form')!;

    fireEvent.change(orderInput, { target: { value: 'ORD-20260924-999' } });
    fireEvent.change(phoneInput, { target: { value: '010-9876-5432' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/ORD-20260924-999/)).toBeDefined();
      expect(screen.getByText(/초경량 게이밍 마우스/)).toBeDefined();
      expect(screen.getByText('실시간 배송 추적 상세 보기')).toBeDefined();
    });
  });

  it('조회 실패 시 에러 메시지를 표시한다', async () => {
    vi.spyOn(actions, 'lookupOrderAction').mockResolvedValue({
      success: false,
      error: '주문 정보를 찾을 수 없습니다.',
    });

    render(<GuestTrackingView />);

    const orderInput = screen.getByPlaceholderText('ORD-YYYYMMDD-XXXXX');
    const form = orderInput.closest('form')!;

    fireEvent.change(orderInput, { target: { value: 'ORD-INVALID' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('주문 정보를 찾을 수 없습니다.')).toBeDefined();
    });
  });
});

