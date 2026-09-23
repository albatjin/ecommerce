import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartView } from '../cart-view';
import { CartProvider, useCart } from '../../context/cart-context';
import { StoreProductDto } from '../../../application/dto/store-product.dto';

// 카트 아이템이 미리 담긴 테스트 래퍼 컴포넌트
function TestCartInitializer({ initialProduct }: { initialProduct: StoreProductDto }) {
  const { addItem } = useCart();
  React.useEffect(() => {
    addItem(initialProduct, 2);
  }, []);
  return <CartView />;
}

describe('CartView Component', () => {
  const sampleProduct: StoreProductDto = {
    id: 'prod-cart-1',
    productCode: 'PC-001',
    name: '울트라 무선 헤드폰',
    category: '전자제품',
    regularPrice: 300000,
    salePrice: 250000,
    discountRate: 17,
    stockQuantity: 10,
    safetyStock: 2,
    status: 'ACTIVE',
    stockStatus: 'NORMAL',
    stockStatusLabel: '정상',
    isSoldOut: false,
    isLowStock: false,
    additionalImages: [],
    taxType: 'TAXABLE',
    maxOrderQuantity: 5,
    createdAt: '2025-01-01',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('장바구니가 비어 있을 때 안내 문구와 상품 둘러보기 버튼을 렌더링한다', () => {
    render(
      <CartProvider>
        <CartView />
      </CartProvider>
    );

    expect(screen.getByText('장바구니가 비어 있습니다')).toBeInTheDocument();
    expect(screen.getByText('인기 상품 둘러보기')).toBeInTheDocument();
  });

  it('상품이 담겨 있을 때 상품명, 수량, 소계 및 주문 예상 금액을 렌더링한다', () => {
    render(
      <CartProvider>
        <TestCartInitializer initialProduct={sampleProduct} />
      </CartProvider>
    );

    expect(screen.getByText('울트라 무선 헤드폰')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 수량 2개
    // 250,000 * 2 = 500,000원
    expect(screen.getAllByText('500,000원').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('주문 예상 금액')).toBeInTheDocument();
  });

  it('수량 증가 버튼을 누르면 수량이 3으로 증가하고 소계가 750,000원으로 갱신된다', () => {
    render(
      <CartProvider>
        <TestCartInitializer initialProduct={sampleProduct} />
      </CartProvider>
    );

    const plusBtn = screen.getByLabelText('수량 증가');
    fireEvent.click(plusBtn);

    expect(screen.getByText('3')).toBeInTheDocument();
    // 250,000 * 3 = 750,000원
    expect(screen.getAllByText('750,000원').length).toBeGreaterThanOrEqual(1);
  });

  it('개별 삭제 버튼 클릭 시 해당 아이템이 삭제되어 빈 장바구니로 전환된다', () => {
    render(
      <CartProvider>
        <TestCartInitializer initialProduct={sampleProduct} />
      </CartProvider>
    );

    const deleteBtn = screen.getByLabelText('울트라 무선 헤드폰 삭제');
    fireEvent.click(deleteBtn);

    expect(screen.getByText('장바구니가 비어 있습니다')).toBeInTheDocument();
  });
});

