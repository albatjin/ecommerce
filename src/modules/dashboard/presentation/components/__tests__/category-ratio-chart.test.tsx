import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CategoryRatioChart } from '../category-ratio-chart';
import { CategorySalesRatio } from '../../../domain/entities/dashboard-metrics';

describe('CategoryRatioChart Component (Integration Test)', () => {
  const categories: CategorySalesRatio[] = [
    { category: '패션/의류', percentage: 42, amount: 6000000, color: '#2563eb' },
    { category: '디지털/가전', percentage: 25, amount: 3570000, color: '#3b82f6' },
    { category: '뷰티/코스메틱', percentage: 18, amount: 2570000, color: '#60a5fa' },
    { category: '라이프/홈데코', percentage: 15, amount: 2140000, color: '#93c5fd' },
  ];

  it('카테고리별 판매 비율 타이틀과 범례 및 퍼센트를 올바르게 렌더링한다', () => {
    render(<CategoryRatioChart data={categories} />);

    expect(screen.getByText('카테고리별 판매 비율')).toBeInTheDocument();
    expect(screen.getByText('패션/의류')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('디지털/가전')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('뷰티/코스메틱')).toBeInTheDocument();
    expect(screen.getByText('18%')).toBeInTheDocument();
    expect(screen.getByText('라이프/홈데코')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();

    expect(screen.getByTestId('category-ratio-svg')).toBeInTheDocument();
  });
});

