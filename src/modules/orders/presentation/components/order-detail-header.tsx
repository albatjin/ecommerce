'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Printer,
  Truck,
  AlertCircle,
  Home,
} from 'lucide-react';
import { OrderDetail } from '../../domain/entities/order';

interface OrderDetailHeaderProps {
  order: OrderDetail;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenTrackingModal?: () => void;
  onPrintInvoice?: () => void;
  onCancelOrder?: () => void;
}

export function OrderDetailHeader({
  order,
  onPrev,
  onNext,
  onOpenTrackingModal,
  onPrintInvoice,
  onCancelOrder,
}: OrderDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/dashboard" className="hover:text-slate-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Console</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">주문 관리</span>
        <span className="text-slate-300">/</span>
        <Link href="/orders" className="hover:text-slate-900">
          주문 목록
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-blue-600 font-semibold">주문 상세</span>
      </div>

      {/* 2. Main Title Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Left: Title, Order Number, Status Badge & Timestamp */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
              {order.orderNumber}
              <span className="ml-2 text-sm font-semibold text-slate-500 font-sans">
                ({order.displayTitle})
              </span>
            </h1>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${order.statusBadgeClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {order.statusLabel === '상품준비' ? '배송 준비중' : order.statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>접수일시: {order.orderDate}</span>
            {order.paidDate && <span>• 결제일시: {order.paidDate}</span>}
          </div>
        </div>

        {/* Right: Navigation & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Previous / List / Next Nav Buttons */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5 mr-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!order.navigation?.prevOrderId}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>
            <Link
              href="/orders"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition"
            >
              <List className="w-3.5 h-3.5" />
              <span>목록</span>
            </Link>
            <button
              type="button"
              onClick={onNext}
              disabled={!order.navigation?.nextOrderId}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>다음</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons: 운송장 등록, 주문서 출력, 주문 취소/환불 */}
          <button
            type="button"
            onClick={onOpenTrackingModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20 transition"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>운송장 등록</span>
          </button>

          <button
            type="button"
            onClick={onPrintInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>주문서 출력</span>
          </button>

          <button
            type="button"
            onClick={onCancelOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>주문 취소/환불</span>
          </button>
        </div>
      </div>
    </div>
  );
}

