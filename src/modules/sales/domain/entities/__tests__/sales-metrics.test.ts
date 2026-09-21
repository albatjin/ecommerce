import { describe, it, expect } from 'vitest';
import {
  SalesKpiMetrics,
  formatSalesCurrency,
  formatPercentDiff,
  DailySalesTrendPoint,
  BestsellerItem,
  RegionalSalesItem,
  AiInsightItem,
} from '../sales-metrics';

describe('SalesMetrics Domain Entities', () => {
  describe('SalesKpiMetrics', () => {
    it('should format total sales and percentage difference correctly', () => {
      const metrics = new SalesKpiMetrics({
        totalSales: 128450000,
        totalSalesDiffRate: 18.4,
        orderCount: 1840,
        orderCountDiffRate: 12.5,
        averageOrderValue: 69800,
        aovDiffRate: 5.2,
        conversionRate: 3.42,
        conversionRateDiffRate: 0.4,
      });

      expect(metrics.formattedTotalSales).toBe('₩128,450,000');
      expect(metrics.formattedTotalSalesDiff).toBe('+18.4%');
      expect(metrics.formattedOrderCount).toBe('1,840건');
      expect(metrics.formattedOrderCountDiff).toBe('+12.5%');
      expect(metrics.formattedAov).toBe('₩69,800');
      expect(metrics.formattedAovDiff).toBe('+5.2%');
      expect(metrics.formattedConversionRate).toBe('3.42%');
      expect(metrics.formattedConversionRateDiff).toBe('+0.4%p');
    });

    it('should handle negative difference rates correctly', () => {
      const metrics = new SalesKpiMetrics({
        totalSales: 95000000,
        totalSalesDiffRate: -4.2,
        orderCount: 1200,
        orderCountDiffRate: -2.1,
        averageOrderValue: 55000,
        aovDiffRate: -1.5,
        conversionRate: 2.8,
        conversionRateDiffRate: -0.3,
      });

      expect(metrics.formattedTotalSalesDiff).toBe('-4.2%');
      expect(metrics.formattedOrderCountDiff).toBe('-2.1%');
      expect(metrics.formattedAovDiff).toBe('-1.5%');
      expect(metrics.formattedConversionRateDiff).toBe('-0.3%p');
    });
  });

  describe('formatSalesCurrency utility', () => {
    it('should format numbers with Korean won prefix and thousand separators', () => {
      expect(formatSalesCurrency(15820000)).toBe('₩15,820,000');
      expect(formatSalesCurrency(0)).toBe('₩0');
    });
  });

  describe('formatPercentDiff utility', () => {
    it('should format positive and negative percentages with signs', () => {
      expect(formatPercentDiff(23.4)).toBe('+23.4%');
      expect(formatPercentDiff(-5.0)).toBe('-5%');
      expect(formatPercentDiff(0)).toBe('0%');
    });
  });
});
