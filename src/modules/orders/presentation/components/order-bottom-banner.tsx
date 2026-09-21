'use client';

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface OrderBottomBannerProps {
  pendingCount?: number;
}

export function OrderBottomBanner({ pendingCount = 15 }: OrderBottomBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/20">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">
            오늘 처리해야 할 주문: <span className="text-blue-600">{pendingCount}건</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            결제 완료된 주문에 대해 신속한 송장 등록 및 발주 처리가 필요합니다.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <span className="text-xs font-semibold text-blue-700 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
          당일 발송 마감: 16:00
        </span>
      </div>
    </div>
  );
}

