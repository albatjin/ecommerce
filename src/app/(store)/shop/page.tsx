import React, { Suspense } from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseProductRepository } from '@/modules/products/infrastructure/supabase-product.repository';
import {
  GetStoreProductsUseCase,
  StoreProductSortType,
} from '@/modules/storefront/application/use-cases/get-store-products.usecase';
import { StoreProductCard } from '@/modules/storefront/presentation/components/store-product-card';
import { StoreProductFilter } from '@/modules/storefront/presentation/components/store-product-filter';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

export const metadata = {
  title: '상품 목록 | STOREFRONT',
  description: '다양한 카테고리의 엄선된 상품을 탐색해보세요.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const search = resolvedSearchParams.search;
  const sort = (resolvedSearchParams.sort as StoreProductSortType) || 'latest';
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = 8;

  const supabase = await createClient();
  const repository = new SupabaseProductRepository(supabase);
  const getStoreProductsUseCase = new GetStoreProductsUseCase(repository);

  const result = await getStoreProductsUseCase.execute({
    category,
    search,
    sort,
    page,
    pageSize,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 타이틀 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {category ? `${category}` : '전체 상품'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          STOREFRONT가 검증한 프리미엄 상품을 둘러보세요.
        </p>
      </div>

      {/* 필터 및 정렬 바 (useSearchParams 사용하므로 Suspense 감싸기) */}
      <Suspense fallback={<div className="h-24 bg-white rounded-xl animate-pulse mb-8" />}>
        <StoreProductFilter
          categories={result.categories}
          currentCategory={category}
          currentSort={sort}
          currentSearch={search}
          totalCount={result.totalCount}
        />
      </Suspense>

      {/* 상품 그리드 */}
      {result.products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {result.products.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 페이지네이션 (항상 표시) */}
          {result.totalPages >= 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === page;
                const params = new URLSearchParams();
                if (category) params.set('category', category);
                if (search) params.set('search', search);
                if (sort) params.set('sort', sort);
                params.set('page', String(p));

                return (
                  <Link
                    key={p}
                    href={`/shop?${params.toString()}`}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* 검색/필터 결과가 없을 때 */
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-xs">
          <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-800">일치하는 상품이 없습니다</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            선택한 조건의 상품을 찾을 수 없습니다. 검색어를 변경하거나 필터를 초기화해 보세요.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            >
              전체 상품 보러가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
