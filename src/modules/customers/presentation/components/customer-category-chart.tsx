'use client';

import React from 'react';
import { PieChart, Layers } from 'lucide-react';
import { PreferredCategory } from '../../domain/entities/customer';

interface CustomerCategoryChartProps {
  categories?: PreferredCategory[];
}

const DEFAULT_CATEGORIES: PreferredCategory[] = [
  { category: '전자기기', percentage: 80, color: '#3B82F6' },
  { category: '의류', percentage: 15, color: '#10B981' },
  { category: '기타', percentage: 5, color: '#9CA3AF' },
];

export function CustomerCategoryChart({
  categories = DEFAULT_CATEGORIES,
}: CustomerCategoryChartProps) {
  const items = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  // Background colors mapping
  const getCategoryColor = (name: string, fallback?: string) => {
    if (fallback) return fallback;
    if (name.includes('전자')) return '#3B82F6'; // Blue
    if (name.includes('의류')) return '#10B981'; // Emerald
    return '#9CA3AF'; // Gray
  };

  return (
    <div
      data-testid="preferred-category-card"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">선호 카테고리</h2>
            <p className="text-[11px] text-slate-400">누적 결제 금액 기준 구매 선호도 분석</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
          <Layers className="w-3.5 h-3.5" />
          <span>전자기기 집중형</span>
        </div>
      </div>

      {/* Horizontal Stacked Bar Chart */}
      <div className="space-y-2">
        <div
          data-testid="category-bar-chart"
          className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 shadow-inner"
        >
          {items.map((item) => {
            const color = getCategoryColor(item.category, item.color);
            return (
              <div
                key={item.category}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group"
                title={`${item.category}: ${item.percentage}%`}
              />
            );
          })}
        </div>

        {/* Legend with exact labels and badges */}
        <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
          {items.map((item) => {
            const color = getCategoryColor(item.category, item.color);
            return (
              <div key={item.category} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-slate-700">
                  {item.category} <strong className="font-bold text-slate-900">{item.percentage}%</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Detail Bars */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        {items.map((item) => {
          const color = getCategoryColor(item.category, item.color);
          return (
            <div key={`detail-${item.category}`} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">{item.category}</span>
                <span className="font-bold text-slate-900">{item.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

