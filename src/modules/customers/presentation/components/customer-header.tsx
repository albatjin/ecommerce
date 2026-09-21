'use client';

import React from 'react';
import { Download, MessageSquare, Home } from 'lucide-react';
import { CustomerSummary } from '../../domain/entities/customer';

interface CustomerHeaderProps {
  stats: CustomerSummary;
  onExportExcel: () => void;
  onBatchMessage: () => void;
}

export function CustomerHeader({ stats, onExportExcel, onBatchMessage }: CustomerHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <Home className="w-3.5 h-3.5" />
        <span>/</span>
        <span className="text-slate-600">Console</span>
      </nav>

      {/* Main Title and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
              CRM & MEMBER INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">고객 관리</h1>
          <p className="text-xs text-slate-500 mt-1">
            총 등록 회원 <span className="font-semibold text-slate-800">{stats.totalCount.toLocaleString()}명</span>
            {' • '}
            당월 신규 가입 <span className="font-semibold text-blue-600">{stats.newCount.toLocaleString()}명</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>회원 엑셀 다운로드</span>
          </button>
          <button
            type="button"
            onClick={onBatchMessage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS/알림톡 일괄 발송</span>
          </button>
        </div>
      </div>
    </div>
  );
}

