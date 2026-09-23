import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductDetailView } from '../product-detail-view';
import { Product } from '@/modules/products/domain/entities/product';
import { toStoreProductDto } from '../../../application/dto/store-product.dto';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ProductDetailView Component', () => {
  const sampleProduct = new Product({
    id: 'prod-view-1',
    productCode: 'PV-001',
    name: '울트라 슬림 16인치 노트북',
    category: '전자제품',
    brandName: 'TechBrand',
    regularPrice: 2000000,
    salePrice: 1600000,
    stockQuantity: 5,
    safetyStock: 2,
    status: 'ACTIVE',
    imageUrl: 'https://example.com/laptop.jpg',
    additionalImages: ['https://example.com/laptop-sub.jpg'],
    description: '최고의 퍼포먼스를 자랑하는 최신형 노트북입니다.',
    skuCode: 'SKU-LAPTOP-16',
    maxOrderQuantity: 3,
  });

  it('기본 정보(상품명, 브랜드, 가격, 할인율)를 올바르게 렌더링한다', () => {
    render(<ProductDetailView product={toStoreProductDto(sampleProduct)} />);

    expect(screen.getAllByText('울트라 슬림 16인치 노트북')[0]).toBeInTheDocument();
    expect(screen.getByText('TechBrand')).toBeInTheDocument();
    expect(screen.getAllByText('1,600,000').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('20% SALE')).toBeInTheDocument();
  });

  it('수량 증가/감소 버튼으로 수량 및 총 금액이 실시간 변경된다', () => {
    render(<ProductDetailView product={toStoreProductDto(sampleProduct)} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('1,600,000').length).toBeGreaterThanOrEqual(1);

    const plusBtn = screen.getByText('+');
    fireEvent.click(plusBtn);

    expect(screen.getByText('2')).toBeInTheDocument();
    // 1600000 * 2 = 3200000
    expect(screen.getByText('3,200,000')).toBeInTheDocument();

    const minusBtn = screen.getByText('-');
    fireEvent.click(minusBtn);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('1,600,000').length).toBeGreaterThanOrEqual(1);
  });

  it('장바구니 담기 버튼 클릭 시 토스트 피드백이 표시된다', () => {
    render(<ProductDetailView product={toStoreProductDto(sampleProduct)} />);

    const cartBtn = screen.getByText('장바구니 담기');
    fireEvent.click(cartBtn);

    expect(screen.getByText(/"울트라 슬림 16인치 노트북" 상품 1개가 장바구니에 담겼습니다!/)).toBeInTheDocument();
  });
});
