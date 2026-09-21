'use client';

import React, { useState } from 'react';
import { SalesAnalyticsData, PeriodType } from '../../domain/entities/sales-metrics';
import { SalesHeader } from './sales-header';
import { SalesKpiGrid } from './sales-kpi-grid';
import { DailySalesChart } from './daily-sales-chart';
import { BestsellersList } from './bestsellers-list';
import { RegionalSalesChart } from './regional-sales-chart';
import { AiInsightsCard } from './ai-insights-card';
import { SupabaseSalesRepository } from '../../infrastructure/supabase-sales.repository';
import { GetSalesAnalyticsUseCase } from '../../application/use-cases/get-sales-analytics.usecase';

interface SalesViewProps {
  initialData: SalesAnalyticsData;
}

export function SalesView({ initialData }: SalesViewProps) {
  const [data, setData] = useState<SalesAnalyticsData>(initialData);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>(initialData.period);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handlePeriodChange = async (period: PeriodType) => {
    setCurrentPeriod(period);
    // Fetch updated data for the selected period
    const repo = new SupabaseSalesRepository();
    const useCase = new GetSalesAnalyticsUseCase(repo);
    const updated = await useCase.execute(period);
    setData(updated);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Construct CSV content for download
    const header = '날짜,금액\n';
    const rows = data.dailyTrends.map((d) => `${d.date},${d.amount}`).join('\n');
    const blob = new Blob([`\uFEFF${header}${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `매출분석_${currentPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단 헤더: 제목, 기간 선택 드롭다운, 내보내기 버튼 */}
      <SalesHeader
        currentPeriod={currentPeriod}
        onPeriodChange={handlePeriodChange}
        onExport={handleExport}
      />

      {/* 2. 4대 KPI 카드: 총 매출, 주문 수, 객단가, 전환율 */}
      <SalesKpiGrid metrics={data.metrics} />

      {/* 3. 큰 차트 카드: '일별 매출 추이' 선 그래프 (1일~30일) */}
      <DailySalesChart data={data.dailyTrends} />

      {/* 4. 2열 레이아웃: 좌측 베스트셀러(1~5위) + 우측 지역별 판매 가로 막대 그래프 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <BestsellersList items={data.bestsellers} />
        </div>
        <div className="lg:col-span-6">
          <RegionalSalesChart items={data.regionalSales} />
        </div>
      </div>

      {/* 5. AI 인사이트: 3개의 인사이트 문장 (글머리 기호) */}
      <AiInsightsCard insights={data.aiInsights} />
    </div>
  );
}

