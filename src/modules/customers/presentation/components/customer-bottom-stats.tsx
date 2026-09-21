'use client';

import React from 'react';
import { Users, UserPlus, Star } from 'lucide-react';
import { CustomerSummary } from '../../domain/entities/customer';

interface CustomerBottomStatsProps {
  stats: CustomerSummary;
}

export function CustomerBottomStats({ stats }: CustomerBottomStatsProps) {
  return (
    <div
      data-testid="customer-bottom-stats"
      className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-200">고객 현황 요약 통계</h4>
          <p className="text-[11px] text-slate-400">쇼핑몰 전체 회원 및 주요 세그먼트 현황</p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-10">
        {/* 총 회원 */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-medium">총 회원</span>
            <span className="text-sm font-bold text-white tracking-tight">
              {stats.totalCount.toLocaleString()}명
            </span>
          </div>
        </div>

        {/* 신규 회원 */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400">
            <UserPlus className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-medium">신규 회원</span>
            <span className="text-sm font-bold text-purple-400 tracking-tight">
              {stats.newCount.toLocaleString()}명
            </span>
          </div>
        </div>

        {/* VIP 회원 */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-medium">VIP 회원</span>
            <span className="text-sm font-bold text-amber-400 tracking-tight">
              {stats.vipCount.toLocaleString()}명
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

