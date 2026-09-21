'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Gift, ArrowUpCircle, MessageSquare } from 'lucide-react';

import {
  Customer,
  CustomerGrade,
  isVipCustomer,
  formatCurrencyWon,
  formatPoints,
} from '../../domain/entities/customer';

interface CustomerTableProps {
  customers: Customer[];
  totalCount: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectCustomer: (id: string) => void;
  onRewardPointsAction: () => void;
  onGradeChangeAction: () => void;
  onGroupMessageAction: () => void;
}

function getGradeBadge(grade: CustomerGrade) {
  switch (grade) {
    case 'VVIP':
      return (
        <span
          data-testid="vip-badge"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-900 text-purple-200 border border-purple-700"
        >
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          VVIP
        </span>
      );
    case 'VIP':
      return (
        <span
          data-testid="vip-badge"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs"
        >
          <Star className="w-3 h-3 fill-white text-white" />
          VIP
        </span>
      );
    case 'GOLD':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          골드
        </span>
      );
    case 'SILVER':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          실버
        </span>
      );
    case 'BRONZE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200">
          브론즈
        </span>
      );
  }
}

function getMarketingBadge(customer: Customer) {
  if (customer.smsConsent && customer.emailConsent) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
        동의(SMS/이메일)
      </span>
    );
  }
  if (customer.smsConsent) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700">
        SMS만 동의
      </span>
    );
  }
  if (customer.emailConsent) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700">
        이메일만 동의
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500">
      전체 미동의
    </span>
  );
}

export function CustomerTable({
  customers,
  totalCount,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectCustomer,
  onRewardPointsAction,
  onGradeChangeAction,
  onGroupMessageAction,
}: CustomerTableProps) {
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Action / Selection Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span data-testid="selected-count-label" className="font-semibold text-slate-700">
            선택 고객: <span className="text-blue-600 font-bold">{selectedIds.length}명</span> / 총{' '}
            {totalCount.toLocaleString()}명
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRewardPointsAction}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer shadow-2xs"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>적립금 지급</span>
          </button>
          <button
            type="button"
            onClick={onGradeChangeAction}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer shadow-2xs"
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>등급 변경</span>
          </button>
          <button
            type="button"
            onClick={onGroupMessageAction}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>그룹 메시지</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5 w-10 text-center">선택</th>
              <th className="p-3.5">회원번호</th>
              <th className="p-3.5">고객명</th>
              <th className="p-3.5">연락처 / 이메일</th>
              <th className="p-3.5">회원등급</th>
              <th className="p-3.5 text-right">누적 구매금액</th>
              <th className="p-3.5 text-center">총 주문</th>
              <th className="p-3.5 text-right">보유 적립금</th>
              <th className="p-3.5">가입일</th>
              <th className="p-3.5 text-center">마케팅</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-slate-400">
                  일치하는 고객 정보가 없습니다.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isSelected = selectedIds.includes(customer.id);
                const isVip = isVipCustomer(customer);
                const firstChar = customer.name.charAt(0);

                return (
                  <tr
                    key={customer.id}
                    data-testid="customer-row"
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectCustomer(customer.id)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* 회원번호 */}
                    <td className="p-3.5 font-mono text-slate-500 font-medium">
                      {customer.customerNumber}
                    </td>

                    {/* 고객명 + VIP 별 아이콘 */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {firstChar}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/customers/${customer.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                          >
                            {customer.name}
                          </Link>
                          {isVip && (

                            <span title="VIP 고객" className="inline-flex">
                              <Star
                                data-testid="vip-star-icon"
                                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                              />
                            </span>
                          )}
                          {customer.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                              NEW
                            </span>
                          )}
                          {customer.status === 'DORMANT_WARNING' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              휴면예정
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 연락처 / 이메일 */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{customer.phone}</div>
                      <div className="text-[11px] text-slate-400">{customer.email}</div>
                    </td>

                    {/* 회원등급 */}
                    <td className="p-3.5">{getGradeBadge(customer.membershipGrade)}</td>

                    {/* 누적 구매금액 */}
                    <td className="p-3.5 text-right font-semibold text-slate-900">
                      {formatCurrencyWon(customer.totalSpent)}
                    </td>

                    {/* 총 주문 */}
                    <td className="p-3.5 text-center font-medium text-slate-800">
                      {customer.totalOrders}회
                    </td>

                    {/* 보유 적립금 */}
                    <td className="p-3.5 text-right font-medium text-emerald-600">
                      {formatPoints(customer.rewardPoints)}
                    </td>

                    {/* 가입일 / 최근 방문 */}
                    <td className="p-3.5">
                      <div className="text-slate-700 font-medium">
                        {customer.createdAt.slice(0, 10).replace(/-/g, '.')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        최근: {customer.lastVisitAt.slice(0, 10).replace(/-/g, '.')}
                      </div>
                    </td>

                    {/* 마케팅 */}
                    <td className="p-3.5 text-center">{getMarketingBadge(customer)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
