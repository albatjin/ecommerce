import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SalesView } from '../sales-view';
import { SalesAnalyticsData, SalesKpiMetrics } from '../../../domain/entities/sales-metrics';

describe('SalesView Component (Integration Test)', () => {
  const initialData: SalesAnalyticsData = {
    period: 'this_month',
    metrics: new SalesKpiMetrics({
      totalSales: 128450000,
      totalSalesDiffRate: 18.4,
      orderCount: 1840,
      orderCountDiffRate: 12.5,
      averageOrderValue: 69800,
      aovDiffRate: 5.2,
      conversionRate: 3.42,
      conversionRateDiffRate: 0.4,
    }),
    dailyTrends: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      date: `02.${String(i + 1).padStart(2, '0')}`,
      amount: 4000000 + i * 100000,
    })),
    bestsellers: [
      {
        rank: 1,
        name: '[시그니처] 울 오버핏 테일러드 블레이저',
        quantity: 312,
        totalAmount: 40248000,
      },
      {
        rank: 2,
        name: '이탈리안 레더 클래식 첼시부츠',
        quantity: 184,
        totalAmount: 23736000,
      },
      {
        rank: 3,
        name: '하이드라 비타민 앰플 50ml 기획세트',
        quantity: 420,
        totalAmount: 18900000,
      },
      {
        rank: 4,
        name: '미니멀 티타늄 메탈 크로노 워치',
        quantity: 94,
        totalAmount: 14100000,
      },
      {
        rank: 5,
        name: '오가닉 워시드 린넨 베딩 듀벳커버',
        quantity: 88,
        totalAmount: 11440000,
      },
    ],
    regionalSales: [
      { region: '서울', percentage: 45, amount: 57802500 },
      { region: '경기', percentage: 28, amount: 35966000 },
      { region: '부산', percentage: 12, amount: 15414000 },
      { region: '기타', percentage: 15, amount: 19267500 },
    ],
    aiInsights: [
      { id: '1', content: '전자 기기 매출이 전월대비 23% 상승했습니다.' },
      { id: '2', content: '주말 저녁 시간대 모바일 결제 비중이 68%로 가장 집중되었습니다.' },
      { id: '3', content: '수도권(서울/경기) 주문 비중이 73%를 차지합니다.' },
    ],
  };

  it('renders all sections and responds to period change', async () => {
    render(<SalesView initialData={initialData} />);

    // Header check
    expect(screen.getByRole('heading', { level: 1, name: /매출 분석/i })).toBeInTheDocument();

    // KPI check
    expect(screen.getByText('₩128,450,000')).toBeInTheDocument();

    // Large Chart check
    expect(screen.getByTestId('daily-sales-svg')).toBeInTheDocument();

    // 2-Column checks
    expect(screen.getByText(/베스트셀러/i)).toBeInTheDocument();
    expect(screen.getByText('지역별 판매')).toBeInTheDocument();

    // AI Insights check
    expect(screen.getByText('AI 인사이트')).toBeInTheDocument();
    expect(screen.getByText(/전자 기기 매출이 전월대비 23% 상승했습니다/i)).toBeInTheDocument();

    // Period change action
    const weekBtn = screen.getByText('이번 주');
    fireEvent.click(weekBtn);

    await waitFor(() => {
      expect(weekBtn).toHaveClass('bg-white text-blue-600');
    });
  });

  it('triggers CSV download when export button is clicked', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:test');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    render(<SalesView initialData={initialData} />);

    const exportBtn = screen.getByRole('button', { name: /내보내기/i });
    fireEvent.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalled();
  });
});

