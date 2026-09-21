import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseProductRepository } from '@/modules/products/infrastructure/supabase-product.repository';
import { GetProductsUseCase } from '@/modules/products/application/use-cases/get-products.usecase';
import { ProductView } from '@/modules/products/presentation/components/product-view';

export const metadata = {
  title: 'CommerceHub - 상품 관리',
  description: '쇼핑몰 상품 등록, 재고 상태 및 상품 목록 관리 대시보드',
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const repository = new SupabaseProductRepository(supabase);
  const getProductsUseCase = new GetProductsUseCase(repository);

  const result = await getProductsUseCase.execute({
    page: 1,
    pageSize: 10,
  });

  return (
    <ProductView
      initialProducts={result.products}
      totalCount={result.totalCount}
    />
  );
}

