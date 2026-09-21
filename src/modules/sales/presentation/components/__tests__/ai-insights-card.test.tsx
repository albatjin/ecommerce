import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AiInsightsCard } from '../ai-insights-card';
import { AiInsightItem } from '../../../domain/entities/sales-metrics';

describe('AiInsightsCard Component', () => {
  const mockInsights: AiInsightItem[] = [
    { id: '1', content: '전자 기기 매출이 전월대비 23% 상승했습니다.' },
    { id: '2', content: '주말 저녁 시간대(18~22시) 모바일 결제 비중이 68%로 가장 집중되었습니다.' },
    { id: '3', content: '수도권(서울/경기) 주문 비중이 73%를 차지하여 수도권 익일 배송 캐파 확충이 권장됩니다.' },
  ];

  it('should render title "AI 인사이트" and 3 insight sentences in bullet points', () => {
    render(<AiInsightsCard insights={mockInsights} />);

    // Title
    expect(screen.getByText('AI 인사이트')).toBeInTheDocument();

    // 3 statements
    expect(screen.getByText(/전자 기기 매출이 전월대비 23% 상승했습니다/i)).toBeInTheDocument();
    expect(screen.getByText(/주말 저녁 시간대/i)).toBeInTheDocument();
    expect(screen.getByText(/수도권\(서울\/경기\) 주문 비중이 73%/i)).toBeInTheDocument();

    // Bullet items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });
});

