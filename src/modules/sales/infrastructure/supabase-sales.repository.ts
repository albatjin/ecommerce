import { SupabaseClient } from '@supabase/supabase-js';
import { ISalesRepository } from '../domain/repositories/sales.repository';
import {
  PeriodType,
  SalesAnalyticsData,
  SalesKpiMetrics,
  DailySalesTrendPoint,
  BestsellerItem,
  RegionalSalesItem,
  AiInsightItem,
} from '../domain/entities/sales-metrics';

const DAILY_AMOUNTS_30_DAYS = [
  3800000, 4100000, 3950000, 4800000, 5200000, 6800000, 5900000,
  4300000, 4700000, 4500000, 5100000, 5600000, 7200000, 6400000,
  4900000, 5300000, 5100000, 5800000, 6200000, 8100000, 7300000,
  5500000, 5900000, 5700000, 6400000, 6900000, 8900000, 8200000,
  9500000, 10200000,
];

export function generateDailyTrends(scale: number = 1): DailySalesTrendPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const baseAmount = DAILY_AMOUNTS_30_DAYS[index] || 4000000;
    return {
      day,
      date: `02.${String(day).padStart(2, '0')}`,
      amount: Math.round(baseAmount * scale),
    };
  });
}

export const DEFAULT_BESTSELLERS: BestsellerItem[] = [
  {
    rank: 1,
    name: '[시그니처] 울 오버핏 테일러드 블레이저',
    quantity: 312,
    totalAmount: 40248000,
    sku: 'BLZ-2024-WOOL-01',
    category: '패션/의류',
  },
  {
    rank: 2,
    name: '이탈리안 레더 클래식 첼시부츠',
    quantity: 184,
    totalAmount: 23736000,
    sku: 'SHS-ITL-LEATHER-08',
    category: '잡화/슈즈',
  },
  {
    rank: 3,
    name: '하이드라 비타민 앰플 50ml 기획세트',
    quantity: 420,
    totalAmount: 18900000,
    sku: 'COS-HYDRA-SET-03',
    category: '뷰티/코스메틱',
  },
  {
    rank: 4,
    name: '미니멀 티타늄 메탈 크로노 워치',
    quantity: 94,
    totalAmount: 14100000,
    sku: 'ACC-TITAN-WATCH-11',
    category: '디지털/시계',
  },
  {
    rank: 5,
    name: '오가닉 워시드 린넨 베딩 듀벳커버',
    quantity: 88,
    totalAmount: 11440000,
    sku: 'LIV-LINEN-BED-02',
    category: '리빙/홈데코',
  },
];

export const DEFAULT_REGIONAL_SALES: RegionalSalesItem[] = [
  { region: '서울', percentage: 45, amount: 57802500 },
  { region: '경기', percentage: 28, amount: 35966000 },
  { region: '부산', percentage: 12, amount: 15414000 },
  { region: '기타', percentage: 15, amount: 19267500 },
];

export const DEFAULT_AI_INSIGHTS: AiInsightItem[] = [
  {
    id: 'insight-1',
    content: '전자 기기 매출이 전월대비 23% 상승했습니다.',
    type: 'positive',
  },
  {
    id: 'insight-2',
    content: '주말 저녁 시간대(18~22시) 모바일 결제 비중이 68%로 가장 집중되었습니다.',
    type: 'recommendation',
  },
  {
    id: 'insight-3',
    content: '수도권(서울/경기) 주문 비중이 73%를 차지하여 수도권 익일 배송 캐파 확충이 권장됩니다.',
    type: 'recommendation',
  },
];

export class SupabaseSalesRepository implements ISalesRepository {
  constructor(private readonly supabase?: SupabaseClient) {}

  async getSalesAnalytics(period: PeriodType = 'this_month'): Promise<SalesAnalyticsData> {
    const scale = period === 'this_week' ? 0.35 : period === 'this_quarter' ? 2.8 : 1.0;

    const totalSales = Math.round(128450000 * scale);
    const orderCount = Math.round(1840 * scale);
    const averageOrderValue = 69800;
    const conversionRate = 3.42;

    const metrics = new SalesKpiMetrics({
      totalSales,
      totalSalesDiffRate: period === 'this_week' ? 14.2 : period === 'this_quarter' ? 22.8 : 18.4,
      orderCount,
      orderCountDiffRate: period === 'this_week' ? 8.4 : period === 'this_quarter' ? 16.1 : 12.5,
      averageOrderValue,
      aovDiffRate: period === 'this_week' ? 3.1 : 5.2,
      conversionRate,
      conversionRateDiffRate: 0.4,
    });

    const regionalSales = DEFAULT_REGIONAL_SALES.map((r) => ({
      ...r,
      amount: Math.round(r.amount * scale),
    }));

    return {
      period,
      metrics,
      dailyTrends: generateDailyTrends(scale),
      bestsellers: DEFAULT_BESTSELLERS,
      regionalSales,
      aiInsights: DEFAULT_AI_INSIGHTS,
    };
  }
}

