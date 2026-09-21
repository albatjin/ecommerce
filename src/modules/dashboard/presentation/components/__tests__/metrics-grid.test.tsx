import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MetricsGrid } from '../metrics-grid';
import { DashboardMetrics } from '../../../domain/entities/dashboard-metrics';

describe('MetricsGrid Component (Integration Test)', () => {
  it('양수 증가 지표 4개의 핵심 카드를 올바르게 렌더링한다', () => {
    const metrics = new DashboardMetrics({
      todaySales: 14280000,
      salesDiffRate: 18.4,
      todayOrders: 482,
      ordersDiff: 12,
      todayCustomers: 342,
      customersDiff: 24,
      lowStockProducts: 28,
    });

    render(<MetricsGrid metrics={metrics} />);

    // 1. 오늘 매출
    expect(screen.getByText('오늘 매출')).toBeInTheDocument();
    expect(screen.getByText('₩14,280,000')).toBeInTheDocument();
    expect(screen.getByText('+18.4%')).toBeInTheDocument();

    // 2. 신규 주문
    expect(screen.getByText('신규 주문')).toBeInTheDocument();
    expect(screen.getByText('482건')).toBeInTheDocument();
    expect(screen.getByText('+12건')).toBeInTheDocument();

    // 3. 신규 고객
    expect(screen.getByText('신규 고객')).toBeInTheDocument();
    expect(screen.getByText('342명')).toBeInTheDocument();
    expect(screen.getByText('+24명')).toBeInTheDocument();

    // 4. 재고 부족 상품
    expect(screen.getByText('재고 부족 상품')).toBeInTheDocument();
    expect(screen.getByText('28개')).toBeInTheDocument();
    expect(screen.getByTestId('low-stock-warning')).toBeInTheDocument();
  });

  it('감소(음수) 지표일 때 rose 컬러 스타일로 렌더링된다', () => {
    const negativeMetrics = new DashboardMetrics({
      todaySales: 5000000,
      salesDiffRate: -10.5,
      todayOrders: 100,
      ordersDiff: -20,
      todayCustomers: 50,
      customersDiff: -5,
      lowStockProducts: 0,
    });

    render(<MetricsGrid metrics={negativeMetrics} />);

    expect(screen.getByText('-10.5%')).toHaveClass('text-rose-600');
    expect(screen.getByText('-20건')).toHaveClass('text-rose-600');
    expect(screen.getByText('-5명')).toHaveClass('text-rose-600');
  });
});

