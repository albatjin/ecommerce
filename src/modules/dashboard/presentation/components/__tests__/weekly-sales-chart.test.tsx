import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { WeeklySalesChart } from '../weekly-sales-chart';
import { WeeklySalesPoint } from '../../../domain/entities/dashboard-metrics';

describe('WeeklySalesChart Component (Integration Test)', () => {
  const weeklyData: WeeklySalesPoint[] = [
    { day: '월', amount: 8200000 },
    { day: '화', amount: 9500000 },
    { day: '수', amount: 7800000 },
    { day: '목', amount: 11200000 },
    { day: '금', amount: 13400000 },
    { day: '토', amount: 16800000 },
    { day: '일', amount: 14280000 },
  ];

  it('주간 매출 추이 차트 타이틀과 요일 축(월~일)을 올바르게 렌더링한다', () => {
    render(<WeeklySalesChart data={weeklyData} />);

    expect(screen.getByText('주간 매출 추이')).toBeInTheDocument();

    const days = ['월', '화', '수', '목', '금', '토', '일'];
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    expect(screen.getByTestId('weekly-sales-svg')).toBeInTheDocument();
  });
});

