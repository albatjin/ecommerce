import { describe, it, expect, vi } from 'vitest';
import { TrackOrderUseCase } from '../track-order.usecase';
import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { OrderDetail } from '@/modules/orders/domain/entities/order';

describe('TrackOrderUseCase', () => {
  const mockOrderDetail = new OrderDetail({
    id: 'order-1',
    orderNumber: 'ORD-20260924-001',
    status: 'SHIPPING',
    orderDate: '2026-09-24 10:00',
    paidDate: '2026-09-24 10:01',
    items: [
      {
        id: 'item-1',
        productName: '프리미엄 무선 헤드폰',
        quantity: 1,
        unitPrice: 50000,
        couponDiscount: 0,
        shippingFee: 0,
        subtotal: 50000,
      },
    ],
    payment: {
      totalProductAmount: 50000,
      couponDiscount: 0,
      pointUsed: 0,
      shippingFee: 3000,
      finalPaidAmount: 53000,
      paymentMethod: '신용카드',
      approvedAt: '2026-09-24 10:01',
    },
    shipping: {
      recipientName: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      trackingNumber: 'TRACK-123456',
      trackingCompany: 'CJ대한통운',
    },
    customer: {
      id: 'cust-1',
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      totalOrders: 5,
      totalSpent: 300000,
      rewardPoints: 3450,
    },
  });

  const createMockRepo = (detail: OrderDetail | null = mockOrderDetail): OrderRepository => ({
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    getOrderDetail: vi.fn().mockResolvedValue(detail),
    updateOrderStatus: vi.fn(),
    updateTrackingInfo: vi.fn(),
    addCsNote: vi.fn(),
    createOrder: vi.fn(),
  });

  it('빈 주문번호 입력 시 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new TrackOrderUseCase(mockRepo);

    await expect(useCase.execute({ orderQuery: '' })).rejects.toThrow('주문번호를 입력해 주세요.');
  });

  it('주문이 존재하지 않는 경우 null을 반환한다', async () => {
    const mockRepo = createMockRepo(null);
    const useCase = new TrackOrderUseCase(mockRepo);

    const result = await useCase.execute({ orderQuery: 'ORD-NOT-EXIST' });
    expect(result).toBeNull();
  });

  it('전화번호 없이 회원 조회 시 상세 DTO를 반환한다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new TrackOrderUseCase(mockRepo);

    const result = await useCase.execute({ orderQuery: 'ORD-20260924-001' });

    expect(result).not.toBeNull();
    expect(result?.orderNumber).toBe('ORD-20260924-001');
    expect(result?.shipping.trackingNumber).toBe('TRACK-123456');
    expect(result?.statusLabel).toBe('배송중');
    expect(result?.currentStepIndex).toBe(3); // SHIPPING is step index 3
  });

  it('비회원 전화번호 일치 시 정상 반환한다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new TrackOrderUseCase(mockRepo);

    const result = await useCase.execute({
      orderQuery: 'ORD-20260924-001',
      phone: '01012345678',
    });

    expect(result).not.toBeNull();
    expect(result?.customer.name).toBe('홍길동');
  });

  it('비회원 전화번호 불일치 시 에러를 던진다', async () => {
    const mockRepo = createMockRepo();
    const useCase = new TrackOrderUseCase(mockRepo);

    await expect(
      useCase.execute({
        orderQuery: 'ORD-20260924-001',
        phone: '010-9999-9999',
      })
    ).rejects.toThrow('입력하신 연락처가 주문 정보와 일치하지 않습니다.');
  });
});

