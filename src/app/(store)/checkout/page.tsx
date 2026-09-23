import React from 'react';
import { CheckoutView } from '@/modules/storefront/presentation/components/checkout-view';

export const metadata = {
  title: '주문서 작성 | CommerceHub',
  description: '주문 상품 확인 및 배송지 입력, 안전 결제',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}

