import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RecentOrdersTable } from '../recent-orders-table';
import { RecentOrder } from '../../../domain/entities/dashboard-metrics';

describe('RecentOrdersTable Component (Integration Test)', () => {
  const mockOrders: RecentOrder[] = [
    new RecentOrder({
      id: 'ord-1',
      orderNumber: 'ORD-20250520-001',
      customerName: '김은영',
      productName: '캐시미어 싱글 코트',
      amount: 289000,
      status: 'PAID',
      orderedAt: '10분 전',
    }),
    new RecentOrder({
      id: 'ord-2',
      orderNumber: 'ORD-20250520-002',
      customerName: '이서연',
      productName: '울 슬랙스',
      amount: 89000,
      status: 'PREPARING',
      orderedAt: '25분 전',
    }),
    new RecentOrder({
      id: 'ord-3',
      orderNumber: 'ORD-20250520-003',
      customerName: '박지훈',
      productName: '스니커즈',
      amount: 135000,
      status: 'SHIPPING',
      orderedAt: '42분 전',
    }),
    new RecentOrder({
      id: 'ord-4',
      orderNumber: 'ORD-20250520-004',
      customerName: '정다은',
      productName: '시그니처 향수',
      amount: 128000,
      status: 'DELIVERED',
      orderedAt: '1시간 전',
    }),
    new RecentOrder({
      id: 'ord-5',
      orderNumber: 'ORD-20250520-005',
      customerName: '최유진',
      productName: '기계식 키보드',
      amount: 189000,
      status: 'CANCELLED',
      orderedAt: '2시간 전',
    }),
    new RecentOrder({
      id: 'ord-6',
      orderNumber: 'ORD-20250520-006',
      customerName: '한지수',
      productName: '린넨 침구 커버',
      amount: 98000,
      status: 'RETURNED',
      orderedAt: '3시간 전',
    }),
  ];

  it('컬럼 헤더와 5개 이상 주문 행 및 "전체 보기" 링크를 올바르게 렌더링한다', () => {
    render(<RecentOrdersTable orders={mockOrders} />);

    // 헤더 및 전체 보기 링크
    expect(screen.getByText('최근 주문 목록')).toBeInTheDocument();
    const viewAllLink = screen.getByRole('link', { name: /전체 보기/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/orders');

    // 테이블 컬럼 확인
    expect(screen.getByText('주문번호')).toBeInTheDocument();
    expect(screen.getByText('고객명')).toBeInTheDocument();
    expect(screen.getByText('상품')).toBeInTheDocument();
    expect(screen.getByText('금액')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('시간')).toBeInTheDocument();

    // 행 데이터 확인
    expect(screen.getByText('ORD-20250520-001')).toBeInTheDocument();
    expect(screen.getByText('김은영')).toBeInTheDocument();
    expect(screen.getByText('캐시미어 싱글 코트')).toBeInTheDocument();
    expect(screen.getByText('₩289,000')).toBeInTheDocument();
    expect(screen.getByText('결제완료')).toBeInTheDocument();
    expect(screen.getByText('10분 전')).toBeInTheDocument();

    expect(screen.getByText('ORD-20250520-005')).toBeInTheDocument();
    expect(screen.getByText('취소완료')).toBeInTheDocument();

    expect(screen.getByText('ORD-20250520-006')).toBeInTheDocument();
    expect(screen.getByText('반품완료')).toBeInTheDocument();
  });
});

