import React from 'react';
import { ProductCreateContainer } from '@/modules/products/presentation/components/product-form/product-create-container';

export const metadata = {
  title: 'CommerceHub - 상품 등록/수정',
  description: '신규 상품 카탈로그 등록 및 기존 상품 정보 수정 페이지',
};

export default function ProductCreatePage() {
  return <ProductCreateContainer />;
}

