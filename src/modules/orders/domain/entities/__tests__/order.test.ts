import { describe, it, expect } from 'vitest';
import { Order } from '../order';

describe('Order Entity (Unit Test)', () => {
  it('정상적인 주문 엔티티를 생성한다', () => {
    const order = new Order({
      id: 'ord-1',
      orderNumber: 'ORD-20250520-00192',
      customerName: '김민수',
      orderSummary: '울트라 슬림 16인치 노트북 외 1건',
      paidAmount: 1735000,
      status: 'PAID',
      orderDate: '2025-05-20 14:30',
    });

    expect(order.id).toBe('ord-1');
    expect(order.orderNumber).toBe('ORD-20250520-00192');
    expect(order.customerName).toBe('김민수');
    expect(order.statusLabel).toBe('결제완료');
    expect(order.statusBadgeClass).toContain('text-blue-700');
  });

  it('주문 상태별 라벨과 요구된 색상 배지 클래스를 올바르게 반환한다', () => {
    const pendingOrder = new Order({
      id: 'ord-2',
      orderNumber: 'ORD-20250520-00193',
      customerName: '이서연',
      orderSummary: '린넨 셔츠',
      paidAmount: 79000,
      status: 'PAYMENT_PENDING',
      orderDate: '2025-05-20 15:00',
    });
    expect(pendingOrder.statusLabel).toBe('결제대기');
    expect(pendingOrder.statusBadgeClass).toContain('text-amber-700'); // 노랑

    const shippingOrder = new Order({
      id: 'ord-3',
      orderNumber: 'ORD-20250520-00194',
      customerName: '박준영',
      orderSummary: '기계식 키보드',
      paidAmount: 149000,
      status: 'SHIPPING',
      orderDate: '2025-05-20 11:20',
    });
    expect(shippingOrder.statusLabel).toBe('배송중');
    expect(shippingOrder.statusBadgeClass).toContain('text-purple-700'); // 보라

    const deliveredOrder = new Order({
      id: 'ord-4',
      orderNumber: 'ORD-20250520-00195',
      customerName: '최유나',
      orderSummary: '유기농 꿀사과 5kg',
      paidAmount: 36000,
      status: 'DELIVERED',
      orderDate: '2025-05-19 09:10',
    });
    expect(deliveredOrder.statusLabel).toBe('배송완료');
    expect(deliveredOrder.statusBadgeClass).toContain('text-emerald-700'); // 초록
  });

  it('결제 금액이 음수이면 예외를 던진다', () => {
    expect(() => {
      new Order({
        id: 'ord-err',
        orderNumber: 'ORD-ERR',
        customerName: '오류',
        orderSummary: '오류 상품',
        paidAmount: -1000,
        status: 'PAID',
        orderDate: '2025-05-20 10:00',
      });
    }).toThrow('결제 금액은 0원 이상이어야 합니다.');
  });
});

