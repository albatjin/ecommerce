import { describe, it, expect } from 'vitest';
import { SupabaseOrderRepository } from '../supabase-order.repository';

describe('SupabaseOrderRepository - Order Detail', () => {
  const mockSupabase: any = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  };

  it('should return seed order detail for ord-01 or ORD-20250520-00192', async () => {
    const repository = new SupabaseOrderRepository(mockSupabase);
    const order = await repository.getOrderDetail('ord-01');

    expect(order).not.toBeNull();
    expect(order?.orderNumber).toBe('ORD-20250520-00192');
    expect(order?.customer.name).toBe('김민서');
    expect(order?.status).toBe('PREPARING');
    expect(order?.payment.finalPaidAmount).toBe(177000);
    expect(order?.items[0].productName).toContain('캐시미어 코트');
  });

  it('should allow updating order status', async () => {
    const repository = new SupabaseOrderRepository(mockSupabase);
    const success = await repository.updateOrderStatus('ord-01', 'SHIPPING');

    expect(success).toBe(true);
    const updated = await repository.getOrderDetail('ord-01');
    expect(updated?.status).toBe('SHIPPING');
  });

  it('should allow updating tracking info', async () => {
    const repository = new SupabaseOrderRepository(mockSupabase);
    const success = await repository.updateTrackingInfo('ord-01', '우체국택배', '1234567890');

    expect(success).toBe(true);
    const updated = await repository.getOrderDetail('ord-01');
    expect(updated?.shipping.trackingCompany).toBe('우체국택배');
    expect(updated?.shipping.trackingNumber).toBe('1234567890');
  });

  it('should allow adding CS memo', async () => {
    const repository = new SupabaseOrderRepository(mockSupabase);
    const memo = await repository.addCsNote('ord-01', '관리자', '새로운 메모입니다.');

    expect(memo.content).toBe('새로운 메모입니다.');
    const updated = await repository.getOrderDetail('ord-01');
    expect(updated?.csNotes.some((n) => n.content === '새로운 메모입니다.')).toBe(true);
  });
});

