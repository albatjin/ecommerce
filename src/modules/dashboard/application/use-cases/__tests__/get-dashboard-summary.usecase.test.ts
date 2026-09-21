import { describe, it, expect, vi } from 'vitest';
import { GetDashboardSummaryUseCase } from '../get-dashboard-summary.usecase';
import { IDashboardRepository, DashboardData } from '../../../domain/repositories/dashboard.repository';
import { DashboardMetrics, RecentOrder } from '../../../domain/entities/dashboard-metrics';

describe('GetDashboardSummaryUseCase (Unit Test)', () => {
  const mockDashboardData: DashboardData = {
    metrics: new DashboardMetrics({
      todaySales: 14280000,
      salesDiffRate: 18.4,
      todayOrders: 482,
      ordersDiff: 12,
      todayCustomers: 342,
      customersDiff: 24,
      lowStockProducts: 28,
    }),
    weeklySales: [
      { day: '월', amount: 8200000 },
      { day: '화', amount: 9500000 },
      { day: '수', amount: 7800000 },
      { day: '목', amount: 11200000 },
      { day: '금', amount: 13400000 },
      { day: '토', amount: 16800000 },
      { day: '일', amount: 14280000 },
    ],
    categoryRatios: [
      { category: '패션/의류', percentage: 42, amount: 6000000, color: '#2563eb' },
      { category: '디지털/가전', percentage: 25, amount: 3570000, color: '#3b82f6' },
      { category: '뷰티/코스메틱', percentage: 18, amount: 2570000, color: '#60a5fa' },
      { category: '라이프/홈데코', percentage: 15, amount: 2140000, color: '#93c5fd' },
    ],
    recentOrders: [
      new RecentOrder({
        id: 'ord-1',
        orderNumber: 'ORD-20250520-00192',
        customerName: '김은영',
        productName: '프리미엄 캐시미어 블렌드 싱글 코트 외 1건',
        amount: 289000,
        status: 'PAID',
        orderedAt: '10분 전',
      }),
    ],
  };

  it('대시보드 요약 데이터를 성공적으로 반환한다', async () => {
    const mockRepo: IDashboardRepository = {
      getDashboardData: vi.fn().mockResolvedValue(mockDashboardData),
    };

    const useCase = new GetDashboardSummaryUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toEqual(mockDashboardData);
    expect(mockRepo.getDashboardData).toHaveBeenCalledTimes(1);
  });

  it('저장소 호출 실패 시 에러를 적절히 전파한다', async () => {
    const mockRepo: IDashboardRepository = {
      getDashboardData: vi.fn().mockRejectedValue(new Error('DB Connection Failed')),
    };

    const useCase = new GetDashboardSummaryUseCase(mockRepo);
    await expect(useCase.execute()).rejects.toThrow('DB Connection Failed');
  });
});

