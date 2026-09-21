'use client';

import React from 'react';
import Image from 'next/image';
import { Edit2, Trash2, ImageOff, AlertCircle } from 'lucide-react';
import { ProductDto } from '../../application/dto/product.dto';

interface ProductTableProps {
  products: ProductDto[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onEdit: (product: ProductDto) => void;
  onDelete: (id: string) => void;
}

function formatWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function ProductTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const isAllSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const isSomeSelected = products.some((p) => selectedIds.includes(p.id)) && !isAllSelected;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[13px] font-semibold text-slate-600">
              <th className="py-3.5 pl-4 pr-3 w-10">
                <input
                  type="checkbox"
                  aria-label="전체 선택"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3 w-16 text-center">이미지</th>
              <th className="py-3.5 px-4 min-w-[200px]">상품명</th>
              <th className="py-3.5 px-4">카테고리</th>
              <th className="py-3.5 px-4 text-right">가격</th>
              <th className="py-3.5 px-4 text-right">재고</th>
              <th className="py-3.5 px-4 text-center">상태</th>
              <th className="py-3.5 px-4 text-center">등록일</th>
              <th className="py-3.5 pr-4 pl-3 text-center w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  조건에 맞는 상품이 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* 체크박스 */}
                    <td className="py-3.5 pl-4 pr-3">
                      <input
                        type="checkbox"
                        aria-label={`${product.name} 선택`}
                        checked={isSelected}
                        onChange={(e) => onSelectOne(product.id, e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* 이미지 썸네일 */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative mx-auto flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized
                          />
                        ) : (
                          <ImageOff className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* 상품명 & 상품코드 */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{product.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{product.productCode}</div>
                    </td>

                    {/* 카테고리 */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {product.category}
                      </span>
                    </td>

                    {/* 가격 */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-semibold text-slate-900">{formatWon(product.salePrice)}</div>
                      {product.regularPrice > product.salePrice && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatWon(product.regularPrice)}
                        </div>
                      )}
                    </td>

                    {/* 재고 */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-mono font-medium ${
                          product.stockQuantity === 0
                            ? 'text-slate-400'
                            : product.stockStatus === 'LOW'
                            ? 'text-rose-600 font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        {product.stockQuantity.toLocaleString()}개
                      </span>
                    </td>

                    {/* 상태 (재고 부족 빨간색 배지) */}
                    <td className="py-3.5 px-4 text-center">
                      {product.stockStatus === 'LOW' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          부족
                        </span>
                      )}
                      {product.stockStatus === 'OUT_OF_STOCK' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          품절
                        </span>
                      )}
                      {product.stockStatus === 'NORMAL' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          정상
                        </span>
                      )}
                    </td>

                    {/* 등록일 */}
                    <td className="py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
                      {product.createdAt}
                    </td>

                    {/* 수정/삭제 버튼 */}
                    <td className="py-3.5 pr-4 pl-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="수정"
                          aria-label={`${product.name} 수정`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="삭제"
                          aria-label={`${product.name} 삭제`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

