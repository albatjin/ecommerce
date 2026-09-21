'use client';

import React from 'react';
import { CreditCard, Sparkles } from 'lucide-react';

interface ProductPricingCardProps {
  regularPrice: number;
  discountRate: number;
  taxType: 'TAXABLE' | 'TAX_EXEMPT';
  maxOrderQuantity: number;
  priceErrorMessage?: string;
  discountRateErrorMessage?: string;
  maxOrderQuantityErrorMessage?: string;
  onRegularPriceChange: (price: number) => void;
  onDiscountRateChange: (rate: number) => void;
  onTaxTypeChange: (type: 'TAXABLE' | 'TAX_EXEMPT') => void;
  onMaxOrderQuantityChange: (qty: number) => void;
}

export function ProductPricingCard({
  regularPrice,
  discountRate,
  taxType,
  maxOrderQuantity,
  priceErrorMessage,
  discountRateErrorMessage,
  maxOrderQuantityErrorMessage,
  onRegularPriceChange,
  onDiscountRateChange,
  onTaxTypeChange,
  onMaxOrderQuantityChange,
}: ProductPricingCardProps) {
  const discountAmount = Math.round((regularPrice * discountRate) / 100);
  const finalPrice = Math.max(0, regularPrice - discountAmount);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">판매 가격 및 정산 설정</h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>실시간 마진 계산 중</span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Regular Price */}
        <div className="space-y-1.5">
          <label htmlFor="regular-price" className="block text-xs font-semibold text-slate-700">
            정상 판매가 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="regular-price"
              type="number"
              min="0"
              value={regularPrice || ''}
              onChange={(e) => onRegularPriceChange(Number(e.target.value) || 0)}
              className={`w-full px-3 py-2 pr-8 text-xs font-mono font-medium rounded-xl border transition-all ${
                priceErrorMessage
                  ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/50 focus:ring-blue-500/20 focus:border-blue-500'
              } focus:outline-none focus:ring-2 text-slate-900`}
              placeholder="0"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">원</span>
          </div>
          {priceErrorMessage ? (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{priceErrorMessage}</p>
          ) : (
            <p className="text-[11px] text-slate-400">소비자가 기준 권장 가격</p>
          )}
        </div>

        {/* Discount Rate */}
        <div className="space-y-1.5">
          <label htmlFor="discount-rate" className="block text-xs font-semibold text-slate-700">
            할인 프로모션 (%)
          </label>
          <div className="relative">
            <input
              id="discount-rate"
              type="number"
              value={discountRate !== undefined ? discountRate : ''}
              onChange={(e) => onDiscountRateChange(e.target.value === '' ? 0 : Number(e.target.value))}
              className={`w-full px-3 py-2 pr-8 text-xs font-mono font-medium rounded-xl border transition-all ${
                discountRateErrorMessage
                  ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/50 focus:ring-blue-500/20 focus:border-blue-500'
              } focus:outline-none focus:ring-2 text-slate-900`}
              placeholder="0"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">%</span>
          </div>
          {discountRateErrorMessage ? (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{discountRateErrorMessage}</p>
          ) : (
            <p className="text-[11px] text-indigo-600 font-medium">
              {discountAmount > 0 ? `할인 적용 금액: -${discountAmount.toLocaleString()}원` : '할인 미적용'}
            </p>
          )}
        </div>

        {/* Final Estimated Price Display */}
        <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col justify-center">
          <div className="text-[11px] text-slate-500 font-medium">최종 결제 예정가</div>
          <div className="text-xl font-extrabold text-blue-700 tracking-tight font-mono">
            {finalPrice.toLocaleString()} <span className="text-xs font-semibold">KRW</span>
          </div>
          <div className="text-[10px] text-slate-400">부가세 10% 포함 기준</div>
        </div>
      </div>

      {/* Tax & Quantity limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
        {/* Tax Type */}
        <div className="space-y-1.5">
          <span className="block text-xs font-semibold text-slate-700">부가세 구분</span>
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="radio"
                name="tax-type"
                value="TAXABLE"
                checked={taxType === 'TAXABLE'}
                onChange={() => onTaxTypeChange('TAXABLE')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>과세 상품 (10%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="radio"
                name="tax-type"
                value="TAX_EXEMPT"
                checked={taxType === 'TAX_EXEMPT'}
                onChange={() => onTaxTypeChange('TAX_EXEMPT')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>면세 상품 (영세/농수산)</span>
            </label>
          </div>
        </div>

        {/* Max Order Quantity */}
        <div className="space-y-1.5">
          <label htmlFor="max-order-qty" className="block text-xs font-semibold text-slate-700">
            1인당 1회 최대 주문 한도
          </label>
          <div className="relative">
            <input
              id="max-order-qty"
              type="number"
              value={maxOrderQuantity !== undefined ? maxOrderQuantity : ''}
              onChange={(e) => onMaxOrderQuantityChange(e.target.value === '' ? 0 : Number(e.target.value))}
              className={`w-full px-3 py-2 pr-16 text-xs font-mono rounded-xl border transition-all ${
                maxOrderQuantityErrorMessage
                  ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/50 focus:ring-blue-500/20 focus:border-blue-500'
              } focus:outline-none focus:ring-2`}
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">개 한정</span>
          </div>
          {maxOrderQuantityErrorMessage && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{maxOrderQuantityErrorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

