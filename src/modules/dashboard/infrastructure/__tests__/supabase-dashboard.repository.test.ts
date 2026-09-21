import { describe, it, expect, vi } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseDashboardRepository } from '../supabase-dashboard.repository';

describe('SupabaseDashboardRepository (Unit Test)', () => {
  it('클라이언트가 없을 때 기본 Mock 데이터를 반환한다', async () => {
    const repo = new SupabaseDashboardRepository();
    const result = await repo.getDashboardData();

    expect(result.metrics.todaySales).toBe(14280000);
    expect(result.weeklySales.length).toBe(7);
    expect(result.categoryRatios.length).toBe(4);
    expect(result.recentOrders.length).toBe(5);
  });

  it('RPC 호출 성공 시 Supabase 응답 지표를 엔티티로 매핑한다', async () => {
    const mockSupabase = {
      rpc: vi.fn().mockResolvedValue({
        data: {
          today_sales: 20000000,
          sales_diff_rate: 25.5,
          today_orders: 500,
          orders_diff: 50,
          today_customers: 400,
          customers_diff: 30,
          low_stock_products: 15,
        },
        error: null,
      }),
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: 'ord-100',
                  order_number: 'ORD-TEST-001',
                  order_name: '테스트 상품',
                  total_paid_amount: 50000,
                  status: 'PAID',
                  created_at: new Date().toISOString(),
                  users: { name: '홍길동' },
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    };

    const repo = new SupabaseDashboardRepository(mockSupabase as unknown as SupabaseClient);
    const result = await repo.getDashboardData();

    expect(result.metrics.todaySales).toBe(20000000);
    expect(result.metrics.salesDiffRate).toBe(25.5);
    expect(result.recentOrders[0].orderNumber).toBe('ORD-TEST-001');
    expect(result.recentOrders[0].customerName).toBe('홍길동');
  });

  it('Supabase RPC 오류 발생 시 안전하게 기본 폴백 데이터를 반환한다', async () => {
    const mockSupabase = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('RPC Failed'),
      }),
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    };

    const repo = new SupabaseDashboardRepository(mockSupabase as unknown as SupabaseClient);
    const result = await repo.getDashboardData();

    expect(result.metrics.todaySales).toBe(14280000);
  });
});

