import {
  DashboardMetrics,
  WeeklySalesPoint,
  CategorySalesRatio,
  RecentOrder,
} from '../entities/dashboard-metrics';

export interface DashboardData {
  metrics: DashboardMetrics;
  weeklySales: WeeklySalesPoint[];
  categoryRatios: CategorySalesRatio[];
  recentOrders: RecentOrder[];
}

export interface IDashboardRepository {
  getDashboardData(): Promise<DashboardData>;
}

