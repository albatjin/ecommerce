'use client';

import React from 'react';
import { OrderDto } from '../../application/dto/order.dto';
import { ChevronRight } from 'lucide-react';

interface OrderTableProps {
  orders: OrderDto[];
  onOrderClick: (order: OrderDto) => void;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function OrderTable({ orders, onOrderClick }: OrderTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[13px] font-semibold text-slate-600">
              <th className="py-3.5 pl-6 pr-4 min-w-[160px]">주문번호</th>
              <th className="py-3.5 px-4 min-w-[100px]">고객명</th>
              <th className="py-3.5 px-4 min-w-[220px]">상품요약</th>
              <th className="py-3.5 px-4 text-right min-w-[110px]">결제금액</th>
              <th className="py-3.5 px-4 text-center min-w-[100px]">주문상태</th>
              <th className="py-3.5 px-4 text-center min-w-[140px]">주문일시</th>
              <th className="py-3.5 pr-6 pl-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  해당 조건의 주문 내역이 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onOrderClick(order)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  {/* 주문번호 */}
                  <td className="py-3.5 pl-6 pr-4 font-mono font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    {order.orderNumber}
                  </td>

                  {/* 고객명 */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {order.customerName}
                  </td>

                  {/* 상품요약 */}
                  <td className="py-3.5 px-4 text-slate-600 line-clamp-1 max-w-[260px]">
                    {order.orderSummary}
                  </td>

                  {/* 결제금액 */}
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900 font-mono">
                    {formatWon(order.paidAmount)}
                  </td>

                  {/* 주문상태 색상 배지 (결제대기:노랑, 결제완료:파랑, 배송중:보라, 배송완료:초록) */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${order.statusBadgeClass}`}
                    >
                      {order.statusLabel}
                    </span>
                  </td>

                  {/* 주문일시 */}
                  <td className="py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
                    {order.orderDate}
                  </td>

                  {/* 우측 화살표 */}
                  <td className="py-3.5 pr-6 pl-2 text-right text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-4 h-4 inline-block" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

