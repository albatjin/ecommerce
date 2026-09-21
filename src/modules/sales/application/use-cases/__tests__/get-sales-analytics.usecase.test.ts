import { describe, it, expect, vi } from 'vitest';
import { GetSalesAnalyticsUseCase } from '../get-sales-analytics.usecase';
import { ISalesRepository } from '../../../domain/repositories/sales.repository';
import { SalesKpiMetrics, SalesAnalyticsData } from '../../../domain/entities/sales-metrics';

describe('GetSalesAnalyticsUseCase', () => {
  const mockData: SalesAnalyticsData = {
    period: 'this_month',
    metrics: new SalesKpiMetrics({
      totalSales: 128450000,
      totalSalesDiffRate: 18.4,
      orderCount: 1840,
      orderCountDiffRate: 12.5,
      averageOrderValue: 69800,
      aovDiffRate: 5.2,
      conversionRate: 3.42,
      conversionRateDiffRate: 0.4,
    }),
    dailyTrends: [
      { day: 1, date: '02.01', amount: 3200000 },
      { day: 2, date: '02.02', amount: 4100000 },
    ],
    bestsellers: [
      { rank: 1, name: '[시그니처] 울 오버핏 테일러드 블레이저', quantity: 312, totalAmount: 40248000 },
    ],
    regionalSales: [
      { region: '서울', percentage: 45, amount: 57802500 },
      { region: '경기', percentage: 28, amount: 35966000 },
      { region: '부산', percentage: 12, amount: 15414000 },
      { region: '기타', percentage: 15, amount: 19267500 },
    ],
    aiInsights: [
      { id: '1', content: '전자 기기 매출이 전월대비 23% 상승했습니다.' },
    ],
  };

  it('should call repository with default period "this_month" and return data', async () => {
    const mockRepo: ISalesRepository = {
      getSalesAnalytics: vi.fn().mockResolvedValue(mockData),
    };

    const useCase = new GetSalesAnalyticsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(mockRepo.getSalesAnalytics).toHaveBeenCalledWith('this_month');
    expect(result.metrics.totalSales).toBe(128450000);
    expect(result.regionalSales.length).toBe(4);
  });

  it('should pass specific period (this_week, this_quarter) to repository', async () => {
    const mockRepo: ISalesRepository = {
      getSalesAnalytics: vi.fn().mockResolvedValue({ ...mockData, period: 'this_week' }),
    };

    const useCase = new GetSalesAnalyticsUseCase(mockRepo);
    const result = await useCase.execute('this_week');

    expect(mockRepo.getSalesAnalytics).toHaveBeenCalledWith('this_week');
    expect(result.period).toBe('this_week');
  });
});
