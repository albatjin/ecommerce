import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseProductRepository } from '@/modules/products/infrastructure/supabase-product.repository';
import { GetStoreProductDetailUseCase } from '@/modules/storefront/application/use-cases/get-store-product-detail.usecase';
import { ProductDetailView } from '@/modules/storefront/presentation/components/product-detail-view';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const repository = new SupabaseProductRepository(supabase);
  const getStoreProductDetailUseCase = new GetStoreProductDetailUseCase(repository);

  const product = await getStoreProductDetailUseCase.execute(id);

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다 | STOREFRONT',
    };
  }

  return {
    title: `${product.name} | STOREFRONT`,
    description: product.description?.slice(0, 120) || `${product.name} 상품 상세 정보`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 120),
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const repository = new SupabaseProductRepository(supabase);
  const getStoreProductDetailUseCase = new GetStoreProductDetailUseCase(repository);

  const product = await getStoreProductDetailUseCase.execute(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
