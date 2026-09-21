import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { RecentOrder, OrderStatus } from '../../domain/entities/dashboard-metrics';

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

function getStatusBadgeStyle(status: OrderStatus): string {
  switch (status) {
    case 'PAID':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PREPARING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'SHIPPING':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CANCELLED':
    case 'CANCEL_REQUESTED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header & View All Link */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">최근 주문 목록</h2>
          <p className="text-xs text-slate-500 mt-0.5">실시간으로 접수된 최신 주문 내역입니다.</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>전체 보기</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-6">
                주문번호
              </th>
              <th scope="col" className="py-3.5 px-6">
                고객명
              </th>
              <th scope="col" className="py-3.5 px-6">
                상품
              </th>
              <th scope="col" className="py-3.5 px-6 text-right">
                금액
              </th>
              <th scope="col" className="py-3.5 px-6 text-center">
                상태
              </th>
              <th scope="col" className="py-3.5 px-6 text-right">
                시간
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6 font-mono font-medium text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="py-4 px-6 font-medium text-slate-900">
                  {order.customerName}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                  {order.productName}
                </td>
                <td className="py-4 px-6 font-bold text-slate-900 text-right">
                  {order.formattedAmount}
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(
                      order.status
                    )}`}
                  >
                    {order.statusLabel}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-400 text-right">
                  {order.orderedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

