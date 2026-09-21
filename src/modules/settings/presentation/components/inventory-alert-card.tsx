'use client';

import React from 'react';
import { BellRing, Mail, MessageSquare, ExternalLink } from 'lucide-react';

interface InventoryAlertCardProps {
  lowStockThreshold: number;
  emailAlertEnabled: boolean;
  slackAlertEnabled: boolean;
  onThresholdChange: (value: number) => void;
  onEmailAlertChange: (value: boolean) => void;
  onSlackAlertChange: (value: boolean) => void;
  onSlackIntegrateClick: () => void;
}

export function InventoryAlertCard({
  lowStockThreshold,
  emailAlertEnabled,
  slackAlertEnabled,
  onThresholdChange,
  onEmailAlertChange,
  onSlackAlertChange,
  onSlackIntegrateClick,
}: InventoryAlertCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-semibold">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">재고 알림 설정</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              재고 부족 및 긴급 알림 발생 시 담당자에게 전달되는 규칙을 설정합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {/* 재고 부족 기준 입력칸 */}
        <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <label htmlFor="low-stock-threshold-input" className="text-xs font-bold text-slate-900 block cursor-pointer">
              재고 부족 기준 (개)
            </label>
            <p className="text-[11px] text-slate-500">
              보유 재고 수량이 설정한 수치 이하로 감소하면 관리자 알림이 발송됩니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="low-stock-threshold-input"
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => onThresholdChange(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-right font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <span className="text-xs font-medium text-slate-600">개</span>
          </div>
        </div>

        {/* 이메일 알림 토글 */}
        <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">이메일 알림</span>
              <p className="text-[11px] text-slate-500">
                재고 소진 임박 시 담당자 이메일로 알림 메일을 즉시 발송합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-label="이메일 알림"
            aria-checked={emailAlertEnabled}
            onClick={() => onEmailAlertChange(!emailAlertEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              emailAlertEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                emailAlertEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 슬랙 알림 토글 + 연동하기 버튼 */}
        <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">슬랙 알림</span>
                <span className="px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                  실시간 웹훅
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                지정된 사내 슬랙 채널로 재고 현황 및 긴급 알림 메시지를 전송합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={onSlackIntegrateClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>연동하기</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-label="슬랙 알림"
              aria-checked={slackAlertEnabled}
              onClick={() => onSlackAlertChange(!slackAlertEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                slackAlertEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  slackAlertEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

