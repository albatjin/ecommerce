'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Star,
  Coins,
  KeyRound,
  UserX,
  Edit3,
  ChevronRight,
} from 'lucide-react';
import { CustomerDetail } from '../../domain/entities/customer';

interface CustomerDetailHeaderProps {
  customer: CustomerDetail;
  onEditClick: () => void;
  onRewardPointsClick?: () => void;
  onResetPasswordClick?: () => void;
  onWithdrawClick?: () => void;
}

export function CustomerDetailHeader({
  customer,
  onEditClick,
  onRewardPointsClick,
  onResetPasswordClick,
  onWithdrawClick,
}: CustomerDetailHeaderProps) {
  // Join days calculation
  const joinDate = new Date(customer.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) || 594;
  const formattedJoinDate = customer.createdAt.slice(0, 10).replace(/-/g, '.');

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>/</span>
          <span>Console</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/customers" className="hover:text-slate-800 transition-colors">
          고객 관리
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/customers" className="hover:text-slate-800 transition-colors">
          고객 목록
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-semibold">고객 상세</span>
      </nav>

      {/* Main Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Customer Name, Grade Badge, Status, Joined Days */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {customer.name}
          </h1>

          {/* Membership Grade Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Star className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
            <span>{customer.membershipGrade} 회원</span>
          </div>

          {/* Active Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>정상 활동</span>
          </div>

          {/* Joined Date & Days */}
          <span className="text-xs text-slate-500 font-medium ml-1">
            가입일: {formattedJoinDate} (D+{diffDays})
          </span>
        </div>

        {/* Right: Actions (수정 버튼, 적립금, 비밀번호 초기화, 탈퇴 처리) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 수정 버튼 */}
          <button
            type="button"
            onClick={onEditClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>고객 정보 수정</span>
          </button>

          {/* 적립금 지급/차감 */}
          <button
            type="button"
            onClick={onRewardPointsClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <Coins className="w-4 h-4 text-blue-600" />
            <span>적립금 지급/차감</span>
          </button>

          {/* 비밀번호 초기화 메일 */}
          <button
            type="button"
            onClick={onResetPasswordClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>비밀번호 초기화 메일</span>
          </button>

          {/* 회원 탈퇴 처리 */}
          <button
            type="button"
            onClick={onWithdrawClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <UserX className="w-4 h-4" />
            <span>회원 탈퇴 처리</span>
          </button>
        </div>
      </div>
    </div>
  );
}

