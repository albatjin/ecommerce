'use client';

import React from 'react';
import { WeeklySalesPoint, formatCurrency } from '../../domain/entities/dashboard-metrics';

interface WeeklySalesChartProps {
  data: WeeklySalesPoint[];
}

export function WeeklySalesChart({ data }: WeeklySalesChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const chartHeight = 180;
  const chartWidth = 540;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (data.length - 1);
    const normalizedY = (d.amount / (maxAmount * 1.15)) * (chartHeight - paddingY * 2);
    const y = chartHeight - paddingY - normalizedY;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const totalWeeklySales = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">주간 매출 추이</h2>
          <p className="text-xs text-slate-500 mt-0.5">최근 7일간의 일별 결제 매출 현황입니다.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">주간 누적</span>
          <p className="text-sm font-bold text-blue-600">{formatCurrency(totalWeeklySales)}</p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          data-testid="weekly-sales-svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - paddingY - (chartHeight - paddingY * 2) * ratio;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area under line */}
          <path d={areaD} fill="url(#blueGradient)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                className="fill-white stroke-blue-600 stroke-2 hover:r-6 transition-all"
              />
            </g>
          ))}
        </svg>

        {/* X Axis Day Labels */}
        <div className="flex justify-between px-6 pt-2 border-t border-slate-100 text-xs font-medium text-slate-500">
          {data.map((item) => (
            <span key={item.day} className="text-center">
              {item.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

