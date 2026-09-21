import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseDashboardRepository } from '@/modules/dashboard/infrastructure/supabase-dashboard.repository';
import { GetDashboardSummaryUseCase } from '@/modules/dashboard/application/use-cases/get-dashboard-summary.usecase';
import { MetricsGrid } from '@/modules/dashboard/presentation/components/metrics-grid';
import { WeeklySalesChart } from '@/modules/dashboard/presentation/components/weekly-sales-chart';
import { CategoryRatioChart } from '@/modules/dashboard/presentation/components/category-ratio-chart';
import { RecentOrdersTable } from '@/modules/dashboard/presentation/components/recent-orders-table';

export const metadata = {
  title: 'CommerceHub - 대시보드',
  description: '온라인 쇼핑몰 관리자 대시보드 메인 화면',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const repository = new SupabaseDashboardRepository(supabase);
  const getDashboardSummary = new GetDashboardSummaryUseCase(repository);
  const data = await getDashboardSummary.execute();

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">대시보드</h1>
          <p className="text-xs text-slate-500 mt-1">
            오늘의 주요 쇼핑몰 운영 현황 및 핵심 지표를 실시간으로 확인합니다.
          </p>
        </div>
      </div>

      {/* 1. 상단 4대 핵심 지표 카드 */}
      <MetricsGrid metrics={data.metrics} />

      {/* 2. 중간 차트: 좌측 주간 매출 선 그래프 + 우측 카테고리별 파이 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WeeklySalesChart data={data.weeklySales} />
        </div>
        <div className="lg:col-span-5">
          <CategoryRatioChart data={data.categoryRatios} />
        </div>
      </div>

      {/* 3. 하단 최근 주문 목록 테이블 */}
      <RecentOrdersTable orders={data.recentOrders} />
    </div>
  );
}
