'use client';

import React, { useState } from 'react';
import { AlertTriangle, Save, Check } from 'lucide-react';
import { OrderStatus } from '../../domain/entities/order';

interface OrderBottomActionBarProps {
  currentStatus: OrderStatus;
  onCancelOrder?: () => void;
  onStatusSave?: (newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PAYMENT_PENDING', label: '결제대기' },
  { value: 'PAID', label: '결제완료' },
  { value: 'PREPARING', label: '상품준비' },
  { value: 'SHIPPING', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
];

export function OrderBottomActionBar({
  currentStatus,
  onCancelOrder,
  onStatusSave,
}: OrderBottomActionBarProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (onStatusSave) {
      onStatusSave(selectedStatus);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCancel = () => {
    if (confirm('정말로 이 주문을 취소하시겠습니까? 취소 후 상태가 취소됨으로 변경됩니다.')) {
      if (onCancelOrder) {
        onCancelOrder();
      }
    }
  };

  return (
    <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xl shadow-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: 주문 취소 (빨간색) */}
      <button
        type="button"
        onClick={handleCancel}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 transition active:scale-98"
      >
        <AlertTriangle className="w-4 h-4" />
        <span>주문 취소</span>
      </button>

      {/* Right: 상태 변경 드롭다운 + 저장 */}
      <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
        <div className="flex items-center gap-2">
          <label htmlFor="status-select" className="text-xs font-semibold text-slate-600 shrink-0">
            주문 상태 변경:
          </label>
          <select
            id="status-select"
            aria-label="주문 상태 변경"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-98 shadow-sm ${
            savedSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? '저장됨' : '상태 저장'}</span>
        </button>
      </div>
    </div>
  );
}

