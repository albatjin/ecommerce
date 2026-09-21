'use client';

import React from 'react';
import { CreditCard, FileText, CheckCircle2 } from 'lucide-react';
import { OrderPaymentInfo } from '../../domain/entities/order';

interface OrderPaymentCardProps {
  payment: OrderPaymentInfo;
  orderDate?: string;
  paidDate?: string;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function OrderPaymentCard({ payment, orderDate, paidDate }: OrderPaymentCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">결제 금액 상세</h3>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>결제완료</span>
        </span>
      </div>

      {/* Amounts Breakdown */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span>총 상품금액</span>
          <span className="font-mono font-bold text-slate-900">
            {formatWon(payment.totalProductAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>상품 할인(쿠폰)</span>
          <span className="font-mono font-bold text-rose-600">
            {payment.couponDiscount > 0 ? `-${formatWon(payment.couponDiscount)}` : '0원'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>포인트 사용</span>
          <span className="font-mono font-bold text-rose-600">
            {payment.pointUsed > 0 ? `-${formatWon(payment.pointUsed)}` : '0원'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>기본 배송비</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
              무료혜택
            </span>
          </div>
          <span className="font-mono font-bold text-slate-900">
            {payment.shippingFee === 0 ? '₩0' : formatWon(payment.shippingFee)}
          </span>
        </div>
      </div>

      {/* Large Highlight Box: 최종 결제 금액 */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="block text-[11px] font-bold text-slate-500">최종 결제 금액</span>
          <span className="text-xs font-semibold text-slate-700">실 결제액</span>
        </div>
        <div className="text-2xl font-black font-mono text-blue-600 tracking-tight">
          {formatWon(payment.finalPaidAmount)}
        </div>
      </div>

      {/* Payment Details (수단, 할부, 승인일시, 매출전표 링크) */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">결제 수단</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>{payment.paymentMethod}</span>
          </div>
        </div>

        {payment.installment && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">할부 개월</span>
            <span className="font-semibold text-slate-800">{payment.installment}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-400">승인 일시</span>
          <span className="font-mono font-medium text-slate-600">
            {payment.approvedAt || paidDate || orderDate || '-'}
          </span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => alert('카드 매출전표 영수증 팝업이 호출됩니다.')}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>카드 매출전표 영수증 출력</span>
          </button>
        </div>
      </div>
    </div>
  );
}

