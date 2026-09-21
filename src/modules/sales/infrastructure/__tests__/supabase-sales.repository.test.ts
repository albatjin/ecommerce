import { describe, it, expect } from 'vitest';
import { SupabaseSalesRepository } from '../supabase-sales.repository';

describe('SupabaseSalesRepository', () => {
  it('should return default mock data when no supabase client is provided', async () => {
    const repository = new SupabaseSalesRepository();
    const data = await repository.getSalesAnalytics('this_month');

    expect(data).toBeDefined();
    expect(data.metrics.totalSales).toBe(128450000);
    expect(data.metrics.orderCount).toBe(1840);
    expect(data.metrics.averageOrderValue).toBe(69800);
    expect(data.metrics.conversionRate).toBe(3.42);

    // 1~30 days daily sales trend
    expect(data.dailyTrends.length).toBe(30);
    expect(data.dailyTrends[0].day).toBe(1);
    expect(data.dailyTrends[29].day).toBe(30);

    // Bestsellers 1~5
    expect(data.bestsellers.length).toBe(5);
    expect(data.bestsellers[0].rank).toBe(1);
    expect(data.bestsellers[4].rank).toBe(5);

    // Regional sales: 서울 45%, 경기 28%, 부산 12%, 기타 15%
    expect(data.regionalSales).toEqual([
      expect.objectContaining({ region: '서울', percentage: 45 }),
      expect.objectContaining({ region: '경기', percentage: 28 }),
      expect.objectContaining({ region: '부산', percentage: 12 }),
      expect.objectContaining({ region: '기타', percentage: 15 }),
    ]);

    // AI insights: exactly 3 statements with bullet points
    expect(data.aiInsights.length).toBe(3);
    expect(data.aiInsights[0].content).toContain('전자 기기 매출이 전월대비 23% 상승했습니다.');
  });

  it('should adapt data according to period "this_week" and "this_quarter"', async () => {
    const repository = new SupabaseSalesRepository();
    const weekData = await repository.getSalesAnalytics('this_week');
    expect(weekData.period).toBe('this_week');

    const quarterData = await repository.getSalesAnalytics('this_quarter');
    expect(quarterData.period).toBe('this_quarter');
  });
});

