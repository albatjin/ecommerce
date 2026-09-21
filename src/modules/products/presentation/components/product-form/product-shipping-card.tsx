'use client';

import React from 'react';
import { Truck, Info } from 'lucide-react';

export function ProductShippingCard() {
  return (
    <div className="space-y-4">
      {/* Shipping Policy Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">물류 및 배송 정책</h2>
        </div>

        <div className="space-y-3">
          {/* Shipping Fee Template */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              배송비 템플릿 <span className="text-rose-500">*</span>
            </label>
            <select
              aria-label="배송비 템플릿"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option>기본 배송 정책 (기본 3,000원 / 50,000원 이상 무료)</option>
              <option>무료 배송 (전액 지원)</option>
              <option>도서산간 추가 배송비 정책</option>
            </select>
          </div>

          {/* Dedicated Courier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              연동 전담 택배사
            </label>
            <select
              aria-label="연동 전담 택배사"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            >
              <option>CJ대한통운 (자동 송장 API 연동)</option>
              <option>우체국택배 (자동 송장 API 연동)</option>
              <option>한진택배</option>
              <option>로젠택배</option>
            </select>
          </div>

          {/* Origin Address */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">출고 / 반품지 주소</span>
              <button
                type="button"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                주소록 관리
              </button>
            </div>
            <p className="text-slate-600">경기도 김포시 고촌읍 아라육로 120 (제1물류센터 D-41)</p>
            <p className="text-[11px] text-slate-400">반품 배송비: 편도 3,000원 (왕복 6,000원 차감)</p>
          </div>
        </div>
      </div>

      {/* Sync Notification Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900">알림:</span> 상품 등록 완료 후 네이버쇼핑 및 쿠팡 마켓플레이스로 자동 데이터 파이프라인 전송이 진행됩니다.
        </div>
      </div>
    </div>
  );
}

