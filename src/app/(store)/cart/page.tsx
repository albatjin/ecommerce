import React from 'react';
import { CartView } from '@/modules/storefront/presentation/components/cart-view';

export const metadata = {
  title: '장바구니 | STOREFRONT',
  description: '선택하신 상품을 확인하고 주문서를 작성하세요.',
};

export default function CartPage() {
  return <CartView />;
}

