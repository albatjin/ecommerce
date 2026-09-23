import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckoutView } from '../checkout-view';
import * as cartContextModule from '../../context/cart-context';
import * as orderActionsModule from '../../../application/actions/order.actions';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('../../../application/actions/order.actions', () => ({
  createOrderAction: vi.fn(),
}));

describe('CheckoutView (Presentation Test)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('선택된 장바구니 상품이 없으면 장바구니 복귀 안내를 렌더링한다', () => {
    vi.spyOn(cartContextModule, 'useCart').mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      toggleSelect: vi.fn(),
      toggleSelectAll: vi.fn(),
      removeSelected: vi.fn(),
      clearCart: vi.fn(),
      totalItemCount: 0,
      selectedItemCount: 0,
      totalRegularPrice: 0,
      totalSalePrice: 0,
      totalDiscount: 0,
      shippingFee: 0,
      finalPaymentAmount: 0,
      isAllSelected: false,
      isLoaded: true,
      addItem: vi.fn(),
    });

    render(<CheckoutView />);

    expect(screen.getByText('주문할 상품이 없습니다')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /장바구니로 돌아가기/i })).toBeInTheDocument();
  });

  it('선택된 상품이 있을 때 배송지 정보, 결제 수단, 상품 요약 및 결제 금액을 올바르게 렌더링한다', () => {
    vi.spyOn(cartContextModule, 'useCart').mockReturnValue({
      items: [
        {
          productId: 'prod-01',
          productCode: 'PROD-001',
          name: '프리미엄 캐시미어 코트',
          regularPrice: 200000,
          price: 180000,
          quantity: 1,
          discountRate: 10,
          stockQuantity: 10,
          maxOrderQuantity: 5,
          selected: true,
          category: '아우터',
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      toggleSelect: vi.fn(),
      toggleSelectAll: vi.fn(),
      removeSelected: vi.fn(),
      clearCart: vi.fn(),
      totalItemCount: 1,
      selectedItemCount: 1,
      totalRegularPrice: 200000,
      totalSalePrice: 180000,
      totalDiscount: 20000,
      shippingFee: 0,
      finalPaymentAmount: 180000,
      isAllSelected: true,
      isLoaded: true,
      addItem: vi.fn(),
    });

    render(<CheckoutView />);

    expect(screen.getByText('주문서 작성')).toBeInTheDocument();
    expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-1234-5678')).toBeInTheDocument();
    expect(screen.getByText('신용 / 체크카드')).toBeInTheDocument();
    expect(screen.getByText('카카오페이')).toBeInTheDocument();
    expect(screen.getByText('프리미엄 캐시미어 코트')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /180,000원 결제하기/i })).toBeInTheDocument();
  });

  it('결제하기 클릭 시 createOrderAction을 호출하고 성공 시 완료 페이지로 이동한다', async () => {
    const mockRemoveSelected = vi.fn();
    vi.spyOn(cartContextModule, 'useCart').mockReturnValue({
      items: [
        {
          productId: 'prod-01',
          productCode: 'PROD-001',
          name: '프리미엄 캐시미어 코트',
          regularPrice: 180000,
          price: 180000,
          quantity: 1,
          discountRate: 0,
          stockQuantity: 10,
          maxOrderQuantity: 5,
          selected: true,
          category: '아우터',
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      toggleSelect: vi.fn(),
      toggleSelectAll: vi.fn(),
      removeSelected: mockRemoveSelected,
      clearCart: vi.fn(),
      totalItemCount: 1,
      selectedItemCount: 1,
      totalRegularPrice: 180000,
      totalSalePrice: 180000,
      totalDiscount: 0,
      shippingFee: 0,
      finalPaymentAmount: 180000,
      isAllSelected: true,
      isLoaded: true,
      addItem: vi.fn(),
    });

    (orderActionsModule.createOrderAction as any).mockResolvedValue({
      success: true,
      data: {
        id: 'ord-999',
        orderNumber: 'ORD-20260924-12345',
        orderSummary: '프리미엄 캐시미어 코트',
        paidAmount: 180000,
        orderDate: '2026-09-24 15:30',
        customerName: '홍길동',
        shippingAddress: '서울특별시 강남구 테헤란로 152 14층 강남파이낸스센터',
        paymentMethod: '신용카드 (현대카드 / 일시불)',
        itemCount: 1,
      },
    });

    render(<CheckoutView />);

    const submitBtn = screen.getByRole('button', { name: /180,000원 결제하기/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(orderActionsModule.createOrderAction).toHaveBeenCalledTimes(1);
      expect(mockRemoveSelected).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/success?orderNumber=ORD-20260924-12345')
      );
    });
  });

  it('PayPal 결제 수단 선택 시 글로벌 결제 안내가 노출되고 PayPal로 주문이 생성된다', async () => {
    const mockRemoveSelected = vi.fn();
    vi.spyOn(cartContextModule, 'useCart').mockReturnValue({
      items: [
        {
          productId: 'prod-01',
          productCode: 'PROD-001',
          name: '프리미엄 캐시미어 코트',
          regularPrice: 180000,
          price: 180000,
          quantity: 1,
          discountRate: 0,
          stockQuantity: 10,
          maxOrderQuantity: 5,
          selected: true,
          category: '아우터',
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      toggleSelect: vi.fn(),
      toggleSelectAll: vi.fn(),
      removeSelected: mockRemoveSelected,
      clearCart: vi.fn(),
      totalItemCount: 1,
      selectedItemCount: 1,
      totalRegularPrice: 180000,
      totalSalePrice: 180000,
      totalDiscount: 0,
      shippingFee: 0,
      finalPaymentAmount: 180000,
      isAllSelected: true,
      isLoaded: true,
      addItem: vi.fn(),
    });

    (orderActionsModule.createOrderAction as any).mockResolvedValue({
      success: true,
      data: {
        id: 'ord-paypal-1',
        orderNumber: 'ORD-20260924-55443',
        orderSummary: '프리미엄 캐시미어 코트',
        paidAmount: 180000,
        orderDate: '2026-09-24 15:40',
        customerName: '홍길동',
        shippingAddress: '서울특별시 강남구 테헤란로 152 14층 강남파이낸스센터',
        paymentMethod: 'PayPal (글로벌 간편결제)',
        itemCount: 1,
      },
    });

    render(<CheckoutView />);

    // 1. PayPal 라디오 선택
    const paypalRadio = screen.getByLabelText(/PayPal/i);
    fireEvent.click(paypalRadio);

    // 2. PayPal 글로벌 결제 안내 문구 노출 확인
    expect(screen.getByText('PayPal 글로벌 결제 지원')).toBeInTheDocument();
    expect(screen.getByText(/USD \(기준환율 1,350원\)/i)).toBeInTheDocument();

    // 3. 결제하기 버튼 클릭
    const submitBtn = screen.getByRole('button', { name: /PayPal로 180,000원/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(orderActionsModule.createOrderAction).toHaveBeenCalledWith(
        expect.objectContaining({
          payment: expect.objectContaining({
            method: 'PAYPAL',
            methodLabel: 'PayPal (글로벌 간편결제)',
          }),
        })
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('orderNumber=ORD-20260924-55443')
      );
    });
  });
});

