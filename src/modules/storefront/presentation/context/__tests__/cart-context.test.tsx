import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../cart-context';
import { StoreProductDto } from '../../../application/dto/store-product.dto';

describe('CartContext', () => {
  const sampleProduct1: StoreProductDto = {
    id: 'prod-1',
    productCode: 'P-001',
    name: '스마트폰',
    category: '전자제품',
    regularPrice: 1000000,
    salePrice: 800000,
    discountRate: 20,
    stockQuantity: 5,
    safetyStock: 1,
    status: 'ACTIVE',
    stockStatus: 'NORMAL',
    stockStatusLabel: '정상',
    isSoldOut: false,
    isLowStock: false,
    additionalImages: [],
    taxType: 'TAXABLE',
    maxOrderQuantity: 3,
    createdAt: '2025-01-01',
  };

  const sampleProduct2: StoreProductDto = {
    id: 'prod-2',
    productCode: 'P-002',
    name: '무선 이어폰',
    category: '전자제품',
    regularPrice: 200000,
    salePrice: 150000,
    discountRate: 25,
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
    createdAt: '2025-01-02',
  };

  const soldOutProduct: StoreProductDto = {
    id: 'prod-3',
    productCode: 'P-003',
    name: '품절된 상품',
    category: '기타',
    regularPrice: 50000,
    salePrice: 50000,
    discountRate: 0,
    stockQuantity: 0,
    safetyStock: 1,
    status: 'OUT_OF_STOCK',
    stockStatus: 'OUT_OF_STOCK',
    stockStatusLabel: '품절',
    isSoldOut: true,
    isLowStock: false,
    additionalImages: [],
    taxType: 'TAXABLE',
    maxOrderQuantity: 5,
    createdAt: '2025-01-03',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('상품을 장바구니에 정상적으로 추가하고 수량을 누적한다', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      const res = result.current.addItem(sampleProduct1, 1);
      expect(res.success).toBe(true);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.totalItemCount).toBe(1);
    expect(result.current.items[0].name).toBe('스마트폰');

    // 동일 상품 1개 더 추가 -> 수량 2개로 누적
    act(() => {
      result.current.addItem(sampleProduct1, 1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.totalItemCount).toBe(2);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('품절된 상품은 장바구니에 담기지 않는다', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      const res = result.current.addItem(soldOutProduct, 1);
      expect(res.success).toBe(false);
    });

    expect(result.current.items.length).toBe(0);
  });

  it('최대 구매 수량(maxOrderQuantity)을 초과할 수 없다', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      // sampleProduct1의 maxOrderQuantity는 3
      result.current.addItem(sampleProduct1, 10);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  it('수량 변경, 단일 삭제, 전체 비우기가 정상 작동한다', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(sampleProduct1, 1);
      result.current.addItem(sampleProduct2, 2);
    });

    expect(result.current.items.length).toBe(2);

    // 수량 변경
    act(() => {
      result.current.updateQuantity('prod-1', 3);
    });
    expect(result.current.items.find((i) => i.productId === 'prod-1')?.quantity).toBe(3);

    // 단일 삭제
    act(() => {
      result.current.removeItem('prod-1');
    });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].productId).toBe('prod-2');

    // 전체 비우기
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items.length).toBe(0);
  });

  it('체크박스 선택/해제 및 총 결제 예상 금액이 정확히 계산된다', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      // prod-1: regularPrice 1,000,000, salePrice 800,000, qty 1
      result.current.addItem(sampleProduct1, 1);
      // prod-2: regularPrice 200,000, salePrice 150,000, qty 2 (정가 400,000, 할인가 300,000)
      result.current.addItem(sampleProduct2, 2);
    });

    // 기본적으로 둘 다 선택됨
    expect(result.current.selectedItemCount).toBe(2);
    expect(result.current.totalRegularPrice).toBe(1400000);
    expect(result.current.totalSalePrice).toBe(1100000);
    expect(result.current.totalDiscount).toBe(300000);
    expect(result.current.finalPaymentAmount).toBe(1100000);

    // prod-1 선택 해제
    act(() => {
      result.current.toggleSelect('prod-1');
    });

    expect(result.current.selectedItemCount).toBe(1);
    expect(result.current.totalRegularPrice).toBe(400000);
    expect(result.current.totalSalePrice).toBe(300000);
    expect(result.current.finalPaymentAmount).toBe(300000);

    // 선택된 항목만 삭제 (prod-2 삭제, prod-1은 남아있어야 함)
    act(() => {
      result.current.removeSelected();
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].productId).toBe('prod-1');
  });
});

