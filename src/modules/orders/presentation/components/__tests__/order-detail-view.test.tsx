import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OrderDetailView } from '../order-detail-view';
import { OrderDetail } from '../../../domain/entities/order';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('OrderDetailView Component', () => {
  const mockOrderDetail = new OrderDetail({
    id: 'ord-01',
    orderNumber: 'ORD-20250520-00192',
    displayTitle: '주문 #1234',
    status: 'PREPARING',
    orderDate: '2025-05-20 14:18:04',
    paidDate: '2025-05-20 14:22:15',
    estimatedShippingTime: '오늘 18:30 이전',
    items: [
      {
        id: 'item-01',
        productName: '프리미엄 오버핏 캐시미어 코트',
        categoryTag: 'FW 프리미엄 라인업',
        option: '차콜 (Charcoal) / Size L (105)',
        sku: 'COAT-CASH-CH-L',
        unitPrice: 189000,
        quantity: 1,
        couponDiscount: 10000,
        shippingFee: 0,
        subtotal: 179000,
      },
    ],
    payment: {
      totalProductAmount: 189000,
      couponDiscount: 10000,
      pointUsed: 2000,
      shippingFee: 0,
      finalPaidAmount: 177000,
      paymentMethod: '신용카드 (현대카드)',
      installment: '12개월 무이자',
      approvedAt: '2025-05-20 14:22:15',
    },
    shipping: {
      recipientName: '김민서',
      isDefaultAddress: true,
      phone: '010-8921-3342',
      address: '서울특별시 강남구 테헤란로 152 강남파이낸스센터 14층 (역삼동)',
      zipcode: '06236',
      memo: '문 앞에 두고 벨 눌러주세요',
      trackingCompany: 'CJ대한통운 (택배)',
      trackingNumber: '689124409121',
    },
    customer: {
      id: 'cust-kim',
      name: '김민서',
      email: 'minseo.kim@gmail.com',
      phone: '010-8921-3342',
      membershipGrade: 'VIP 회원',
      totalOrders: 8,
      totalSpent: 1420000,
      rewardPoints: 3450,
      pointsUsedThisOrder: 2000,
    },
    csNotes: [
      {
        id: 'note-01',
        author: '김윤영 (물류 담당)',
        content: '코트 패킹 완료 후 특수 보호 비닐 포장 적용.',
        isSystem: false,
        createdAt: '2025-05-20 15:10',
      },
    ],
    navigation: {
      prevOrderId: 'ord-02',
      nextOrderId: 'ord-03',
    },
  });

  it('상단: 제목 "주문 #1234", 이전/목록/다음 버튼을 올바르게 렌더링한다', () => {
    render(<OrderDetailView order={mockOrderDetail} />);

    expect(screen.getByText(/주문 #1234/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /이전/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '목록' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /다음/ })).toBeInTheDocument();
  });

  it('주문상태 진행바: 5단계를 렌더링하고 상품준비(3단계)까지 활성화 상태를 표시한다', () => {
    render(<OrderDetailView order={mockOrderDetail} />);

    expect(screen.getByText('배송 진행 현황')).toBeInTheDocument();
    expect(screen.getAllByText('결제대기').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('결제완료').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('상품준비').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('배송중').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('배송완료').length).toBeGreaterThanOrEqual(1);
  });

  it('2열 레이아웃: 주문 상품, 배송 정보, 결제 상세, 주문자 정보 카드를 렌더링한다', () => {
    render(<OrderDetailView order={mockOrderDetail} />);

    // 주문 상품 카드
    expect(screen.getByText(/프리미엄 오버핏 캐시미어 코트/)).toBeInTheDocument();
    expect(screen.getByText(/차콜 \(Charcoal\)/)).toBeInTheDocument();

    // 배송 정보 카드
    expect(screen.getByText(/문 앞에 두고 벨 눌러주세요/)).toBeInTheDocument();
    expect(screen.getByText(/강남파이낸스센터/)).toBeInTheDocument();

    // 운송장 입력 카드
    expect(screen.getByDisplayValue('689124409121')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '송장 등록/수정' })).toBeInTheDocument();

    // 결제 금액 상세 카드 (주문 정보)
    expect(screen.getByText('결제 금액 상세')).toBeInTheDocument();
    expect(screen.getAllByText('₩177,000').length).toBeGreaterThanOrEqual(1);

    // 고객 정보 카드
    expect(screen.getByText('주문자 정보')).toBeInTheDocument();
    expect(screen.getByText('minseo.kim@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('VIP 회원')).toBeInTheDocument();
  });

  it('하단 버튼: 주문 취소(빨간색) 및 상태 변경 드롭다운과 저장 버튼이 정상 작동한다', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onCancelMock = vi.fn();
    const onStatusChangeMock = vi.fn();

    render(
      <OrderDetailView
        order={mockOrderDetail}
        onCancelOrder={onCancelMock}
        onStatusSave={onStatusChangeMock}
      />
    );

    // 주문 취소 버튼
    const cancelBtn = screen.getByRole('button', { name: '주문 취소' });
    expect(cancelBtn).toHaveClass('bg-red-600');
    fireEvent.click(cancelBtn);
    expect(onCancelMock).toHaveBeenCalled();

    // 상태 변경 드롭다운 & 저장 버튼
    const select = screen.getByRole('combobox', { name: /주문 상태 변경/ });
    fireEvent.change(select, { target: { value: 'SHIPPING' } });

    const saveBtn = screen.getByRole('button', { name: '상태 저장' });
    fireEvent.click(saveBtn);
    expect(onStatusChangeMock).toHaveBeenCalledWith('SHIPPING');
  });
});
