'use client';

import React from 'react';
import { Search, RotateCcw, Sparkles } from 'lucide-react';
import { CustomerGrade, CustomerSortOption } from '../../domain/entities/customer';

interface CustomerFilterBarProps {
  currentGrade: CustomerGrade | 'ALL';
  onGradeChange: (grade: CustomerGrade | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: CustomerSortOption;
  onSortChange: (sort: CustomerSortOption) => void;
  onResetFilters: () => void;
}

const GRADE_TABS: { label: string; value: CustomerGrade | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '브론즈', value: 'BRONZE' },
  { label: '실버', value: 'SILVER' },
  { label: '골드', value: 'GOLD' },
  { label: 'VIP', value: 'VIP' },
  { label: 'VVIP', value: 'VVIP' },
];

export function CustomerFilterBar({
  currentGrade,
  onGradeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetFilters,
}: CustomerFilterBarProps) {
  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      {/* Top row: Grade tabs + Smart segment badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">회원 등급:</span>
          {GRADE_TABS.map((tab) => {
            const isActive = currentGrade === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onGradeChange(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium self-end sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>스마트 세그먼트 자동 분류 활성 중</span>
        </div>
      </div>

      {/* Bottom row: Search input, Sort dropdown, and Reset */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="이름, 이메일, 휴대전화번호 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            data-testid="customer-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CustomerSortOption)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="createdAt_desc">가입일순 (최신순)</option>
            <option value="createdAt_asc">가입일순 (오래된순)</option>
            <option value="totalSpent_desc">구매금액순 (높은순)</option>
            <option value="totalSpent_asc">구매금액순 (낮은순)</option>
          </select>

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 cursor-pointer"
            title="필터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
}

