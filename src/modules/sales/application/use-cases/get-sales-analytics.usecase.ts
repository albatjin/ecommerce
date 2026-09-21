import { ISalesRepository } from '../../domain/repositories/sales.repository';
import { PeriodType, SalesAnalyticsData } from '../../domain/entities/sales-metrics';

export class GetSalesAnalyticsUseCase {
  constructor(private readonly salesRepository: ISalesRepository) {}

  async execute(period: PeriodType = 'this_month'): Promise<SalesAnalyticsData> {
    return this.salesRepository.getSalesAnalytics(period);
  }
}

