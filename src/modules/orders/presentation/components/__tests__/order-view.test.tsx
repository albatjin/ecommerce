import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { OrderView } from '../order-view';
import { OrderDto } from '../../../application/dto/order.dto';

const MOCK_ORDERS: OrderDto[] = [
  {
    id: 'ord-01',
    orderNumber: 'ORD-20250520-00192',
    customerName: '김민수',
    orderSummary: '울트라 슬림 16인치 노트북 외 1건',
    paidAmount: 1735000,
    status: 'PAID',
    statusLabel: '결제완료',
    statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    orderDate: '2025-05-20 14:30',
    recipientPhone: '010-3841-9921',
    shippingAddress: '서울특별시 강남구 테헤란로 152',
  },
  {
    id: 'ord-02',
    orderNumber: 'ORD-20250520-00191',
    customerName: '이서연',
    orderSummary: '프리미엄 캐시미어 블렌드 싱글 코트',
    paidAmount: 249000,
    status: 'PAYMENT_PENDING',
    statusLabel: '결제대기',
    statusBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    orderDate: '2025-05-20 13:15',
  },
  {
    id: 'ord-03',
    orderNumber: 'ORD-20250520-00190',
    customerName: '박준영',
    orderSummary: '기계식 무접점 게이밍 키보드',
    paidAmount: 149000,
    status: 'SHIPPING',
    statusLabel: '배송중',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    orderDate: '2025-05-20 11:45',
  },
  {
    id: 'ord-04',
    orderNumber: 'ORD-20250519-00189',
    customerName: '최유나',
    orderSummary: '청송 프리미엄 GAP 유기농 꿀사과 5kg',
    paidAmount: 36000,
    status: 'DELIVERED',
    statusLabel: '배송완료',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orderDate: '2025-05-19 18:20',
  },
];

describe('OrderView Component (Integration Test)', () => {
  it('제목 "주문 관리"와 상태별 탭 버튼 및 하단 15건 안내 배너를 올바르게 렌더링한다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} pendingProcessingCount={15} />);

    expect(screen.getByRole('heading', { name: '주문 관리' })).toBeDefined();

    // 상태별 탭 버튼
    expect(screen.getByRole('button', { name: /전체/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /결제대기/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /결제완료/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /배송중/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /배송완료/i })).toBeDefined();

    // 하단 안내 배너
    expect(screen.getByText(/오늘 처리해야 할 주문:/i)).toBeDefined();
    expect(screen.getByText('15건')).toBeDefined();
  });

  it('요구 명세에 정의된 상태 배지 색상을 올바르게 렌더링한다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    const table = screen.getByRole('table');

    // 결제대기: 노랑
    const pendingBadge = within(table).getByText('결제대기');
    expect(pendingBadge.className).toContain('text-amber-700');

    // 결제완료: 파랑
    const paidBadge = within(table).getByText('결제완료');
    expect(paidBadge.className).toContain('text-blue-700');

    // 배송중: 보라
    const shippingBadge = within(table).getByText('배송중');
    expect(shippingBadge.className).toContain('text-purple-700');

    // 배송완료: 초록
    const deliveredBadge = within(table).getByText('배송완료');
    expect(deliveredBadge.className).toContain('text-emerald-700');
  });

  it('상태별 탭 클릭 시 해당 상태의 주문만 필터링된다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    const shippingTab = screen.getByRole('button', { name: /배송중/i });
    fireEvent.click(shippingTab);

    expect(screen.getByText('박준영')).toBeDefined();
    expect(screen.queryByText('김민수')).toBeNull();
    expect(screen.queryByText('최유나')).toBeNull();
  });

  it('검색창에 고객명 또는 주문번호 입력 시 실시간 필터링된다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    const searchInput = screen.getByPlaceholderText(/주문번호 또는 고객명 검색/i);
    fireEvent.change(searchInput, { target: { value: '최유나' } });

    expect(screen.getByText('최유나')).toBeDefined();
    expect(screen.queryByText('김민수')).toBeNull();
  });

  it('날짜 범위를 선택하여 해당 기간의 주문만 필터링할 수 있다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    const startInput = screen.getByLabelText('시작일');
    const endInput = screen.getByLabelText('종료일');

    fireEvent.change(startInput, { target: { value: '2025-05-19' } });
    fireEvent.change(endInput, { target: { value: '2025-05-19' } });

    expect(screen.getByText('최유나')).toBeDefined();
    expect(screen.queryByText('김민수')).toBeNull();
  });

  it('주문 행 클릭 시 상세 모달이 열리고 닫기 버튼으로 닫힌다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    // 김민수 주문 행 클릭
    const orderRowText = screen.getByText('ORD-20250520-00192');
    fireEvent.click(orderRowText);

    expect(screen.getByRole('heading', { name: '주문 상세 정보' })).toBeDefined();
    expect(screen.getByText('010-3841-9921')).toBeDefined();
    expect(screen.getByText('서울특별시 강남구 테헤란로 152')).toBeDefined();

    // 닫기 버튼 클릭
    const closeBtn = screen.getByLabelText('닫기');
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('heading', { name: '주문 상세 정보' })).toBeNull();
  });

  it('필터 초기화 버튼 클릭 시 모든 필터가 리셋된다', () => {
    render(<OrderView initialOrders={MOCK_ORDERS} />);

    const searchInput = screen.getByPlaceholderText(/주문번호 또는 고객명 검색/i);
    fireEvent.change(searchInput, { target: { value: '최유나' } });

    const resetBtn = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetBtn);

    expect(searchInput).toHaveProperty('value', '');
    expect(screen.getByText('김민수')).toBeDefined();
  });
});
