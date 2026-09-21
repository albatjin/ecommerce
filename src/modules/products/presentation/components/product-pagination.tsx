'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  selectedCount: number;
  onPageChange: (page: number) => void;
  onBulkEdit: () => void;
  onBulkDelete: () => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  selectedCount,
  onPageChange,
  onBulkEdit,
  onBulkDelete,
}: ProductPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1">
      {/* 일괄 작업 바: "선택된 아이템: 0개 | 일괄수정 | 일괄삭제" */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-sm text-slate-600 font-medium">
          선택된 아이템: <strong className="text-slate-900 font-bold">{selectedCount}개</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBulkEdit}
            disabled={selectedCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              selectedCount > 0
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>일괄수정</span>
          </button>

          <button
            type="button"
            onClick={onBulkDelete}
            disabled={selectedCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              selectedCount > 0
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>일괄삭제</span>
          </button>
        </div>
      </div>

      {/* 페이지 번호 (1, 2, 3, 4, 5...) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              page === currentPage
                ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="다음 페이지"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

