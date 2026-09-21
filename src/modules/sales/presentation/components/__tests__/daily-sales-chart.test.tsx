import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DailySalesChart } from '../daily-sales-chart';
import { DailySalesTrendPoint } from '../../../domain/entities/sales-metrics';

describe('DailySalesChart Component', () => {
  const mockDailyData: DailySalesTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `02.${String(i + 1).padStart(2, '0')}`,
    amount: 3000000 + ((i * 170000) % 2500000),
  }));

  it('should render large chart card with title "일별 매출 추이" and SVG line graph for 1 to 30 days', () => {
    render(<DailySalesChart data={mockDailyData} />);

    // Title
    expect(screen.getByText('일별 매출 추이')).toBeInTheDocument();

    // SVG chart element
    const svgChart = screen.getByTestId('daily-sales-svg');
    expect(svgChart).toBeInTheDocument();

    // Axis labels or points checking
    expect(screen.getByText('1일')).toBeInTheDocument();
    expect(screen.getByText('30일')).toBeInTheDocument();
  });
});

