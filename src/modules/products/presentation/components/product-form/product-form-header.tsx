'use client';

import React from 'react';
import { Home, Bookmark, Eye, Check, Store } from 'lucide-react';

interface ProductFormHeaderProps {
  onCancel: () => void;
  onSaveDraft?: () => void;
  onPreview?: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ProductFormHeader({
  onCancel,
  onSaveDraft,
  onPreview,
  onSubmit,
  isSubmitting = false,
}: ProductFormHeaderProps) {
  return (
    <div className="space-y-4 pb-2 border-b border-slate-200">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Home className="w-3.5 h-3.5" />
        <span>/</span>
        <span>Console</span>
        <span>/</span>
        <span className="font-semibold text-slate-800">상품 등록/수정</span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                상품 등록/수정
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                임시 초안
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              공식 온라인스토어 및 제휴 채널에 즉시 동기화 가능한 신규 카탈로그 아이템을 생성합니다.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition shadow-xs cursor-pointer"
          >
            취소
          </button>

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>임시저장</span>
            </button>
          )}

          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>미리보기</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-xs shadow-indigo-600/30 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSubmitting ? '저장 중...' : '상품 등록하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

