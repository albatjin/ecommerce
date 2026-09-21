'use client';

import React from 'react';
import Link from 'next/link';
import { User, ChevronRight, MessageSquare, Mail } from 'lucide-react';
import { OrderCustomerInfo } from '../../domain/entities/order';

interface OrderCustomerCardProps {
  customer: OrderCustomerInfo;
  onSendSms?: () => void;
  onSendEmail?: () => void;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function OrderCustomerCard({
  customer,
  onSendSms,
  onSendEmail,
}: OrderCustomerCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">주문자 정보</h3>
        </div>

        <Link
          href={`/customers/${customer.id || 'cust-kim'}`}
          className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <span>고객 상세</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Customer Profile Row */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold shrink-0">
          {customer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base text-slate-600">👩🏻</span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{customer.name}</span>
            {customer.membershipGrade && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                {customer.membershipGrade}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-mono">{customer.email}</div>
          {customer.phone && (
            <div className="text-xs text-slate-400 font-mono">{customer.phone}</div>
          )}
        </div>
      </div>

      {/* Stats Box: 누적 주문건수, 누적 주문금액, 보유 포인트 */}
      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs">
        <div className="grid grid-cols-2 gap-2 border-b border-slate-200/60 pb-2.5">
          <div>
            <span className="block text-slate-400 text-[11px] mb-0.5">누적 주문건수</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {customer.totalOrders}건
            </span>
          </div>

          <div>
            <span className="block text-slate-400 text-[11px] mb-0.5">누적 주문금액</span>
            <span className="text-sm font-black text-blue-600 font-mono">
              {formatWon(customer.totalSpent)}
            </span>
          </div>
        </div>

        <div>
          <span className="block text-slate-400 text-[11px] mb-0.5">보유 포인트</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 font-mono">
              {new Intl.NumberFormat('ko-KR').format(customer.rewardPoints)} P
            </span>
            {customer.pointsUsedThisOrder && customer.pointsUsedThisOrder > 0 && (
              <span className="text-[11px] font-medium text-slate-500">
                (사용 {new Intl.NumberFormat('ko-KR').format(customer.pointsUsedThisOrder)} P 차감됨)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Buttons: 알림톡 발송 / 이메일 재안내 */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={onSendSms || (() => alert(`${customer.name} 고객님께 알림톡이 발송되었습니다.`))}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>알림톡 발송</span>
        </button>

        <button
          type="button"
          onClick={onSendEmail || (() => alert(`${customer.email} 주소로 주문 안내 메일이 발송되었습니다.`))}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
        >
          <Mail className="w-3.5 h-3.5 text-slate-500" />
          <span>이메일 재안내</span>
        </button>
      </div>
    </div>
  );
}

