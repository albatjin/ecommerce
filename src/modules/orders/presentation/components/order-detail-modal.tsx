'use client';

import React from 'react';
import Link from 'next/link';
import { X, PackageCheck, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';
import { OrderDto } from '../../application/dto/order.dto';

interface OrderDetailModalProps {
  order: OrderDto | null;
  onClose: () => void;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">주문 상세 정보</h2>
              <p className="text-xs text-slate-400 font-mono">{order.orderNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">주문 상태</span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${order.statusBadgeClass}`}
            >
              {order.statusLabel}
            </span>
          </div>

          <div className="space-y-3 text-slate-700">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">주문 상품</div>
              <div className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {order.orderSummary}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5">고객명</div>
                <div className="font-medium text-slate-900">{order.customerName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>결제금액</span>
                </div>
                <div className="font-bold text-slate-900 font-mono">{formatWon(order.paidAmount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>연락처</span>
                </div>
                <div className="text-xs font-mono text-slate-800">{order.recipientPhone || '010-0000-0000'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>주문일시</span>
                </div>
                <div className="text-xs font-mono text-slate-800">{order.orderDate}</div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>배송지 주소</span>
              </div>
              <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {order.shippingAddress || '서울특별시 강남구 테헤란로 152'}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/orders/${order.id}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              전체 상세 페이지 보기 &rarr;
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

