import { SupabaseClient } from '@supabase/supabase-js';
import { IDashboardRepository, DashboardData } from '../domain/repositories/dashboard.repository';
import {
  DashboardMetrics,
  RecentOrder,
  OrderStatus,
} from '../domain/entities/dashboard-metrics';

interface SupabaseOrderRow {
  id: string;
  order_number: string;
  order_name: string;
  total_paid_amount: number;
  status: string;
  created_at: string;
  users?: { name?: string } | { name?: string }[];
}

export const DEFAULT_MOCK_DASHBOARD_DATA: DashboardData = {
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
      productName: '프리미엄 캐시미어 블렌드 싱글 코트',
      amount: 289000,
      status: 'PAID',
      orderedAt: '10분 전',
    }),
    new RecentOrder({
      id: 'ord-2',
      orderNumber: 'ORD-20250520-00191',
      customerName: '이서연',
      productName: '스트레이트 울 블렌드 셋업 슬랙스',
      amount: 79000,
      status: 'PREPARING',
      orderedAt: '25분 전',
    }),
    new RecentOrder({
      id: 'ord-3',
      orderNumber: 'ORD-20250520-00190',
      customerName: '박지훈',
      productName: '에센셜 카프스킨 미니멀 로우탑 스니커즈',
      amount: 135000,
      status: 'SHIPPING',
      orderedAt: '42분 전',
    }),
    new RecentOrder({
      id: 'ord-4',
      orderNumber: 'ORD-20250520-00189',
      customerName: '정다은',
      productName: '시더우드 & 베르가못 오 드 퍼퓸 50ml',
      amount: 128000,
      status: 'DELIVERED',
      orderedAt: '1시간 전',
    }),
    new RecentOrder({
      id: 'ord-5',
      orderNumber: 'ORD-20250520-00188',
      customerName: '최유진',
      productName: '마스터 알루미늄 무선 기계식 키보드 V2',
      amount: 189000,
      status: 'CANCELLED',
      orderedAt: '2시간 전',
    }),
  ],
};

export class SupabaseDashboardRepository implements IDashboardRepository {
  constructor(private readonly supabase?: SupabaseClient) {}

  async getDashboardData(): Promise<DashboardData> {
    if (!this.supabase) {
      return DEFAULT_MOCK_DASHBOARD_DATA;
    }

    try {
      // 1. Try fetching RPC get_dashboard_summary
      const { data: summaryData, error: summaryError } = await this.supabase.rpc(
        'get_dashboard_summary'
      );

      // 2. Try fetching latest 5 orders
      const { data: ordersData, error: ordersError } = await this.supabase
        .from('orders')
        .select('id, order_number, order_name, total_paid_amount, status, created_at, users(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (summaryError || !summaryData) {
        return DEFAULT_MOCK_DASHBOARD_DATA;
      }

      const metrics = new DashboardMetrics({
        todaySales: Number(summaryData.today_sales || 0),
        salesDiffRate: Number(summaryData.sales_diff_rate || 0),
        todayOrders: Number(summaryData.today_orders || 0),
        ordersDiff: Number(summaryData.orders_diff || 0),
        todayCustomers: Number(summaryData.today_customers || 0),
        customersDiff: Number(summaryData.customers_diff || 0),
        lowStockProducts: Number(summaryData.low_stock_products || 0),
      });

      let recentOrders = DEFAULT_MOCK_DASHBOARD_DATA.recentOrders;
      if (!ordersError && ordersData && ordersData.length > 0) {
        recentOrders = (ordersData as unknown as SupabaseOrderRow[]).map((ord) => {
          const customerName = Array.isArray(ord.users)
            ? ord.users[0]?.name || '고객'
            : ord.users?.name || '고객';

          return new RecentOrder({
            id: ord.id,
            orderNumber: ord.order_number,
            customerName,
            productName: ord.order_name,
            amount: Number(ord.total_paid_amount || 0),
            status: (ord.status as OrderStatus) || 'PAID',
            orderedAt: new Date(ord.created_at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        });
      }

      return {
        metrics,
        weeklySales: DEFAULT_MOCK_DASHBOARD_DATA.weeklySales,
        categoryRatios: DEFAULT_MOCK_DASHBOARD_DATA.categoryRatios,
        recentOrders,
      };
    } catch {
      return DEFAULT_MOCK_DASHBOARD_DATA;
    }
  }
}

