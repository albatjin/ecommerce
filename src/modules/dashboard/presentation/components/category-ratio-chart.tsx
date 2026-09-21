'use client';

import React from 'react';
import { CategorySalesRatio } from '../../domain/entities/dashboard-metrics';

interface CategoryRatioChartProps {
  data: CategorySalesRatio[];
}

export function CategoryRatioChart({ data }: CategoryRatioChartProps) {
  // SVG Donut Chart calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">카테고리별 판매 비율</h2>
        <p className="text-xs text-slate-500 mt-0.5">실시간 매출 기여도 및 카테고리별 비중입니다.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
        {/* SVG Donut / Pie Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg
            data-testid="category-ratio-svg"
            viewBox="0 0 160 160"
            className="w-full h-full -rotate-90 transform"
          >
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="22"
            />
            {data.map((item, idx) => {
              const prevPercent = data
                .slice(0, idx)
                .reduce((sum, prev) => sum + prev.percentage, 0);
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
              const rotation = (prevPercent / 100) * 360;

              return (
                <circle
                  key={idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="22"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'all 0.5s ease',
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400 font-medium">전체 비중</span>
            <span className="text-lg font-bold text-slate-900">100%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-col gap-2.5">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 font-medium">{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

