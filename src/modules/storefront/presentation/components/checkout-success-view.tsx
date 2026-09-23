'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderStepper } from './order-stepper';
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const orderNumber = searchParams.get('orderNumber') || 'ORD-20260924-00001';
  const orderId = searchParams.get('orderId') || '';
  const paidAmount = Number(searchParams.get('paidAmount') || '0');
  const orderSummary = searchParams.get('orderSummary') || '주문 상품';
  const recipientName = searchParams.get('recipientName') || '홍길동';
  const shippingAddress = searchParams.get('shippingAddress') || '서울특별시 강남구 테헤란로 152';
  const paymentMethod = searchParams.get('paymentMethod') || '신용카드';

  const handleCopyOrderNumber = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <OrderStepper currentStep={3} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 1. 상단 성공 아이콘 및 메시지 */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          주문이 정상적으로 완료되었습니다!
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          고객님의 주문이 안전하게 접수되었습니다. 상품 준비 후 신속하게 배송해 드리겠습니다.
        </p>
      </div>

      {/* 2. 주문 정보 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden mb-8">
        {/* 주문 번호 헤더 바 */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-500 font-medium">주문번호</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-gray-900 tracking-wide font-mono">
                {orderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="text-gray-400 hover:text-blue-600 p-1 rounded-md transition-colors"
                title="주문번호 복사"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            결제완료
          </span>
        </div>

        {/* 상세 내역 테이블 */}
        <div className="p-6 space-y-4 text-sm divide-y divide-gray-100">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">주문 내역</span>
            <span className="font-semibold text-gray-900 text-right">{orderSummary}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-500">결제 금액</span>
            <span className="font-bold text-blue-600 text-base">
              {paidAmount.toLocaleString('ko-KR')}원
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-500">결제 수단</span>
            <span className="text-gray-800 font-medium">{paymentMethod}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-500">받는 사람</span>
            <span className="text-gray-800 font-medium">{recipientName}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-500 shrink-0">배송 주소</span>
            <span className="text-gray-800 font-medium text-right max-w-xs sm:max-w-md truncate">
              {shippingAddress}
            </span>
          </div>
        </div>

        {/* 배송 안내 팁 */}
        <div className="bg-blue-50/60 px-6 py-4 border-t border-blue-100 flex items-center gap-3 text-xs text-blue-900">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            오늘 18:00 이전 주문 건은 당일 출고 준비가 진행됩니다. 배송 시작 시 알림톡으로 송장번호를 안내해 드립니다.
          </span>
        </div>
      </div>

      {/* 3. 하단 액션 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4" />
          쇼핑 계속하기
        </Link>

        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-2xs"
        >
          <ExternalLink className="w-4 h-4 text-gray-500" />
          관리자 주문 내역에서 확인
        </Link>
      </div>
    </div>
  </div>
  );
}

