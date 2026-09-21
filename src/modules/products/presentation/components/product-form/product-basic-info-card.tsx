'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { CATEGORY_HIERARCHY } from '@/modules/products/domain/entities/category-data';

interface ProductBasicInfoCardProps {
  name: string;
  nameEn: string;
  category: string;
  subCategory: string;
  detailCategory: string;
  productCode: string;
  skuCode: string;
  brandName: string;
  errorMessage?: string;
  categoryErrorMessage?: string;
  onNameChange: (val: string) => void;
  onNameEnChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSubCategoryChange: (val: string) => void;
  onDetailCategoryChange: (val: string) => void;
  onSkuCodeChange: (val: string) => void;
  onBrandNameChange: (val: string) => void;
}

export function ProductBasicInfoCard({
  name,
  nameEn,
  category,
  subCategory,
  detailCategory,
  productCode,
  skuCode,
  brandName,
  errorMessage,
  categoryErrorMessage,
  onNameChange,
  onNameEnChange,
  onCategoryChange,
  onSubCategoryChange,
  onDetailCategoryChange,
  onSkuCodeChange,
  onBrandNameChange,
}: ProductBasicInfoCardProps) {
  // Current Main Category from hierarchy
  const activeMainCat = CATEGORY_HIERARCHY[category] || CATEGORY_HIERARCHY['의류'];

  // Current Sub Category from hierarchy
  const activeSubCat =
    activeMainCat.subCategories.find((s) => s.value === subCategory) ||
    activeMainCat.subCategories[0];

  // Available detail categories
  const detailOptions = activeSubCat?.detailCategories || [];

  const handleMainCategoryChange = (newCat: string) => {
    onCategoryChange(newCat);
    const mainObj = CATEGORY_HIERARCHY[newCat] || CATEGORY_HIERARCHY['의류'];
    const firstSub = mainObj.subCategories[0];
    const firstDetail = firstSub?.detailCategories[0]?.value || '';

    onSubCategoryChange(firstSub?.value || '');
    onDetailCategoryChange(firstDetail);
  };

  const handleSubCategoryChange = (newSub: string) => {
    onSubCategoryChange(newSub);
    const subObj =
      activeMainCat.subCategories.find((s) => s.value === newSub) ||
      activeMainCat.subCategories[0];
    const firstDetail = subObj?.detailCategories[0]?.value || '';

    onDetailCategoryChange(firstDetail);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">기본 정보</h2>
        </div>
        <span className="text-xs text-slate-400">* 표시는 필수 입력 항목입니다</span>
      </div>

      {/* Category Selects */}
      <div className="space-y-1.5">
        <label htmlFor="category-main" className="block text-xs font-semibold text-slate-700">
          카테고리 분류 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* 대분류 */}
          <select
            id="category-main"
            aria-label="카테고리"
            value={category}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 cursor-pointer"
          >
            {Object.values(CATEGORY_HIERARCHY).map((main) => (
              <option key={main.value} value={main.value}>
                대분류: {main.label}
              </option>
            ))}
          </select>

          {/* 중분류 */}
          <select
            aria-label="중분류"
            value={subCategory}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 cursor-pointer"
          >
            {activeMainCat.subCategories.map((sub) => (
              <option key={sub.value} value={sub.value}>
                중분류: {sub.label}
              </option>
            ))}
          </select>

          {/* 소분류 */}
          <select
            aria-label="소분류"
            value={detailCategory}
            onChange={(e) => onDetailCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 cursor-pointer"
          >
            {detailOptions.map((det) => (
              <option key={det.value} value={det.value}>
                소분류: {det.label}
              </option>
            ))}
          </select>
        </div>
        {categoryErrorMessage && (
          <p className="text-[11px] font-medium text-rose-500 mt-1">{categoryErrorMessage}</p>
        )}
      </div>

      {/* Product Name (Korean) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="product-name-ko" className="text-xs font-semibold text-slate-700">
            상품명 (국문) <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {name.length} / 100자
          </span>
        </div>
        <input
          id="product-name-ko"
          type="text"
          maxLength={100}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="예: 울 블렌드 프리미엄 싱글 브레스트 블레이저"
          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none focus:ring-2 ${
            errorMessage
              ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-slate-200 bg-slate-50/50 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {errorMessage && (
          <p className="text-[11px] font-medium text-rose-500 mt-1">{errorMessage}</p>
        )}
      </div>

      {/* Product Name (English) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="product-name-en" className="text-xs font-semibold text-slate-700">
            상품명 (영문 / 글로벌 연동)
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {nameEn.length} / 150자
          </span>
        </div>
        <input
          id="product-name-en"
          type="text"
          maxLength={150}
          value={nameEn}
          onChange={(e) => onNameEnChange(e.target.value)}
          placeholder="예: Wool Blend Premium Single-Breasted Blazer"
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* 3 Columns: System Code, SKU Code, Brand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500">시스템 상품 코드</label>
          <div className="px-3 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-600 select-all">
            {productCode || 'PRD-202410-AUTO'}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="sku-code" className="text-[11px] font-medium text-slate-500">
            자체 SKU 식별코드
          </label>
          <input
            id="sku-code"
            type="text"
            value={skuCode}
            onChange={(e) => onSkuCodeChange(e.target.value)}
            placeholder="예: JK-WL-089-BLK"
            className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="brand-name" className="text-[11px] font-medium text-slate-500">
            제조사 / 브랜드명
          </label>
          <input
            id="brand-name"
            type="text"
            value={brandName}
            onChange={(e) => onBrandNameChange(e.target.value)}
            placeholder="예: STUDIO ATELIER"
            className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
