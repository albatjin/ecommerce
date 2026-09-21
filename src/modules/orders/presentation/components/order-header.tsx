'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface OrderHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabCounts?: Record<string, number>;
}

const TABS = ['전체', '결제대기', '결제완료', '배송중', '배송완료'];

export function OrderHeader({ currentTab, onTabChange, tabCounts }: OrderHeaderProps) {
  return (
    <div className="space-y-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">주문 관리</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            실시간 주문 상태를 모니터링하고 배송 및 결제 현황을 신속하게 관리하세요.
          </p>
        </div>
      </div>

      {/* 상태별 탭 버튼: 전체 | 결제대기 | 결제완료 | 배송중 | 배송완료 - 선택됨 파란색 강조 */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/60 overflow-x-auto">
        {TABS.map((tab) => {
          const isSelected = currentTab === tab;
          const count = tabCounts?.[tab];

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab}</span>
              {count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-blue-700/60 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

