import { describe, it, expect, vi } from 'vitest';
import { GetOrdersUseCase } from '../get-orders.usecase';
import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { Order } from '@/modules/orders/domain/entities/order';

describe('Order Use Cases (Unit Test)', () => {
  const mockOrders = [
    new Order({
      id: 'ord-1',
      orderNumber: 'ORD-20250520-00101',
      customerName: '김민수',
      orderSummary: '헤드폰 외 1건',
      paidAmount: 329000,
      status: 'PAID',
      orderDate: '2025-05-20 14:00',
    }),
  ];

  const mockRepo: OrderRepository = {
    getOrders: vi.fn().mockResolvedValue({
      orders: mockOrders,
      totalCount: 1,
      pendingProcessingCount: 15,
      page: 1,
      pageSize: 8,
      totalPages: 1,
    }),
    getOrderById: vi.fn().mockResolvedValue(mockOrders[0]),
    getOrderDetail: vi.fn().mockResolvedValue(null),
    updateOrderStatus: vi.fn().mockResolvedValue(true),
    updateTrackingInfo: vi.fn().mockResolvedValue(true),
    addCsNote: vi.fn().mockResolvedValue({} as any),
  };

  it('GetOrdersUseCase는 주문 목록과 오늘 처리해야 할 주문 수를 반환한다', async () => {
    const useCase = new GetOrdersUseCase(mockRepo);
    const result = await useCase.execute({ page: 1, pageSize: 8 });

    expect(mockRepo.getOrders).toHaveBeenCalledWith({ page: 1, pageSize: 8 });
    expect(result.totalCount).toBe(1);
    expect(result.pendingProcessingCount).toBe(15);
    expect(result.orders[0].customerName).toBe('김민수');
    expect(result.orders[0].statusLabel).toBe('결제완료');
  });
});
