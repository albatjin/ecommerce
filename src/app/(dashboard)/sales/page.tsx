import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseSalesRepository } from '@/modules/sales/infrastructure/supabase-sales.repository';
import { GetSalesAnalyticsUseCase } from '@/modules/sales/application/use-cases/get-sales-analytics.usecase';
import { SalesView } from '@/modules/sales/presentation/components/sales-view';
import { SalesKpiMetrics } from '@/modules/sales/domain/entities/sales-metrics';

export const metadata = {
  title: 'CommerceHub - 매출 분석',
  description: '온라인 쇼핑몰 매출 및 실적 분석 대시보드',
};

export default async function SalesAnalyticsPage() {
  const supabase = await createClient();
  const repository = new SupabaseSalesRepository(supabase);
  const getSalesAnalytics = new GetSalesAnalyticsUseCase(repository);
  const data = await getSalesAnalytics.execute('this_month');

  const serializedData = {
    ...data,
    metrics: data.metrics instanceof SalesKpiMetrics ? data.metrics.toProps() : data.metrics,
  };

  return <SalesView initialData={serializedData} />;
}

