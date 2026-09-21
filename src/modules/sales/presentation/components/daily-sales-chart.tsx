'use client';

import React, { useState } from 'react';
import { DailySalesTrendPoint, formatSalesCurrency } from '../../domain/entities/sales-metrics';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface DailySalesChartProps {
  data: DailySalesTrendPoint[];
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DailySalesTrendPoint | null>(null);

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
  const averageAmount = Math.round(totalAmount / data.length);
  const peakPoint = [...data].sort((a, b) => b.amount - a.amount)[0];

  const chartHeight = 220;
  const chartWidth = 720;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;

  const points = data.map((d, index) => {
    const x =
      paddingLeft +
      (index * (chartWidth - paddingLeft - paddingRight)) / (data.length - 1);
    const normalizedY =
      (d.amount / (maxAmount * 1.15)) * (chartHeight - paddingTop - paddingBottom);
    const y = chartHeight - paddingBottom - normalizedY;
    return { x, y, ...d };
  });

  const pathD = points.reduce(
    (acc, point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
    ''
  );

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`;

  // Y-axis grid values (0, 25%, 50%, 75%, 100%)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const val = Math.round((maxAmount * 1.15 * ratio) / 1000000);
    const yPos = chartHeight - paddingBottom - (chartHeight - paddingTop - paddingBottom) * ratio;
    return { label: `₩${val}M`, yPos };
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">일별 매출 추이</h2>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-md">
              1일~30일
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            한 달간 일별 결제 총액 추이를 모니터링합니다.
          </p>
        </div>

        {/* Quick summaries */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-500">최고:</span>
            <span className="font-bold text-slate-800">{peakPoint ? `${peakPoint.day}일 (${formatSalesCurrency(peakPoint.amount)})` : '-'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">일평균:</span>
            <span className="font-bold text-slate-800">{formatSalesCurrency(averageAmount)}</span>
          </div>
        </div>
      </div>

      {/* Main SVG Line Graph */}
      <div className="relative w-full overflow-hidden">
        {hoveredPoint && (
          <div
            className="absolute top-2 right-4 z-10 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none"
          >
            <span className="font-semibold">{hoveredPoint.day}일</span>: {formatSalesCurrency(hoveredPoint.amount)}
          </div>
        )}

        <svg
          data-testid="daily-sales-svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y Axis Grid & Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.yPos}
                x2={chartWidth - paddingRight}
                y2={tick.yPos}
                stroke="#f1f5f9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.yPos + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Gradient Area */}
          <path d={areaD} fill="url(#salesGradient)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.day === pt.day ? 6 : 3.5}
              className="fill-white stroke-blue-600 stroke-2 cursor-pointer transition-all hover:stroke-blue-700"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* X Axis: 1일 ~ 30일 */}
        <div className="flex justify-between px-14 pt-2 border-t border-slate-100 text-xs font-medium text-slate-400">
          <span>1일</span>
          <span>5일</span>
          <span>10일</span>
          <span>15일</span>
          <span>20일</span>
          <span>25일</span>
          <span>30일</span>
        </div>
      </div>
    </div>
  );
}

