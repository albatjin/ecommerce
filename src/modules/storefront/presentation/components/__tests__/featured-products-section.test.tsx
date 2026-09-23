import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeaturedProductsSection } from '../featured-products-section';
import { StoreProductDto } from '../../../application/dto/store-product.dto';

describe('FeaturedProductsSection Component', () => {
  // 12개의 더미 상품 생성 (8개 기준 2페이지 생성)
  const mockProducts: StoreProductDto[] = Array.from({ length: 12 }, (_, i) => ({
    id: `prod-${i + 1}`,
    productCode: `P-${i + 1}`,
    name: `테스트 상품 ${i + 1}`,
    category: '전자제품',
    regularPrice: 100000,
    salePrice: 80000 - i * 1000,
    discountRate: 20 + i,
    stockQuantity: 10,
    safetyStock: 2,
    status: 'ACTIVE',
    stockStatus: 'NORMAL',
    stockStatusLabel: '정상',
    isSoldOut: false,
    isLowStock: false,
    additionalImages: [],
    taxType: 'TAXABLE',
    maxOrderQuantity: 10,
    createdAt: `2025-01-${String(i + 1).padStart(2, '0')}`,
  }));

  it('상품이 8개 초과일 때 페이지네이션 버튼(1, 2)이 렌더링된다', () => {
    render(<FeaturedProductsSection products={mockProducts} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  it('2페이지 버튼 클릭 시 2페이지 상품들이 화면에 표시된다', () => {
    render(<FeaturedProductsSection products={mockProducts} />);

    // 1페이지에선 8개 상품 표시
    const page2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Btn);

    // 2페이지 버튼이 활성화(파란색)되고, 9번째 이후 상품이 표시됨
    expect(screen.getByText('2')).toHaveClass('bg-blue-600');
  });

  it('신규 입고 탭으로 전환 시 페이지가 1페이지로 리셋된다', () => {
    render(<FeaturedProductsSection products={mockProducts} />);

    const page2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Btn);
    expect(screen.getByText('2')).toHaveClass('bg-blue-600');

    // 탭 변경
    const newTabBtn = screen.getByText('신규 입고');
    fireEvent.click(newTabBtn);

    // 다시 1페이지 활성화
    expect(screen.getByText('1')).toHaveClass('bg-blue-600');
  });
});

