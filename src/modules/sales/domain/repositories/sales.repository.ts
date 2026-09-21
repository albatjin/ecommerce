import { PeriodType, SalesAnalyticsData } from '../entities/sales-metrics';

export interface ISalesRepository {
  getSalesAnalytics(period?: PeriodType): Promise<SalesAnalyticsData>;
}

