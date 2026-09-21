'use client';

import React, { useRef } from 'react';
import { Store, Upload, Image as ImageIcon } from 'lucide-react';
import { Currency, ALLOWED_CURRENCIES } from '../../domain/entities/store-settings';

interface StoreBasicInfoCardProps {
  storeName: string;
  logoUrl: string;
  currency: Currency;
  isTaxIncluded: boolean;
  onStoreNameChange: (value: string) => void;
  onLogoChange: (url: string) => void;
  onCurrencyChange: (value: Currency) => void;
  onTaxIncludedChange: (value: boolean) => void;
}

const CURRENCY_LABELS: Record<Currency, string> = {
  KRW: 'KRW (₩ - 대한민국 원)',
  USD: 'USD ($ - 미국 달러)',
  EUR: 'EUR (€ - 유로)',
  JPY: 'JPY (¥ - 일본 엔)',
};

export function StoreBasicInfoCard({
  storeName,
  logoUrl,
  currency,
  isTaxIncluded,
  onStoreNameChange,
  onLogoChange,
  onCurrencyChange,
  onTaxIncludedChange,
}: StoreBasicInfoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      onLogoChange(tempUrl);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">스토어 기본 정보</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              전자상거래법 및 사업자 정보 표시에 사용되는 기본 스토어 설정입니다.
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[11px] font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
          필수 설정
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* 스토어명 */}
        <div className="space-y-2">
          <label htmlFor="store-name-input" className="block text-xs font-bold text-slate-700">
            스토어명 <span className="text-rose-500">*</span>
          </label>
          <input
            id="store-name-input"
            type="text"
            value={storeName}
            onChange={(e) => onStoreNameChange(e.target.value)}
            placeholder="스토어 이름을 입력하세요"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* 통화 선택 */}
        <div className="space-y-2">
          <label htmlFor="currency-select" className="block text-xs font-bold text-slate-700">
            통화 <span className="text-rose-500">*</span>
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 font-medium cursor-pointer"
          >
            {ALLOWED_CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {CURRENCY_LABELS[cur]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 로고 업로드 & 세금 포함 가격 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
        {/* 로고 업로드 */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-700">로고 이미지</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {logoUrl ? (
                <div className="w-full h-full flex items-center justify-center p-2 bg-slate-100/50">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    CH
                  </div>
                </div>
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>변경</span>
              </button>
              <p className="text-[11px] text-slate-400">권장 규격: SVG, PNG (투명배경)</p>
            </div>
          </div>
        </div>

        {/* 세금 포함 가격 토글 */}
        <div className="flex items-center justify-between p-4 bg-slate-50/70 border border-slate-100 rounded-xl self-start">
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-bold text-slate-900 block">세금 포함 가격</span>
            <p className="text-[11px] text-slate-500">
              상품 가격에 부가세(VAT 10%)가 포함되어 표시됩니다.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-label="세금 포함 가격"
            aria-checked={isTaxIncluded}
            onClick={() => onTaxIncludedChange(!isTaxIncluded)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isTaxIncluded ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isTaxIncluded ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

