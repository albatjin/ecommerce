import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProductCard } from '../store-product-card';
import { Product } from '@/modules/products/domain/entities/product';
import { toStoreProductDto } from '../../../application/dto/store-product.dto';

describe('StoreProductCard Component', () => {
  const activeProduct = new Product({
    id: 'p-1',
    productCode: 'PROD-001',
    name: '게이밍 기계식 키보드',
    category: '전자제품',
    regularPrice: 150000,
    salePrice: 120000,
    stockQuantity: 10,
    safetyStock: 3,
    status: 'ACTIVE',
    imageUrl: 'https://example.com/keyboard.jpg',
  });

  const soldOutProduct = new Product({
    id: 'p-2',
    productCode: 'PROD-002',
    name: '품절된 한정판 스니커즈',
    category: '의류',
    regularPrice: 200000,
    salePrice: 200000,
    stockQuantity: 0,
    safetyStock: 2,
    status: 'OUT_OF_STOCK',
  });

  it('상품명, 가격, 할인율(20% OFF)을 올바르게 렌더링한다', () => {
    render(<StoreProductCard product={toStoreProductDto(activeProduct)} />);

    expect(screen.getByText('게이밍 기계식 키보드')).toBeInTheDocument();
    expect(screen.getByText('120,000')).toBeInTheDocument();
    expect(screen.getByText('150,000원')).toBeInTheDocument();
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    expect(screen.getByText('무료배송')).toBeInTheDocument();
  });

  it('품절 상품인 경우 SOLD OUT 라벨을 노출한다', () => {
    render(<StoreProductCard product={toStoreProductDto(soldOutProduct)} />);

    expect(screen.getByText('SOLD OUT')).toBeInTheDocument();
    expect(screen.queryByText('장바구니 담기')).not.toBeInTheDocument();
  });

  it('장바구니 담기 퀵 버튼 클릭 시 콜백을 호출한다', () => {
    const handleAddToCart = vi.fn();
    render(<StoreProductCard product={toStoreProductDto(activeProduct)} onAddToCart={handleAddToCart} />);

    const addBtn = screen.getByText('장바구니 담기');
    fireEvent.click(addBtn);

    expect(handleAddToCart).toHaveBeenCalledWith(toStoreProductDto(activeProduct));
  });
});

