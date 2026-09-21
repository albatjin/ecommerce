'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CustomerOrderHistoryItem, formatCurrencyWon } from '../../domain/entities/customer';

interface CustomerOrderHistoryCardProps {
  orders?: CustomerOrderHistoryItem[];
}

const DEFAULT_ORDERS: CustomerOrderHistoryItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-20250224-8819',
    productSummary: '모던 캐시미어 블렌드 오버사이즈 코트 외 1건',
    amount: 342000,
    status: '배송완료',
    orderDate: '2025.02.24 18:22',
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-20250210-6421',
    productSummary: '프리미엄 메리노울 니트 가디건',
    amount: 159000,
    status: '배송완료',
    orderDate: '2025.02.10 11:15',
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-20250119-3289',
    productSummary: '천연 소가죽 클래식 스퀘어 토트백',
    amount: 289000,
    status: '배송완료',
    orderDate: '2025.01.19 14:02',
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-20241225-1104',
    productSummary: '에센셜 실크 블라우스 & 슬림 핀턱 팬츠',
    amount: 218000,
    status: '배송완료',
    orderDate: '2024.12.25 21:40',
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-20241114-0982',
    productSummary: '데일리 리사이클 패딩 베스트 (Black)',
    amount: 89000,
    status: '결제완료',
    orderDate: '2024.11.14 09:12',
  },
];

export function CustomerOrderHistoryCard({
  orders = DEFAULT_ORDERS,
}: CustomerOrderHistoryCardProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const items = orders.length > 0 ? orders : DEFAULT_ORDERS;

  const filteredOrders = items.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '배송완료':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            배송완료
          </span>
        );
      case '결제완료':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            결제완료
          </span>
        );
      case '배송중':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            배송중
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      data-testid="order-history-card"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
    >
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">주문 히스토리</h2>
            <p className="text-[11px] text-slate-400">최근 1년 기준 정렬</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">전체 주문 상태</option>
              <option value="배송완료">배송완료</option>
              <option value="결제완료">결제완료</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Excel Download */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>엑셀 다운로드</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">주문번호</th>
              <th className="py-3 px-4">상품요약</th>
              <th className="py-3 px-4 text-right">금액</th>
              <th className="py-3 px-4 text-center">상태</th>
              <th className="py-3 px-4 text-right">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  해당 조건의 주문 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  data-testid="order-history-row"
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* 주문번호 */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:underline hover:text-blue-800 transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  {/* 상품요약 */}
                  <td className="py-3.5 px-4 text-slate-900 font-medium max-w-xs truncate">
                    {order.productSummary}
                  </td>

                  {/* 금액 */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrencyWon(order.amount)}
                  </td>

                  {/* 상태 */}
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* 날짜 */}
                  <td className="py-3.5 px-4 text-right text-slate-500 font-normal">
                    {order.orderDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>총 18건 중 1-5건 표시</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            4
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

