import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RegionalSalesChart } from '../regional-sales-chart';
import { RegionalSalesItem } from '../../../domain/entities/sales-metrics';

describe('RegionalSalesChart Component', () => {
  const mockRegionalData: RegionalSalesItem[] = [
    { region: '서울', percentage: 45, amount: 57802500 },
    { region: '경기', percentage: 28, amount: 35966000 },
    { region: '부산', percentage: 12, amount: 15414000 },
    { region: '기타', percentage: 15, amount: 19267500 },
  ];

  it('should render horizontal bar chart with Seoul 45%, Gyeonggi 28%, Busan 12%, Others 15%', () => {
    render(<RegionalSalesChart items={mockRegionalData} />);

    expect(screen.getByText('지역별 판매')).toBeInTheDocument();

    // Check regions
    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('경기')).toBeInTheDocument();
    expect(screen.getByText('부산')).toBeInTheDocument();
    expect(screen.getByText('기타')).toBeInTheDocument();

    // Check percentages
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('28%')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });
});

