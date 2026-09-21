'use client';

import React from 'react';
import { Download, Calendar, CheckCircle2 } from 'lucide-react';
import { PeriodType } from '../../domain/entities/sales-metrics';

interface SalesHeaderProps {
  currentPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  onExport: () => void;
  lastUpdated?: string;
}

const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: '이번 주', value: 'this_week' },
  { label: '이번 달', value: 'this_month' },
  { label: '이번 분기', value: 'this_quarter' },
];

export function SalesHeader({
  currentPeriod,
  onPeriodChange,
  onExport,
  lastUpdated = '실시간 결제 집계 완료',
}: SalesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            {lastUpdated}
          </span>
          <span className="text-xs text-slate-400">기준: 실시간</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          매출 분석
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          정산 주기, 수수료 및 반품 반영 실매출 데이터를 다차원으로 분석합니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Period Selector Dropdown / Button Group */}
        <div
          role="group"
          aria-label="기간 선택"
          className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80"
        >
          <div className="pl-2 pr-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          {PERIOD_OPTIONS.map((opt) => {
            const isActive = currentPeriod === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPeriodChange(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>내보내기</span>
        </button>
      </div>
    </div>
  );
}

