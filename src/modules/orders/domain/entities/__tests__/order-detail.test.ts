import { describe, it, expect } from 'vitest';
import {
  getOrderStepIndex,
  ORDER_PROGRESS_STEPS,
  OrderDetail,
  OrderStatus,
} from '../order';

describe('Order Detail Domain Entity and Stepper Logic', () => {
  it('should define 5 order progress steps in the correct order', () => {
    expect(ORDER_PROGRESS_STEPS).toHaveLength(5);
    expect(ORDER_PROGRESS_STEPS.map((s) => s.label)).toEqual([
      '결제대기',
      '결제완료',
      '상품준비',
      '배송중',
      '배송완료',
    ]);
  });

  it('should return correct step indices for statuses', () => {
    expect(getOrderStepIndex('PAYMENT_PENDING')).toBe(0);
    expect(getOrderStepIndex('PAID')).toBe(1);
    expect(getOrderStepIndex('PREPARING')).toBe(2);
    expect(getOrderStepIndex('SHIPPING')).toBe(3);
    expect(getOrderStepIndex('DELIVERED')).toBe(4);
    expect(getOrderStepIndex('CANCELLED')).toBe(-1);
  });

  it('should instantiate OrderDetail with valid properties and calculate totals', () => {
    const detail = new OrderDetail({
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
          imageUrl: '/coat.jpg',
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

    expect(detail.statusLabel).toBe('상품준비');
    expect(detail.currentStepIndex).toBe(2);
    expect(detail.items).toHaveLength(1);
    expect(detail.payment.finalPaidAmount).toBe(177000);
    expect(detail.displayTitle).toBe('주문 #1234');
    expect(detail.customer.name).toBe('김민서');
  });
});

