'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export interface SkuOptionItem {
  id: string;
  name: string;
  additionalPrice: number;
  stockQuantity: number;
  status: 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface ProductSkuOptionsCardProps {
  totalStockQuantity: number;
  stockErrorMessage?: string;
  onTotalStockChange: (qty: number) => void;
}

export function ProductSkuOptionsCard({
  totalStockQuantity,
  stockErrorMessage,
  onTotalStockChange,
}: ProductSkuOptionsCardProps) {
  const [useMultiOptions, setUseMultiOptions] = useState(true);
  const [options, setOptions] = useState<SkuOptionItem[]>([
    {
      id: 'sku-1',
      name: 'Charcoal Gray / 48 (Medium)',
      additionalPrice: 0,
      stockQuantity: 45,
      status: 'ACTIVE',
    },
    {
      id: 'sku-2',
      name: 'Charcoal Gray / 50 (Large)',
      additionalPrice: 0,
      stockQuantity: 12,
      status: 'LOW_STOCK',
    },
    {
      id: 'sku-3',
      name: 'Classic Navy / 52 (X-Large)',
      additionalPrice: 5000,
      stockQuantity: 0,
      status: 'OUT_OF_STOCK',
    },
  ]);

  const handleDelete = (id: string) => {
    const updated = options.filter((item) => item.id !== id);
    setOptions(updated);
    const sum = updated.reduce((acc, curr) => acc + curr.stockQuantity, 0);
    onTotalStockChange(sum);
  };

  const handleStockChange = (id: string, qty: number) => {
    const updated = options.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, qty);
        let status: 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'ACTIVE';
        if (newQty === 0) status = 'OUT_OF_STOCK';
        else if (newQty < 15) status = 'LOW_STOCK';
        return { ...item, stockQuantity: newQty, status };
      }
      return item;
    });
    setOptions(updated);
    const sum = updated.reduce((acc, curr) => acc + curr.stockQuantity, 0);
    onTotalStockChange(sum);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">재고 및 품목 옵션 (SKU)</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-600">다중 옵션 적용</span>
          <button
            type="button"
            role="switch"
            aria-checked={useMultiOptions}
            onClick={() => setUseMultiOptions(!useMultiOptions)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              useMultiOptions ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                useMultiOptions ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Stock Field */}
      <div className="space-y-1.5">
        <label htmlFor="total-stock" className="block text-xs font-semibold text-slate-700">
          재고 수량 (총 가용재고) <span className="text-rose-500">*</span>
        </label>
        <div className="relative max-w-xs">
          <input
            id="total-stock"
            type="number"
            value={totalStockQuantity !== undefined ? totalStockQuantity : ''}
            onChange={(e) => onTotalStockChange(Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 pr-10 text-xs font-mono font-medium rounded-xl border transition-all ${
              stockErrorMessage
                ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 bg-slate-50/50 focus:ring-indigo-500/20 focus:border-indigo-500'
            } focus:outline-none focus:ring-2`}
            placeholder="0"
          />
          <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">개</span>
        </div>
        {stockErrorMessage && (
          <p className="text-[11px] font-medium text-rose-500 mt-1">{stockErrorMessage}</p>
        )}
      </div>

      {/* Multi-options details */}
      {useMultiOptions && (
        <div className="space-y-4 pt-1">
          {/* Attributes tags preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">등록된 기본 규격 속성:</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>새 속성 추가</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span className="font-semibold text-slate-900">색상:</span> Charcoal Gray, Classic Navy
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <span className="font-semibold text-slate-900">사이즈:</span> 48 (Medium), 50 (Large), 52 (X-Large)
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">조합 규격명 (SKU NAME)</th>
                  <th className="px-3 py-2.5 text-right">옵션 추가금액</th>
                  <th className="px-3 py-2.5 text-right">현재 가용재고</th>
                  <th className="px-3 py-2.5 text-center">판매 상태</th>
                  <th className="px-3 py-2.5 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {options.map((opt) => (
                  <tr key={opt.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-3 py-2.5 font-medium text-slate-800">{opt.name}</td>
                    <td className="px-3 py-2.5 text-right font-mono">
                      +{opt.additionalPrice.toLocaleString()} 원
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <input
                        type="number"
                        min="0"
                        value={opt.stockQuantity}
                        onChange={(e) => handleStockChange(opt.id, Number(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-right font-mono text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {opt.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> 판매중
                        </span>
                      )}
                      {opt.status === 'LOW_STOCK' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> 품절임박
                        </span>
                      )}
                      {opt.status === 'OUT_OF_STOCK' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> 일시품절
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(opt.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="옵션 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

