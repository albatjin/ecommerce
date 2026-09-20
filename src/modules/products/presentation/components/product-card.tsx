'use client';

import React from 'react';
import { Product } from '../../domain/entities/product';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div
      data-testid="product-card"
      className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <span className="text-xs text-gray-500 font-mono">{product.productCode}</span>
        {product.isSoldOut && (
          <span data-testid="badge-sold-out" className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">
            품절
          </span>
        )}
        {!product.isSoldOut && product.isLowStock && (
          <span data-testid="badge-low-stock" className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">
            재고 임박
          </span>
        )}
      </div>

      <h3 className="font-medium text-gray-900">{product.name}</h3>

      <div className="flex items-baseline gap-2 mt-auto">
        <span className="text-lg font-bold text-gray-900">
          {product.salePrice.toLocaleString()}원
        </span>
        {product.discountRate > 0 && (
          <>
            <span className="text-xs text-gray-400 line-through">
              {product.regularPrice.toLocaleString()}원
            </span>
            <span className="text-xs font-semibold text-rose-600">
              {product.discountRate}% OFF
            </span>
          </>
        )}
      </div>

      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="mt-2 w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          상세보기
        </button>
      )}
    </div>
  );
}

