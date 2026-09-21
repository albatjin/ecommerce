'use client';

import React from 'react';
import { Bell, Users, CreditCard, Shield, Plus, CheckCircle2 } from 'lucide-react';
import { SettingsTab } from './settings-tab-nav';

interface OtherTabsContentProps {
  tab: SettingsTab;
}

export function OtherTabsContent({ tab }: OtherTabsContentProps) {
  if (tab === 'notifications') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">알림 채널 및 발송 설정</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              주문 접수, 배송 상태, 결제 취소 등 고객 및 관리자 이벤트별 자동 발송 알림을 관리합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">카카오 알림톡</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded">연동 완료</span>
            </div>
            <p className="text-[11px] text-slate-500">카카오 비즈니스 채널을 통해 주문 완료 및 배송 알림톡을 발송합니다.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">SMS / LMS 문자 발송</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded">정상 작동</span>
            </div>
            <p className="text-[11px] text-slate-500">알림톡 수신 실패 시 대체 문자를 자동 발송합니다. 잔여 포인트: 15,200건</p>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'team') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-semibold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">팀원 및 관리자 권한</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                쇼핑몰 관리 콘솔에 접근할 수 있는 관리자 계정과 직무별 권한을 설정합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>팀원 초대</span>
          </button>
        </div>

        <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                김
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">김운영 (나)</span>
                <span className="text-[11px] text-slate-400">admin@commercehub.co.kr</span>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded">최고 관리자</span>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'payments') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">PG 연동 및 결제 수단 관리</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              온라인 결제대행사(PG), 간편결제(네이버페이, 카카오페이, 토스), 무통장 입금 계좌를 설정합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {['KG이니시스 (카드/가상계좌)', '네이버페이 결제형', '카카오페이'].map((pg) => (
            <div key={pg} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{pg}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-[11px] text-slate-500">실시간 승인 및 자동 에스크로 연동 활성화</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

