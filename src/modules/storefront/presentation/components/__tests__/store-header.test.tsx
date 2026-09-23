import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreHeader } from '../store-header';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('StoreHeader Component', () => {
  it('로고와 카테고리 링크들을 렌더링한다', () => {
    render(<StoreHeader cartItemCount={3} />);

    expect(screen.getByText('FRONT')).toBeInTheDocument();
    expect(screen.getAllByText('전자제품')[0]).toBeInTheDocument();
    expect(screen.getAllByText('의류')[0]).toBeInTheDocument();
    expect(screen.getAllByText('식품')[0]).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // 장바구니 뱃지
  });

  it('검색창에 텍스트 입력 후 제출 시 /products?search=... 로 이동한다', () => {
    render(<StoreHeader />);

    const searchInput = screen.getByPlaceholderText('어떤 상품을 찾으시나요?');
    fireEvent.change(searchInput, { target: { value: '노트북' } });
    fireEvent.submit(searchInput.closest('form')!);

    expect(mockPush).toHaveBeenCalledWith('/shop?search=%EB%85%B8%ED%8A%B8%EB%B6%81');
  });
});
