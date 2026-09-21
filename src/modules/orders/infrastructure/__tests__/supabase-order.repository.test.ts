import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseOrderRepository } from '../supabase-order.repository';

describe('SupabaseOrderRepository (Unit/Integration Test)', () => {
  let repository: SupabaseOrderRepository;

  beforeEach(() => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: null, error: new Error('Offline fallback') }),
      }),
    };
    repository = new SupabaseOrderRepository(mockSupabase as any);
  });

  it('기본 8개 주문 목록과 "오늘 처리해야 할 주문: 15건" 카운트를 반환한다', async () => {
    const result = await repository.getOrders({ page: 1, pageSize: 8 });

    expect(result.orders.length).toBe(8);
    expect(result.pendingProcessingCount).toBe(15);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(8);
  });

  it('상태별 탭("결제대기", "결제완료", "배송중", "배송완료")으로 필터링할 수 있다', async () => {
    const pendingResult = await repository.getOrders({ statusTab: '결제대기' });
    expect(pendingResult.orders.every((o) => o.statusLabel === '결제대기')).toBe(true);

    const paidResult = await repository.getOrders({ statusTab: '결제완료' });
    expect(paidResult.orders.every((o) => o.statusLabel === '결제완료')).toBe(true);

    const shippingResult = await repository.getOrders({ statusTab: '배송중' });
    expect(shippingResult.orders.every((o) => o.statusLabel === '배송중')).toBe(true);

    const deliveredResult = await repository.getOrders({ statusTab: '배송완료' });
    expect(deliveredResult.orders.every((o) => o.statusLabel === '배송완료')).toBe(true);
  });

  it('주문번호 및 고객명으로 검색할 수 있다', async () => {
    const searchByCustomer = await repository.getOrders({ searchQuery: '김민수' });
    expect(searchByCustomer.orders.some((o) => o.customerName === '김민수')).toBe(true);

    const searchByOrderNum = await repository.getOrders({ searchQuery: 'ORD-20250520-00192' });
    expect(searchByOrderNum.orders.some((o) => o.orderNumber === 'ORD-20250520-00192')).toBe(true);
  });

  it('날짜 범위(시작일~종료일)로 필터링할 수 있다', async () => {
    const dateResult = await repository.getOrders({
      startDate: '2025-05-19',
      endDate: '2025-05-20',
    });
    expect(dateResult.orders.every((o) => o.orderDate >= '2025-05-19')).toBe(true);
  });

  it('ID로 특정 주문을 조회할 수 있다', async () => {
    const order = await repository.getOrderById('ord-01');
    expect(order).not.toBeNull();
    expect(order?.customerName).toBe('김민수');

    const notFound = await repository.getOrderById('non-existent');
    expect(notFound).toBeNull();
  });
});

