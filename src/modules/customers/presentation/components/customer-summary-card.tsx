'use client';

import React from 'react';
import {
  Star,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Ticket,
  Coins,
  Sparkles,
} from 'lucide-react';
import { CustomerDetail, formatCurrencyWon, calculateAverageOrderValue } from '../../domain/entities/customer';

interface CustomerSummaryCardProps {
  customer: CustomerDetail;
}

export function CustomerSummaryCard({ customer }: CustomerSummaryCardProps) {
  const avgOrder = customer.averageOrderValue || calculateAverageOrderValue(customer.totalSpent, customer.totalOrders) || 300000;
  const formattedTotalSpent = formatCurrencyWon(customer.totalSpent);
  const formattedAvgOrder = formatCurrencyWon(avgOrder);

  return (
    <div
      data-testid="customer-summary-card"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
    >
      {/* Top Title & Top % Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">고객 요약</h2>
            <p className="text-[11px] text-slate-400">Customer Lifetime Value & Key Metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* VIP 등급 & 별 아이콘 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Star data-testid="vip-star-icon" className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>등급: {customer.membershipGrade}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            상위 3.2%
          </span>
        </div>
      </div>

      {/* 4 Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. 총 구매액 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-100/80">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">총 구매액</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            {formattedTotalSpent}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% 지난 분기대비</span>
          </div>
        </div>

        {/* 2. 총 주문 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">총 주문</span>
            <ShoppingBag className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {customer.totalOrders}건
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            최근 1년간 꾸준한 구매
          </div>
        </div>

        {/* 3. 평균 주문 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">평균 주문</span>
            <span className="text-xs font-bold text-slate-400">AOV</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formattedAvgOrder}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            건당 평균 결제금액
          </div>
        </div>

        {/* 4. 등급 & 리워드 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">보유 혜택</span>
            <Ticket className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-900 mt-0.5">
            <div className="flex items-center gap-1 font-bold text-base text-slate-800">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>{customer.rewardPoints?.toLocaleString()} P</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            할인쿠폰 <span className="font-semibold text-blue-600">{customer.couponsCount || 3}장</span> 보유
          </div>
        </div>
      </div>
    </div>
  );
}

