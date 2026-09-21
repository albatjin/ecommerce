'use client';

import React from 'react';
import { RegionalSalesItem, formatSalesCurrency } from '../../domain/entities/sales-metrics';
import { MapPin } from 'lucide-react';

interface RegionalSalesChartProps {
  items: RegionalSalesItem[];
}

const REGION_BAR_COLORS: Record<string, string> = {
  서울: 'bg-blue-600',
  경기: 'bg-indigo-500',
  부산: 'bg-sky-400',
  기타: 'bg-slate-300',
};

export function RegionalSalesChart({ items }: RegionalSalesChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">지역별 판매</h3>
            <p className="text-xs text-slate-500">권역별 결제 점유율 및 매출 기여도</p>
          </div>
        </div>
      </div>

      {/* Horizontal Bars */}
      <div className="space-y-4">
        {items.map((item) => {
          const barColor = REGION_BAR_COLORS[item.region] || 'bg-blue-500';

          return (
            <div key={item.region} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{item.region}</span>
                  <span className="text-slate-400 text-[11px]">
                    {formatSalesCurrency(item.amount)}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">{item.percentage}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>수도권(서울+경기) 합산 점유율</span>
        <span className="font-bold text-blue-600">73% 집중</span>
      </div>
    </div>
  );
}

