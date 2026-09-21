'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, PackagePlus } from 'lucide-react';
import { ProductDto } from '../../application/dto/product.dto';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<ProductDto>) => void;
  product?: ProductDto | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('전자제품');
  const [regularPrice, setRegularPrice] = useState('0');
  const [salePrice, setSalePrice] = useState('0');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [safetyStock, setSafetyStock] = useState('10');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setRegularPrice(String(product.regularPrice));
      setSalePrice(String(product.salePrice));
      setStockQuantity(String(product.stockQuantity));
      setSafetyStock(String(product.safetyStock));
    } else {
      setName('');
      setCategory('전자제품');
      setRegularPrice('50000');
      setSalePrice('45000');
      setStockQuantity('20');
      setSafetyStock('10');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: product?.id,
      name,
      category,
      regularPrice: Number(regularPrice) || 0,
      salePrice: Number(salePrice) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      safetyStock: Number(safetyStock) || 10,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? '상품 정보 수정' : '신규 상품 등록'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">상품명 *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 16인치 울트라 슬림 노트북"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="전자제품">전자제품</option>
              <option value="의류">의류</option>
              <option value="식품">식품</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">정가 (원)</label>
              <input
                type="number"
                min="0"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">판매가 (원)</label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">재고 수량 (개)</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                안전 재고 기준 (개)
              </label>
              <input
                type="number"
                min="0"
                value={safetyStock}
                onChange={(e) => setSafetyStock(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? '수정 저장' : '등록 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

