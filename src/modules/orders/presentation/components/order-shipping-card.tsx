'use client';

import React from 'react';
import { MapPin, Edit3, MessageSquare } from 'lucide-react';
import { OrderShippingInfo } from '../../domain/entities/order';

interface OrderShippingCardProps {
  shipping: OrderShippingInfo;
  onEditAddress?: () => void;
}

export function OrderShippingCard({ shipping, onEditAddress }: OrderShippingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">배송지 정보</h3>
        </div>

        <button
          type="button"
          onClick={onEditAddress}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>배송지 수정</span>
        </button>
      </div>

      {/* Recipient & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="block text-slate-400 font-medium mb-1">수령인</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{shipping.recipientName}</span>
            {shipping.isDefaultAddress && (
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                기본 배송지
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="block text-slate-400 font-medium mb-1">연락처</span>
          <span className="text-sm font-bold text-slate-900 font-mono">{shipping.phone}</span>
        </div>
      </div>

      {/* Address */}
      <div className="text-xs">
        <span className="block text-slate-400 font-medium mb-1">배송 주소</span>
        <div className="text-slate-800 font-medium leading-relaxed">
          {shipping.zipcode && <span className="font-mono text-slate-500 mr-1.5">[{shipping.zipcode}]</span>}
          <span>{shipping.address}</span>
        </div>
      </div>

      {/* Delivery Memo */}
      {shipping.memo && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-slate-600 block mb-0.5">배송 요청사항</span>
            <p className="text-slate-700 font-medium">“{shipping.memo}”</p>
          </div>
        </div>
      )}
    </div>
  );
}

