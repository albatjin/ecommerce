'use client';

import React from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { OrderItem } from '../../domain/entities/order';

interface OrderItemsCardProps {
  items: OrderItem[];
  totalProductAmount: number;
  shippingFee: number;
  finalPaidAmount: number;
  onCheckStock?: () => void;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function OrderItemsCard({
  items,
  totalProductAmount,
  shippingFee,
  finalPaidAmount,
  onCheckStock,
}: OrderItemsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <span>주문 상품 목록</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {items.length}건
            </span>
          </h3>
        </div>

        <button
          type="button"
          onClick={onCheckStock}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <span>재고 현황 조회</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[12px] font-semibold text-slate-500 border-b border-slate-200">
              <th className="py-3 px-4">상품 정보</th>
              <th className="py-3 px-3 text-right">단가</th>
              <th className="py-3 px-3 text-center">수량</th>
              <th className="py-3 px-3 text-right">쿠폰 할인</th>
              <th className="py-3 px-4 text-center">배송비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                {/* Product Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-14 h-16 rounded-xl bg-slate-800 text-white shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs relative">
                      <div className="w-8 h-10 bg-slate-700 rounded-sm flex items-center justify-center text-[10px] text-slate-300">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // fallback
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        🧥
                      </div>
                    </div>

                    <div className="space-y-1">
                      {item.categoryTag && (
                        <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.categoryTag}
                        </span>
                      )}
                      <div className="font-bold text-slate-900 text-sm leading-tight">
                        {item.productName}
                      </div>
                      {item.option && (
                        <div className="text-xs text-slate-500">
                          {item.option}
                        </div>
                      )}
                      {item.sku && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          SKU: {item.sku}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Unit Price */}
                <td className="py-4 px-3 text-right font-mono font-semibold text-slate-900">
                  {formatWon(item.unitPrice)}
                </td>

                {/* Quantity */}
                <td className="py-4 px-3 text-center font-mono font-medium text-slate-800">
                  {item.quantity}
                </td>

                {/* Coupon Discount */}
                <td className="py-4 px-3 text-right font-mono">
                  {item.couponDiscount > 0 ? (
                    <span className="text-rose-600 font-semibold">
                      -{formatWon(item.couponDiscount)}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                {/* Shipping Fee */}
                <td className="py-4 px-4 text-center">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    {item.shippingFee === 0 ? '무료' : formatWon(item.shippingFee)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Bar: 상품합계, 배송비, 총 결제금액 */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70 p-4 rounded-xl text-xs">
        <div className="flex items-center gap-6 text-slate-600">
          <div>
            <span className="text-slate-500 mr-2">상품합계:</span>
            <span className="font-bold font-mono text-slate-900">{formatWon(totalProductAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-2">배송비:</span>
            <span className="font-bold font-mono text-slate-900">
              {shippingFee === 0 ? '0원 (무료)' : formatWon(shippingFee)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">총 결제금액:</span>
          <span className="text-base font-extrabold font-mono text-blue-600">
            {formatWon(finalPaidAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

