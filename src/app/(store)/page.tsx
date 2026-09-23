import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseProductRepository } from '@/modules/products/infrastructure/supabase-product.repository';
import { GetStoreProductsUseCase } from '@/modules/storefront/application/use-cases/get-store-products.usecase';
import { HeroBanner } from '@/modules/storefront/presentation/components/hero-banner';
import { CategoryQuickNav } from '@/modules/storefront/presentation/components/category-quick-nav';
import { FeaturedProductsSection } from '@/modules/storefront/presentation/components/featured-products-section';

export const metadata = {
  title: 'STOREFRONT | 프리미엄 이커머스',
  description: '최신 트렌드 IT 기기부터 라이프스타일 상품까지 한 곳에서 만나보세요.',
};

export default async function StoreHomePage() {
  const supabase = await createClient();
  const repository = new SupabaseProductRepository(supabase);
  const getStoreProductsUseCase = new GetStoreProductsUseCase(repository);

  // 메인 홈용 공개 상품 조회 (페이지네이션 지원)
  const { products } = await getStoreProductsUseCase.execute({
    pageSize: 100,
    sort: 'latest',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. 상단 히어로 배너 */}
      <HeroBanner />

      {/* 2. 카테고리 퀵 네비게이션 */}
      <CategoryQuickNav />

      {/* 3. 추천 & 신상품 탭 그리드 */}
      <FeaturedProductsSection products={products} />
    </div>
  );
}

