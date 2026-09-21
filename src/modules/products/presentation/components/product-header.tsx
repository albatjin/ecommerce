'use client';

import React from 'react';
import { Plus, Package } from 'lucide-react';

interface ProductHeaderProps {
  onAddProduct: () => void;
  totalCount?: number;
}

export function ProductHeader({ onAddProduct, totalCount }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">상품 관리</h1>
            {totalCount !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                총 {totalCount}개
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            등록된 상품 목록을 조회하고 재고 및 판매 상태를 실시간으로 관리합니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddProduct}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all duration-150 cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>상품 등록</span>
      </button>
    </div>
  );
}

