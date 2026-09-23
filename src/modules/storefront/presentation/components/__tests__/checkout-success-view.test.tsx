import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckoutSuccessView } from '../checkout-success-view';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      const params: Record<string, string> = {
        orderNumber: 'ORD-20260924-99881',
        paidAmount: '240000',
        orderSummary: '고급 울 코트 외 1건',
        recipientName: '이지은',
        shippingAddress: '서울특별시 마포구 월드컵북로 400',
        paymentMethod: '카카오페이 (간편결제)',
      };
      return params[key] || null;
    },
  }),
}));

describe('CheckoutSuccessView (Presentation Test)', () => {
  it('주문 번호, 결제 금액, 배송지 주소 및 링크를 정상적으로 렌더링한다', () => {
    render(<CheckoutSuccessView />);

    expect(screen.getByText('주문이 정상적으로 완료되었습니다!')).toBeInTheDocument();
    expect(screen.getByText('ORD-20260924-99881')).toBeInTheDocument();
    expect(screen.getByText('240,000원')).toBeInTheDocument();
    expect(screen.getByText('고급 울 코트 외 1건')).toBeInTheDocument();
    expect(screen.getByText('이지은')).toBeInTheDocument();
    expect(screen.getByText('서울특별시 마포구 월드컵북로 400')).toBeInTheDocument();
    expect(screen.getByText('카카오페이 (간편결제)')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /쇼핑 계속하기/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /관리자 주문 내역에서 확인/i })).toBeInTheDocument();
  });
});

