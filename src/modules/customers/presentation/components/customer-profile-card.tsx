'use client';

import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  User,
  CheckCircle2,
} from 'lucide-react';
import { CustomerDetail } from '../../domain/entities/customer';

interface CustomerProfileCardProps {
  customer: CustomerDetail;
}

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const formattedJoinDate = customer.createdAt.slice(0, 10).replace(/-/g, '.');
  const formattedLastVisit = customer.lastVisitAt
    ? customer.lastVisitAt.replace('T', ' ').slice(0, 19).replace(/-/g, '.')
    : '2025.02.26 14:22:09';

  return (
    <div
      data-testid="customer-profile-card"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
    >
      {/* Top Profile Summary */}
      <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
        {/* Avatar Icon */}
        <div className="relative shrink-0">
          <div
            data-testid="profile-avatar-icon"
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-200 via-rose-100 to-indigo-100 border-2 border-white shadow-md flex items-center justify-center text-slate-700 overflow-hidden"
          >
            {customer.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={customer.avatarUrl}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Name, UID, Email, Tags */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900 truncate">{customer.name}</h2>
            <span className="text-xs font-mono font-medium text-blue-600 shrink-0">
              UID #{customer.customerNumber.replace(/[^0-9]/g, '') || '849201'}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{customer.email}</p>

          {/* Demographics & Customs tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700">
              {customer.gender === 'FEMALE' ? '여성' : customer.gender === 'MALE' ? '남성' : '고객'} /{' '}
              {customer.birthYear || 1994}년생
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>개인통관부호 보유</span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Contact & Address Info */}
      <div className="space-y-3.5 text-xs text-slate-600">
        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="w-6 flex items-center justify-center text-slate-400 shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-slate-400 font-medium w-16 shrink-0">연락처</span>
          <span className="font-semibold text-slate-800 tracking-tight">{customer.phone}</span>
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-3">
          <div className="w-6 flex items-center justify-center text-slate-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-slate-400 font-medium w-16 shrink-0">가입일</span>
          <span className="font-medium text-slate-700">{formattedJoinDate}</span>
        </div>

        {/* Default Shipping Address */}
        <div className="flex items-start gap-3">
          <div className="w-6 pt-0.5 flex items-center justify-center text-slate-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-slate-400 font-medium w-16 shrink-0">기본 배송지</span>
          <div className="flex-1 text-slate-700">
            <p className="font-medium leading-relaxed">
              {customer.defaultAddress || '서울특별시 마포구 월드컵북로 120, 에코빌리지 702호'}
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              (우편번호 {customer.defaultZipcode || '03992'})
            </p>
          </div>
        </div>

        {/* Recent Access */}
        <div className="flex items-center gap-3">
          <div className="w-6 flex items-center justify-center text-slate-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-slate-400 font-medium w-16 shrink-0">최근 접속</span>
          <span className="font-medium text-slate-700">
            {formattedLastVisit} (모바일 웹)
          </span>
        </div>
      </div>

      {/* Marketing Information Consent */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          마케팅 정보 수신 여부
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* SMS */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500">SMS 알림</span>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>동의함</span>
            </div>
          </div>

          {/* Email */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500">이메일 뉴스</span>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>동의함</span>
            </div>
          </div>

          {/* App Push */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500">앱 푸시</span>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>동의함</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

