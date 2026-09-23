'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cart-context';
import { OrderStepper } from './order-stepper';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';

export function CartView() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    removeSelected,
    clearCart,
    totalItemCount,
    selectedItemCount,
    totalRegularPrice,
    totalSalePrice,
    totalDiscount,
    shippingFee,
    finalPaymentAmount,
    isAllSelected,
  } = useCart();

  // 빈 장바구니일 때 (Empty State)
  if (items.length === 0) {
    return (
      <div className="w-full">
        <OrderStepper currentStep={1} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            장바구니가 비어 있습니다
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            원하는 상품을 장바구니에 담아두고 한 번에 편리하게 주문해 보세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              인기 상품 둘러보기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-2xs"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <OrderStepper currentStep={1} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* 타이틀 */}
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              장바구니
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              담긴 상품을 확인하고 주문서를 작성하세요. (전체 {totalItemCount}개 품목)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* 좌측: 장바구니 상품 목록 (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 전체 선택 및 일괄 삭제 컨트롤 바 */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-2xs text-xs sm:text-sm text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>
                전체 선택 ({selectedItemCount}/{items.length})
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={removeSelected}
                disabled={selectedItemCount === 0}
                className="text-gray-500 hover:text-red-600 disabled:opacity-40 disabled:hover:text-gray-500 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                선택 삭제
              </button>
              <span className="text-gray-200">|</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-gray-400 hover:text-red-600 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                전체 비우기
              </button>
            </div>
          </div>

          {/* 개별 상품 카드 리스트 */}
          <div className="space-y-3">
            {items.map((item) => {
              const itemSubtotal = item.price * item.quantity;
              const maxLimit = Math.min(item.stockQuantity, item.maxOrderQuantity);

              return (
                <div
                  key={item.productId}
                  data-testid="cart-item-row"
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.productId)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 shrink-0 mt-1 sm:mt-0"
                    aria-label={`${item.name} 선택`}
                  />

                  {/* 상품 이미지 */}
                  <Link
                    href={`/shop/${item.productId}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 block relative"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[11px] font-medium text-gray-400">
                      {item.category || '기타'} · {item.productCode}
                    </span>
                    <Link
                      href={`/shop/${item.productId}`}
                      className="block text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-2 pt-1">
                      {item.discountRate > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {item.regularPrice.toLocaleString('ko-KR')}원
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-900">
                        {item.price.toLocaleString('ko-KR')}원
                      </span>
                    </div>
                  </div>

                  {/* 수량 조절기 */}
                  <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white"
                        aria-label="수량 감소"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= maxLimit}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white"
                        aria-label="수량 증가"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 소계 금액 */}
                    <div className="text-right sm:w-28">
                      <span className="text-base font-extrabold text-gray-900 block">
                        {itemSubtotal.toLocaleString('ko-KR')}원
                      </span>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`${item.name} 삭제`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측: 주문 요약 패널 (4 cols, Sticky) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">주문 예상 금액</h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>총 상품금액</span>
                <span>{totalRegularPrice.toLocaleString('ko-KR')}원</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>총 상품 할인</span>
                  <span>-{totalDiscount.toLocaleString('ko-KR')}원</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span className="font-semibold text-blue-600">무료 배송</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-gray-900">최종 결제 예정 금액</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">
                    {finalPaymentAmount.toLocaleString('ko-KR')}
                  </span>
                  <span className="text-sm font-bold text-gray-900 ml-1">원</span>
                </div>
              </div>
            </div>

            {/* 주문하기 CTA 버튼 */}
            <button
              type="button"
              onClick={() => {
                if (selectedItemCount === 0) {
                  toggleSelectAll(true);
                }
                router.push('/checkout');
              }}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{selectedItemCount > 0 ? `${selectedItemCount}개 상품 주문하기` : '전체 상품 주문하기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>전 상품 무료배송 혜택 적용 중</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>안전 결제 시스템 및 100% 정품 보장</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

