'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreProductDto } from '../../application/dto/store-product.dto';
import { StoreProductCard } from './store-product-card';
import { ArrowRight, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedProductsSectionProps {
  products: StoreProductDto[];
}

const ITEMS_PER_PAGE = 8;

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState<'best' | 'new'>('best');
  const [currentPage, setCurrentPage] = useState(1);

  // 탭별 전체 상품 목록 정렬
  const bestProducts = [...products].sort((a, b) => b.discountRate - a.discountRate);
  const newProducts = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const targetList = activeTab === 'best' ? bestProducts : newProducts;
  const totalPages = Math.max(1, Math.ceil(targetList.length / ITEMS_PER_PAGE));

  // 현재 페이지 상품 슬라이스
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = targetList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (tab: 'best' | 'new') => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 1페이지로 리셋
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="mb-16">
      {/* 섹션 헤더 & 탭 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            지금 가장 주목받는 추천 상품
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            고객들이 많이 찾고 만족도가 높은 베스트셀러를 만나보세요. (총 {targetList.length}개 상품)
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('best')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'best'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            베스트 특가
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('new')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'new'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            신규 입고
          </button>
        </div>
      </div>

      {/* 상품 그리드 */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
          표시할 상품이 없습니다. 관리자에서 상품을 등록해 주세요.
        </div>
      )}

      {/* 페이지네이션 바 (항상 표시) */}
      {totalPages >= 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          {/* 이전 버튼 */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-2xs"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 페이지 번호 리스트 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shadow-2xs"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 전체 상품 보기 링크 */}
      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
        >
          더 많은 카테고리/상품 둘러보기
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </section>
  );
}
