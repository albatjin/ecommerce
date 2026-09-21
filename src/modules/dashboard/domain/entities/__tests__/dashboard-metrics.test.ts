import { describe, it, expect } from 'vitest';
import {
  DashboardMetrics,
  RecentOrder,
  formatCurrency,
} from '../dashboard-metrics';

describe('Dashboard Domain Entities (Unit Test)', () => {
  describe('DashboardMetrics', () => {
    it('지표 데이터를 기반으로 올바른 포맷 문자열을 생성한다', () => {
      const metrics = new DashboardMetrics({
        todaySales: 14280000,
        salesDiffRate: 18.4,
        todayOrders: 482,
        ordersDiff: 12,
        todayCustomers: 342,
        customersDiff: 24,
        lowStockProducts: 28,
      });

      expect(metrics.formattedTodaySales).toBe('₩14,280,000');
      expect(metrics.formattedSalesDiff).toBe('+18.4%');
      expect(metrics.formattedOrdersDiff).toBe('+12건');
      expect(metrics.formattedCustomersDiff).toBe('+24명');
      expect(metrics.hasLowStockWarning).toBe(true);
    });

    it('음수 증감율 및 변화량을 올바르게 포맷팅한다', () => {
      const metrics = new DashboardMetrics({
        todaySales: 8500000,
        salesDiffRate: -5.2,
        todayOrders: 210,
        ordersDiff: -8,
        todayCustomers: 120,
        customersDiff: -3,
        lowStockProducts: 0,
      });

      expect(metrics.formattedSalesDiff).toBe('-5.2%');
      expect(metrics.formattedOrdersDiff).toBe('-8건');
      expect(metrics.formattedCustomersDiff).toBe('-3명');
      expect(metrics.hasLowStockWarning).toBe(false);
    });
  });

  describe('RecentOrder', () => {
    it('주문 상태 코드에 따른 올바른 한국어 라벨과 색상 테마를 반환한다', () => {
      const order = new RecentOrder({
        id: 'ord-1',
        orderNumber: 'ORD-20250520-001',
        customerName: '김민수',
        productName: '캐시미어 싱글 코트',
        amount: 289000,
        status: 'PAID',
        orderedAt: '14:20',
      });

      expect(order.statusLabel).toBe('결제완료');
      expect(order.formattedAmount).toBe('₩289,000');
    });

    it('배송 및 취소 상태 라벨을 올바르게 매핑한다', () => {
      const preparingOrder = new RecentOrder({
        id: 'ord-2',
        orderNumber: 'ORD-20250520-002',
        customerName: '이서연',
        productName: '울 슬랙스',
        amount: 89000,
        status: 'PREPARING',
        orderedAt: '13:50',
      });
      expect(preparingOrder.statusLabel).toBe('배송준비');

      const cancelledOrder = new RecentOrder({
        id: 'ord-3',
        orderNumber: 'ORD-20250520-003',
        customerName: '박지훈',
        productName: '스니커즈',
        amount: 135000,
        status: 'CANCELLED',
        orderedAt: '12:30',
      });
      expect(cancelledOrder.statusLabel).toBe('취소완료');
    });
  });

  describe('formatCurrency', () => {
    it('숫자를 한국 원화 형식으로 포맷팅한다', () => {
      expect(formatCurrency(150000)).toBe('₩150,000');
      expect(formatCurrency(0)).toBe('₩0');
    });
  });
});

