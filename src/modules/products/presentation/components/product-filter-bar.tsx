'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  stockStatus: string;
  onStockStatusChange: (status: string) => void;
  onReset?: () => void;
}

const CATEGORY_OPTIONS = ['전체', '전자제품', '의류', '식품'];
const STOCK_STATUS_OPTIONS = ['전체', '정상', '부족', '품절'];

export function ProductFilterBar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  onReset,
}: ProductFilterBarProps) {
  const isFiltered = searchQuery !== '' || category !== '전체' || stockStatus !== '전체';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* 검색창 */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="상품명 또는 상품코드로 검색..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 카테고리 드롭다운 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 shrink-0 hidden sm:inline">카테고리:</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat === '전체' ? '카테고리 전체' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* 재고 상태 드롭다운 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 shrink-0 hidden sm:inline">재고 상태:</span>
        <select
          value={stockStatus}
          onChange={(e) => onStockStatusChange(e.target.value)}
          className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          {STOCK_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === '전체' ? '재고상태 전체' : status}
            </option>
          ))}
        </select>
      </div>

      {/* 초기화 버튼 */}
      {isFiltered && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="필터 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      )}
    </div>
  );
}

