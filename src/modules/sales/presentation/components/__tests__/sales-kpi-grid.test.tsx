import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalesKpiGrid } from '../sales-kpi-grid';
import { SalesKpiMetrics } from '../../../domain/entities/sales-metrics';

describe('SalesKpiGrid Component', () => {
  const mockMetrics = new SalesKpiMetrics({
    totalSales: 128450000,
    totalSalesDiffRate: 18.4,
    orderCount: 1840,
    orderCountDiffRate: 12.5,
    averageOrderValue: 69800,
    aovDiffRate: 5.2,
    conversionRate: 3.42,
    conversionRateDiffRate: 0.4,
  });

  it('should render all 4 KPI cards horizontally with amounts and percent changes', () => {
    render(<SalesKpiGrid metrics={mockMetrics} />);

    // 4 titles
    expect(screen.getByText('총 매출')).toBeInTheDocument();
    expect(screen.getByText('주문 수')).toBeInTheDocument();
    expect(screen.getByText('객단가')).toBeInTheDocument();
    expect(screen.getByText('전환율')).toBeInTheDocument();

    // Values
    expect(screen.getByText('₩128,450,000')).toBeInTheDocument();
    expect(screen.getByText('1,840건')).toBeInTheDocument();
    expect(screen.getByText('₩69,800')).toBeInTheDocument();
    expect(screen.getByText('3.42%')).toBeInTheDocument();

    // Percent changes
    expect(screen.getByText('+18.4%')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('+0.4%p')).toBeInTheDocument();
  });
});

