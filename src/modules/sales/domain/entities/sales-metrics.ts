export type PeriodType = 'this_week' | 'this_month' | 'this_quarter';

export interface SalesKpiMetricsProps {
  totalSales: number;
  totalSalesDiffRate: number;
  orderCount: number;
  orderCountDiffRate: number;
  averageOrderValue: number;
  aovDiffRate: number;
  conversionRate: number;
  conversionRateDiffRate: number;
}

export function formatSalesCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

export function formatPercentDiff(rate: number): string {
  if (rate === 0) return '0%';
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate}%`;
}

export class SalesKpiMetrics {
  readonly totalSales: number;
  readonly totalSalesDiffRate: number;
  readonly orderCount: number;
  readonly orderCountDiffRate: number;
  readonly averageOrderValue: number;
  readonly aovDiffRate: number;
  readonly conversionRate: number;
  readonly conversionRateDiffRate: number;

  constructor(props: SalesKpiMetricsProps) {
    this.totalSales = props.totalSales;
    this.totalSalesDiffRate = props.totalSalesDiffRate;
    this.orderCount = props.orderCount;
    this.orderCountDiffRate = props.orderCountDiffRate;
    this.averageOrderValue = props.averageOrderValue;
    this.aovDiffRate = props.aovDiffRate;
    this.conversionRate = props.conversionRate;
    this.conversionRateDiffRate = props.conversionRateDiffRate;
  }

  get formattedTotalSales(): string {
    return formatSalesCurrency(this.totalSales);
  }

  get formattedTotalSalesDiff(): string {
    return formatPercentDiff(this.totalSalesDiffRate);
  }

  get formattedOrderCount(): string {
    return `${this.orderCount.toLocaleString('ko-KR')}건`;
  }

  get formattedOrderCountDiff(): string {
    const sign = this.orderCountDiffRate > 0 ? '+' : '';
    return `${sign}${this.orderCountDiffRate}%`;
  }

  get formattedAov(): string {
    return formatSalesCurrency(this.averageOrderValue);
  }

  get formattedAovDiff(): string {
    return formatPercentDiff(this.aovDiffRate);
  }

  get formattedConversionRate(): string {
    return `${this.conversionRate}%`;
  }

  get formattedConversionRateDiff(): string {
    const sign = this.conversionRateDiffRate > 0 ? '+' : '';
    return `${sign}${this.conversionRateDiffRate}%p`;
  }

  toProps(): SalesKpiMetricsProps {
    return {
      totalSales: this.totalSales,
      totalSalesDiffRate: this.totalSalesDiffRate,
      orderCount: this.orderCount,
      orderCountDiffRate: this.orderCountDiffRate,
      averageOrderValue: this.averageOrderValue,
      aovDiffRate: this.aovDiffRate,
      conversionRate: this.conversionRate,
      conversionRateDiffRate: this.conversionRateDiffRate,
    };
  }
}

export interface DailySalesTrendPoint {
  day: number;
  date: string;
  amount: number;
}

export interface BestsellerItem {
  rank: number;
  name: string;
  quantity: number;
  totalAmount: number;
  sku?: string;
  category?: string;
}

export interface RegionalSalesItem {
  region: string;
  percentage: number;
  amount: number;
}

export interface AiInsightItem {
  id: string;
  content: string;
  type?: 'positive' | 'neutral' | 'recommendation';
}

export interface SalesAnalyticsData {
  period: PeriodType;
  metrics: SalesKpiMetrics | SalesKpiMetricsProps;
  dailyTrends: DailySalesTrendPoint[];
  bestsellers: BestsellerItem[];
  regionalSales: RegionalSalesItem[];
  aiInsights: AiInsightItem[];
}

