'use client';

import React from 'react';
import { Users, UserPlus, AlertTriangle, Award } from 'lucide-react';
import { CustomerSummary } from '../../domain/entities/customer';

interface CustomerStatsCardsProps {
  stats: CustomerSummary;
}

export function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. 전체 회원 수 */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">전체 회원 수</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {stats.totalCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">명</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600">
              ↑ 4.1%
            </span>
            <span className="text-[11px] text-slate-400">전월 대비 증가</span>
          </div>
        </div>
      </div>

      {/* 2. 당월 신규 가입 */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">당월 신규 가입</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {stats.newCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">명</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-600">
              목표 대비 114%
            </span>
            <span className="text-[11px] text-slate-400">일평균 11.4명</span>
          </div>
        </div>
      </div>

      {/* 3. 휴면 / 탈퇴 예정 */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">휴면 / 탈퇴 예정</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {stats.dormantWarningCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">명</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-600">
              관리 필요
            </span>
            <span className="text-[11px] text-slate-400">30일 내 전환 유도 발송</span>
          </div>
        </div>
      </div>

      {/* 4. VIP / VVIP 회원 */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">VIP / VVIP 회원</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {stats.vipCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">명 (상위 4.5%)</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400">평균 객단가</span>
            <span className="text-[11px] font-semibold text-slate-700">
              ₩{new Intl.NumberFormat('ko-KR').format(stats.averageOrderValue || 480000)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

