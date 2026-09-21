import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BestsellersList } from '../bestsellers-list';
import { BestsellerItem } from '../../../domain/entities/sales-metrics';

describe('BestsellersList Component', () => {
  const mockBestsellers: BestsellerItem[] = [
    { rank: 1, name: '[시그니처] 울 오버핏 테일러드 블레이저', quantity: 312, totalAmount: 40248000 },
    { rank: 2, name: '이탈리안 레더 클래식 첼시부츠', quantity: 184, totalAmount: 23736000 },
    { rank: 3, name: '하이드라 비타민 앰플 50ml 기획세트', quantity: 420, totalAmount: 18900000 },
    { rank: 4, name: '미니멀 티타늄 메탈 크로노 워치', quantity: 94, totalAmount: 14100000 },
    { rank: 5, name: '오가닉 워시드 린넨 베딩 듀벳커버', quantity: 88, totalAmount: 11440000 },
  ];

  it('should render bestsellers title, ranks 1 to 5, product names, and sold quantities', () => {
    render(<BestsellersList items={mockBestsellers} />);

    expect(screen.getByText(/베스트셀러/i)).toBeInTheDocument();

    // Ranks and Names
    expect(screen.getByText('[시그니처] 울 오버핏 테일러드 블레이저')).toBeInTheDocument();
    expect(screen.getByText('312개')).toBeInTheDocument();

    expect(screen.getByText('오가닉 워시드 린넨 베딩 듀벳커버')).toBeInTheDocument();
    expect(screen.getByText('88개')).toBeInTheDocument();

    // Verify 5 ranks are present
    const rankBadges = screen.getAllByTestId('rank-badge');
    expect(rankBadges).toHaveLength(5);
  });
});

