import { describe, it, expect, vi } from 'vitest';
import { GetOrderDetailUseCase } from '../get-order-detail.usecase';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { OrderDetail } from '../../../domain/entities/order';

describe('GetOrderDetailUseCase', () => {
  const mockOrderDetail = new OrderDetail({
    id: 'ord-01',
    orderNumber: 'ORD-20250520-00192',
    displayTitle: '주문 #1234',
    status: 'PREPARING',
    orderDate: '2025-05-20 14:18:04',
    paidDate: '2025-05-20 14:22:15',
    items: [
      {
        id: 'item-01',
        productName: '프리미엄 오버핏 캐시미어 코트',
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
    },
    shipping: {
      recipientName: '김민서',
      phone: '010-8921-3342',
      address: '서울특별시 강남구 테헤란로 152',
    },
    customer: {
      id: 'cust-kim',
      name: '김민서',
      email: 'minseo.kim@gmail.com',
      phone: '010-8921-3342',
      totalOrders: 8,
      totalSpent: 1420000,
      rewardPoints: 3450,
    },
  });

  const mockRepo: OrderRepository = {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    getOrderDetail: vi.fn().mockImplementation(async (id: string) => {
      if (id === 'ord-01' || id === 'ORD-20250520-00192') {
        return mockOrderDetail;
      }
      return null;
    }),
    updateOrderStatus: vi.fn().mockResolvedValue(true),
    updateTrackingInfo: vi.fn().mockResolvedValue(true),
    addCsNote: vi.fn(),
    createOrder: vi.fn(),
  };

  it('should return order detail when order exists', async () => {
    const useCase = new GetOrderDetailUseCase(mockRepo);
    const result = await useCase.execute('ord-01');

    expect(result).not.toBeNull();
    expect(result?.orderNumber).toBe('ORD-20250520-00192');
    expect(result?.displayTitle).toBe('주문 #1234');
    expect(result?.status).toBe('PREPARING');
    expect(result?.statusLabel).toBe('상품준비');
    expect(result?.customer.name).toBe('김민서');
  });

  it('should return null when order does not exist', async () => {
    const useCase = new GetOrderDetailUseCase(mockRepo);
    const result = await useCase.execute('invalid-id');

    expect(result).toBeNull();
  });
});

