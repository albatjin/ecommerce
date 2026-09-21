'use client';

import React from 'react';
import {
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { SalesKpiMetrics, SalesKpiMetricsProps } from '../../domain/entities/sales-metrics';

interface SalesKpiGridProps {
  metrics: SalesKpiMetrics | SalesKpiMetricsProps;
}

export function SalesKpiGrid({ metrics }: SalesKpiGridProps) {
  const kpi = metrics instanceof SalesKpiMetrics ? metrics : new SalesKpiMetrics(metrics);

  const cards = [
    {
      title: '총 매출',
      value: kpi.formattedTotalSales,
      diff: kpi.formattedTotalSalesDiff,
      isPositive: kpi.totalSalesDiffRate >= 0,
      icon: CreditCard,
      subtext: '전월 대비',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: '주문 수',
      value: kpi.formattedOrderCount,
      diff: kpi.formattedOrderCountDiff,
      isPositive: kpi.orderCountDiffRate >= 0,
      icon: ShoppingBag,
      subtext: '전월 대비',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: '객단가',
      value: kpi.formattedAov,
      diff: kpi.formattedAovDiff,
      isPositive: kpi.aovDiffRate >= 0,
      icon: TrendingUp,
      subtext: '전월 대비',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: '전환율',
      value: kpi.formattedConversionRate,
      diff: kpi.formattedConversionRateDiff,
      isPositive: kpi.conversionRateDiffRate >= 0,
      icon: Percent,
      subtext: '전월 대비',
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const DiffIcon = card.isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={card.title}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    card.isPositive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  <DiffIcon className="w-3 h-3 mr-0.5" />
                  {card.diff}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{card.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

