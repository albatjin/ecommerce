'use client';

import React from 'react';
import { RotateCcw, Check, Loader2 } from 'lucide-react';

interface SettingsHeaderProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function SettingsHeader({ onSave, onReset, isSaving }: SettingsHeaderProps) {
  return (
    <div className="space-y-4 pb-2">
      {/* Breadcrumb & Version Tag */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>/</span>
        <span className="hover:text-slate-700 cursor-pointer">Console</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              STORE CONFIG
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">v4.8.2 Production</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">설정</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            공식 온라인스토어의 기본 상점 정보, 브랜딩 에셋, 운영 모드 및 결제·배송 정책을 통합 관리합니다.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onReset}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>설정 초기화</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>변경사항 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}

