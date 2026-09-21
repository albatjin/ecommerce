import React from 'react';
import { TrendingUp, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import { DashboardMetrics } from '../../domain/entities/dashboard-metrics';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. 오늘 매출 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">오늘 매출</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.formattedTodaySales}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
            <span
              className={metrics.salesDiffRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            >
              {metrics.formattedSalesDiff}
            </span>
            <span className="text-slate-400 font-normal">전일 대비</span>
          </div>
        </div>
      </div>

      {/* 2. 신규 주문 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">신규 주문</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.todayOrders.toLocaleString()}건
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
            <span
              className={metrics.ordersDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            >
              {metrics.formattedOrdersDiff}
            </span>
            <span className="text-slate-400 font-normal">전일 대비</span>
          </div>
        </div>
      </div>

      {/* 3. 신규 고객 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">신규 고객</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.todayCustomers.toLocaleString()}명
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
            <span
              className={metrics.customersDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            >
              {metrics.formattedCustomersDiff}
            </span>
            <span className="text-slate-400 font-normal">전일 대비</span>
          </div>
        </div>
      </div>

      {/* 4. 재고 부족 상품 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">재고 부족 상품</span>
          <div
            data-testid="low-stock-warning"
            className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-rose-600 tracking-tight">
            {metrics.lowStockProducts.toLocaleString()}개
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-500 font-medium">
            <span>주의 요망</span>
            <span className="text-slate-400 font-normal">안전재고 미달</span>
          </div>
        </div>
      </div>
    </div>
  );
}

