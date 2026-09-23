import { describe, it, expect, vi } from 'vitest';
import { GetMyOrdersUseCase } from '../get-my-orders.usecase';
import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { Order } from '@/modules/orders/domain/entities/order';

describe('GetMyOrdersUseCase', () => {
  const mockOrders = [
    new Order({
      id: 'order-1',
      orderNumber: 'ORD-20260924-001',
      customerName: '홍길동',
      orderDate: '2026-09-24 10:00',
      paidAmount: 54000,
      orderSummary: '프리미엄 무선 헤드폰 외 1건',
      status: 'SHIPPING',
      shippingAddress: '서울시 강남구 테헤란로 123',
      recipientPhone: '010-1234-5678',
    }),
    new Order({
      id: 'order-2',
      orderNumber: 'ORD-20260924-002',
      customerName: '홍길동',
      orderDate: '2026-09-23 15:30',
      paidAmount: 120000,
      orderSummary: '기계식 키보드',
      status: 'DELIVERED',
      shippingAddress: '서울시 강남구 테헤란로 123',
      recipientPhone: '010-1234-5678',
    }),
  ];

  it('주문 목록과 총 건수를 정상적으로 DTO로 변환하여 반환한다', async () => {
    const mockRepo: OrderRepository = {
      getOrders: vi.fn().mockResolvedValue({
        orders: mockOrders,
        totalCount: 2,
        pendingProcessingCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      }),
      getOrderById: vi.fn(),
      getOrderDetail: vi.fn(),
      updateOrderStatus: vi.fn(),
      updateTrackingInfo: vi.fn(),
      addCsNote: vi.fn(),
      createOrder: vi.fn(),
    };

    const useCase = new GetMyOrdersUseCase(mockRepo);
    const result = await useCase.execute();

    expect(mockRepo.getOrders).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
    });
    expect(result.totalCount).toBe(2);
    expect(result.orders).toHaveLength(2);
    expect(result.orders[0].id).toBe('order-1');
    expect(result.orders[0].orderNumber).toBe('ORD-20260924-001');
    expect(result.orders[0].status).toBe('SHIPPING');
    expect(result.orders[0].statusLabel).toBe('배송중');
    expect(result.orders[1].status).toBe('DELIVERED');
  });
});

