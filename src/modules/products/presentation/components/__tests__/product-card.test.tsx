import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductCard } from '../product-card';
import { Product } from '../../../domain/entities/product';

describe('ProductCard Component (Integration Test)', () => {
  const mockProduct = new Product({
    id: 'prod-1',
    productCode: 'PROD-10001',
    name: '울 오버핏 블레이저',
    regularPrice: 200000,
    salePrice: 160000,
    stockQuantity: 5,
    safetyStock: 10,
    status: 'ACTIVE',
  });

  it('상품 정보를 올바르게 렌더링한다', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('PROD-10001')).toBeInTheDocument();
    expect(screen.getByText('울 오버핏 블레이저')).toBeInTheDocument();
    expect(screen.getByText('160,000원')).toBeInTheDocument();
    expect(screen.getByText('200,000원')).toBeInTheDocument();
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    expect(screen.getByTestId('badge-low-stock')).toHaveTextContent('재고 임박');
  });

  it('품절 상품인 경우 품절 배지가 표시된다', () => {
    const soldOutProduct = new Product({
      id: 'prod-2',
      productCode: 'PROD-10002',
      name: '품절 니트',
      regularPrice: 50000,
      salePrice: 50000,
      stockQuantity: 0,
      safetyStock: 10,
      status: 'OUT_OF_STOCK',
    });

    render(<ProductCard product={soldOutProduct} />);
    expect(screen.getByTestId('badge-sold-out')).toHaveTextContent('품절');
  });

  it('onSelect 콜백이 주어졌을 때 버튼 클릭 시 호출된다', () => {
    const handleSelect = vi.fn();
    render(<ProductCard product={mockProduct} onSelect={handleSelect} />);

    const button = screen.getByRole('button', { name: /상세보기/i });
    fireEvent.click(button);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockProduct);
  });
});

