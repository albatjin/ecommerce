'use client';

import React, { useState } from 'react';
import { Truck, Copy, Check, ExternalLink } from 'lucide-react';

interface OrderTrackingCardProps {
  initialCompany?: string;
  initialTrackingNumber?: string;
  onSaveTracking?: (company: string, trackingNumber: string) => void;
}

const COURIER_OPTIONS = [
  'CJ대한통운 (택배)',
  '우체국택배',
  '한진택배',
  '로젠택배',
  '롯데택배',
];

export function OrderTrackingCard({
  initialCompany = 'CJ대한통운 (택배)',
  initialTrackingNumber = '689124409121',
  onSaveTracking,
}: OrderTrackingCardProps) {
  const [company, setCompany] = useState(initialCompany);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (onSaveTracking) {
      onSaveTracking(company, trackingNumber);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">배송 및 운송장 설정</h3>
        </div>

        <a
          href="https://www.cjlogistics.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <span>CJ대한통운 배송조회</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Form Fields: 택배사 드롭다운 + 운송장번호 입력칸 + 등록 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* 택배사 선택 */}
        <div className="md:col-span-4 space-y-1.5">
          <label htmlFor="courier-select" className="block text-xs font-semibold text-slate-600">
            택배사 선택
          </label>
          <select
            id="courier-select"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {COURIER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 운송장 번호 */}
        <div className="md:col-span-5 space-y-1.5">
          <label htmlFor="tracking-input" className="block text-xs font-semibold text-slate-600">
            운송장 번호
          </label>
          <div className="relative">
            <input
              id="tracking-input"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="운송장 번호를 입력하세요"
              className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="button"
              onClick={handleCopy}
              title="운송장 번호 복사"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 송장 등록/수정 버튼 */}
        <div className="md:col-span-3">
          <button
            type="button"
            onClick={handleSave}
            className={`w-full h-10 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition shadow-xs ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isSaved ? '등록 완료!' : '송장 등록/수정'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

