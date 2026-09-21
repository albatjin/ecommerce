'use client';

import React from 'react';
import { BestsellerItem, formatSalesCurrency } from '../../domain/entities/sales-metrics';
import { Flame } from 'lucide-react';

interface BestsellersListProps {
  items: BestsellerItem[];
}

export function BestsellersList({ items }: BestsellersListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">베스트셀러</h3>
            <p className="text-xs text-slate-500">기간 내 판매 수량 기준 상위 5개 상품</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">1~5위</span>
      </div>

      {/* Top 5 List */}
      <div className="space-y-3.5">
        {items.slice(0, 5).map((item) => {
          const isTop3 = item.rank <= 3;
          const rankColor =
            item.rank === 1
              ? 'bg-amber-500 text-white ring-2 ring-amber-200'
              : item.rank === 2
              ? 'bg-slate-400 text-white'
              : item.rank === 3
              ? 'bg-amber-700 text-white'
              : 'bg-slate-100 text-slate-600';

          return (
            <div
              key={item.rank}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/80"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  data-testid="rank-badge"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${rankColor}`}
                >
                  {item.rank}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.name}
                  </p>
                  {item.category && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.category} {item.sku ? `· ${item.sku}` : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 pl-4">
                <div className="text-sm font-bold text-slate-900">
                  {item.quantity.toLocaleString('ko-KR')}개
                </div>
                <div className="text-xs font-medium text-blue-600">
                  {formatSalesCurrency(item.totalAmount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

