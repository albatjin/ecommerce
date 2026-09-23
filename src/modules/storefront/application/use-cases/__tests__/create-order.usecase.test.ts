import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateOrderUseCase, CreateOrderInput } from '../create-order.usecase';
import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { Order, OrderDetail } from '@/modules/orders/domain/entities/order';

describe('CreateOrderUseCase (Unit Test)', () => {
  let mockOrderRepository: OrderRepository;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    mockOrderRepository = {
      getOrders: vi.fn(),
      getOrderById: vi.fn(),
      getOrderDetail: vi.fn(),
      createOrder: vi.fn().mockImplementation(async (order: Order, _detail: OrderDetail) => order),
      updateOrderStatus: vi.fn(),
      updateTrackingInfo: vi.fn(),
      addCsNote: vi.fn(),
    };
    useCase = new CreateOrderUseCase(mockOrderRepository);
  });

  const validOrderInput: CreateOrderInput = {
    shipping: {
      recipientName: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 서초구 강남대로 123',
      zipcode: '06543',
      memo: '문 앞에 놓아주세요',
    },
    payment: {
      method: 'CREDIT_CARD',
      methodLabel: '신용카드 (현대카드)',
      installment: '일시불',
    },
    items: [
      {
        productId: 'prod-01',
        productCode: 'PROD-001',
        name: '오버핏 울 니트',
        price: 89000,
        quantity: 2,
        imageUrl: '/test.png',
        category: '상의',
      },
      {
        productId: 'prod-02',
        productCode: 'PROD-002',
        name: '와이드 슬랙스',
        price: 59000,
        quantity: 1,
        imageUrl: '/test2.png',
        category: '하의',
      },
    ],
  };

  it('주문 생성 입력이 올바르면 정상적으로 주문이 생성되고 저장된다', async () => {
    const result = await useCase.execute(validOrderInput);

    expect(result).toBeDefined();
    expect(result.orderNumber).toMatch(/^ORD-\d{8}-\d{5}$/);
    expect(result.customerName).toBe('홍길동');
    expect(result.orderSummary).toBe('오버핏 울 니트 외 1건');
    expect(result.paidAmount).toBe(89000 * 2 + 59000);
    expect(result.itemCount).toBe(3);
    expect(result.paymentMethod).toBe('신용카드 (현대카드)');

    expect(mockOrderRepository.createOrder).toHaveBeenCalledTimes(1);
    const [savedOrder, savedDetail] = (mockOrderRepository.createOrder as any).mock.calls[0];
    expect(savedOrder.status).toBe('PAID');
    expect(savedDetail.items).toHaveLength(2);
    expect(savedDetail.shipping.recipientName).toBe('홍길동');
    expect(savedDetail.payment.finalPaidAmount).toBe(237000);
  });

  it('장바구니 아이템이 비어있으면 에러를 던진다', async () => {
    const invalidInput = {
      ...validOrderInput,
      items: [],
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow('주문할 상품이 없습니다.');
    expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
  });

  it('배송지 필수 정보(이름, 연락처, 주소) 누락 시 에러를 던진다', async () => {
    const invalidInput = {
      ...validOrderInput,
      shipping: {
        recipientName: '',
        phone: '010-1234-5678',
        address: '',
        zipcode: '06543',
      },
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow('배송지 정보를 모두 입력해 주세요.');
    expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
  });
});

