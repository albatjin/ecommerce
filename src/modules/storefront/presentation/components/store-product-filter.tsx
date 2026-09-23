'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, X } from 'lucide-react';

interface StoreProductFilterProps {
  categories: { name: string; count: number }[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
  totalCount: number;
}

export function StoreProductFilter({
  categories,
  currentCategory = '전체',
  currentSort = 'latest',
  currentSearch = '',
  totalCount,
}: StoreProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== '전체') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // 필터 변경 시 첫 페이지로
    params.delete('page');
    router.push(`/shop?${params.toString()}`);
  };

  const sortOptions = [
    { label: '최신순', value: 'latest' },
    { label: '낮은 가격순', value: 'price_asc' },
    { label: '높은 가격순', value: 'price_desc' },
    { label: '할인율 높은순', value: 'discount' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 mb-8 shadow-xs space-y-4">
      {/* 검색어 알림 바 (검색어가 있을 경우) */}
      {currentSearch && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xs text-blue-800">
          <span>
            <strong className="font-semibold">&quot;{currentSearch}&quot;</strong> 검색 결과 (총{' '}
            <strong className="font-semibold">{totalCount}</strong>개)
          </span>
          <button
            type="button"
            onClick={() => updateParam('search', null)}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            검색 초기화
          </button>
        </div>
      )}

      {/* 상단: 카테고리 칩 목록 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected =
            cat.name === currentCategory || (cat.name === '전체' && !currentCategory);
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => updateParam('category', cat.name === '전체' ? null : cat.name)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-[11px] opacity-80`}>({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* 하단: 결과 개수 및 정렬 드롭다운 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div>
          총 <strong className="text-gray-900 font-semibold">{totalCount}</strong>개의 상품
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-transparent text-gray-800 font-medium focus:outline-none cursor-pointer pr-1"
            aria-label="정렬 기준"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
