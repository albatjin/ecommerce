'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreProductDto } from '../../application/dto/store-product.dto';

export interface CartItem {
  productId: string;
  productCode: string;
  name: string;
  imageUrl?: string;
  category?: string;
  price: number; // 할인가격 (실제 결제 단가)
  regularPrice: number; // 정가
  discountRate: number;
  quantity: number;
  stockQuantity: number;
  maxOrderQuantity: number;
  selected: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: StoreProductDto, quantity?: number) => { success: boolean; message: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelect: (productId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  removeSelected: () => void;
  clearCart: () => void;
  // Computed values
  totalItemCount: number; // 전체 담긴 아이템 수량 합계 (뱃지용)
  selectedItemCount: number; // 선택된 품목 종류 수
  totalRegularPrice: number; // 선택된 상품 정가 합계
  totalSalePrice: number; // 선택된 상품 실결제가 합계
  totalDiscount: number; // 총 할인 금액
  shippingFee: number; // 배송비 (기본 0원)
  finalPaymentAmount: number; // 최종 결제 예정 금액
  isAllSelected: boolean;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ecommerce_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로컬 스토리지로부터 초기 장바구니 로드 (SSR Hydration Mismatch 방지)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore JSON parse or localStorage access error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 장바구니 변경 시 로컬 스토리지 저장
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore localStorage save error
      }
    }
  }, [items, isLoaded]);

  // 상품 추가
  const addItem = (product: StoreProductDto, quantity: number = 1): { success: boolean; message: string } => {
    if (product.isSoldOut) {
      return { success: false, message: '품절된 상품은 장바구니에 담을 수 없습니다.' };
    }

    let addedQuantity = quantity;
    let message = `"${product.name}" 상품이 장바구니에 담겼습니다.`;
    const success = true;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product.id);

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQuantity = existing.quantity + quantity;
        const maxLimit = Math.min(product.stockQuantity, product.maxOrderQuantity);

        if (newQuantity > maxLimit) {
          message = `최대 구매 가능 수량(${maxLimit}개)에 도달하여 수량이 제한되었습니다.`;
          const updated = [...prevItems];
          updated[existingIndex] = { ...existing, quantity: maxLimit, selected: true };
          return updated;
        }

        const updated = [...prevItems];
        updated[existingIndex] = { ...existing, quantity: newQuantity, selected: true };
        return updated;
      } else {
        const maxLimit = Math.min(product.stockQuantity, product.maxOrderQuantity);
        if (addedQuantity > maxLimit) {
          addedQuantity = maxLimit;
          message = `최대 구매 가능 수량(${maxLimit}개)만큼 장바구니에 담겼습니다.`;
        }

        const newItem: CartItem = {
          productId: product.id,
          productCode: product.productCode,
          name: product.name,
          imageUrl: product.imageUrl,
          category: product.category,
          price: product.salePrice,
          regularPrice: product.regularPrice,
          discountRate: product.discountRate,
          quantity: addedQuantity,
          stockQuantity: product.stockQuantity,
          maxOrderQuantity: product.maxOrderQuantity,
          selected: true, // 새로 추가 시 기본 선택
        };

        return [...prevItems, newItem];
      }
    });

    return { success, message };
  };

  // 단일 상품 삭제
  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // 수량 변경
  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const maxLimit = Math.min(item.stockQuantity, item.maxOrderQuantity);
          return {
            ...item,
            quantity: Math.min(newQty, maxLimit),
          };
        }
        return item;
      })
    );
  };

  // 개별 선택 토글
  const toggleSelect = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 전체 선택/해제 토글
  const toggleSelectAll = (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  // 선택된 항목 일괄 삭제
  const removeSelected = () => {
    setItems((prev) => prev.filter((item) => !item.selected));
  };

  // 전체 비우기
  const clearCart = () => {
    setItems([]);
  };

  // Computed Values
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const selectedItems = items.filter((item) => item.selected);
  const selectedItemCount = selectedItems.length;
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const totalRegularPrice = selectedItems.reduce(
    (sum, item) => sum + item.regularPrice * item.quantity,
    0
  );
  const totalSalePrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = totalRegularPrice - totalSalePrice;
  const shippingFee = 0; // 전 상품 무료 배송 정책
  const finalPaymentAmount = totalSalePrice + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        removeSelected,
        clearCart,
        totalItemCount,
        selectedItemCount,
        totalRegularPrice,
        totalSalePrice,
        totalDiscount,
        shippingFee,
        finalPaymentAmount,
        isAllSelected,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useOptionalCart() {
  return useContext(CartContext);
}

