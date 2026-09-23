'use client';

import React from 'react';
import Link from 'next/link';
import { StoreProductDto } from '../../application/dto/store-product.dto';
import { useOptionalCart } from '../context/cart-context';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface StoreProductCardProps {
  product: StoreProductDto;
  onAddToCart?: (product: StoreProductDto) => void;
}

export function StoreProductCard({ product, onAddToCart }: StoreProductCardProps) {
  const isSoldOut = product.isSoldOut;
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  // useCart 안전하게 참조 (Rules of Hooks 준수)
  const cartContext = useOptionalCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    if (onAddToCart) {
      onAddToCart(product);
    } else if (cartContext) {
      cartContext.addItem(product, 1);
    }

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const formattedSalePrice = product.salePrice.toLocaleString('ko-KR');
  const formattedRegularPrice = product.regularPrice.toLocaleString('ko-KR');

  return (
    <div
      data-testid="store-product-card"
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {/* 상품 이미지 */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              isSoldOut ? 'grayscale opacity-60' : ''
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-xs">이미지 준비중</span>
          </div>
        )}

        {/* 뱃지 영역 */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountRate > 0 && (
            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {product.discountRate}% OFF
            </span>
          )}
          {product.isLowStock && !isSoldOut && (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md shadow-xs">
              마감임박
            </span>
          )}
        </div>

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}

        {/* 퀵 뷰 / 액션 버튼 호버 (데스크톱) */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-3 px-3 hidden group-hover:flex items-center justify-center gap-2 transition-opacity duration-200">
            {(onAddToCart || cartContext) && (
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`flex-1 backdrop-blur-sm text-xs font-semibold py-2 px-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5 ${
                  addedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/95 text-gray-800 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    담김 완료!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    장바구니 담기
                  </>
                )}
              </button>
            )}
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:text-blue-600">
              <Eye className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </Link>

      {/* 정보 영역 */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{product.category || '기타'}</span>
            {product.brandName && <span className="text-gray-400">{product.brandName}</span>}
          </div>

          <Link href={`/shop/${product.id}`} className="block">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            {product.discountRate > 0 && (
              <p className="text-xs text-gray-400 line-through">
                {formattedRegularPrice}원
              </p>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900">
                {formattedSalePrice}
              </span>
              <span className="text-xs font-medium text-gray-700">원</span>
            </div>
          </div>

          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            무료배송
          </span>
        </div>
      </div>
    </div>
  );
}
