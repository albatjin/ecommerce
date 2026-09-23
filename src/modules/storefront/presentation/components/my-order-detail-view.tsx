'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MyOrderDetailDto } from '../../application/dto/my-order.dto';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Package,
  Copy,
  Check,
  CreditCard,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface MyOrderDetailViewProps {
  order: MyOrderDetailDto;
}

const DELIVERY_STEPS = [
  { step: 1, label: '결제완료', desc: '주문 접수 및 승인' },
  { step: 2, label: '상품준비', desc: '상품 검수 및 패킹' },
  { step: 3, label: '배송중', desc: '택배사 집하 및 배송' },
  { step: 4, label: '배송완료', desc: '배송 완료' },
];

export function MyOrderDetailView({ order }: MyOrderDetailViewProps) {
  const [copied, setCopied] = useState(false);

  // 주문 상태에 따른 배송 스텝 인덱스 (1~4)
  const getDeliveryStepIndex = (status: string) => {
    switch (status) {
      case 'PAYMENT_PENDING':
        return 0;
      case 'PAID':
        return 1;
      case 'PREPARING':
        return 2;
      case 'SHIPPING':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getDeliveryStepIndex(order.status);

  const handleCopyTrackingNumber = () => {
    if (order.shipping.trackingNumber && navigator?.clipboard) {
      navigator.clipboard.writeText(order.shipping.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 1. 상단 이전 페이지 링크 */}
      <div className="mb-6">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          마이페이지 목록으로 돌아가기
        </Link>
      </div>

      {/* 2. 주문 기본 정보 헤더 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">주문번호</span>
              <span className="font-mono text-base font-bold text-gray-900">{order.orderNumber}</span>
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${order.statusBadgeClass}`}
              >
                {order.statusLabel}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>주문 일시: {order.orderDate}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block">총 결제 금액</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600">
              {order.payment.finalPaidAmount.toLocaleString('ko-KR')}원
            </span>
          </div>
        </div>

        {/* 3. 실시간 배송 진행 스텝퍼 (Delivery Tracking Stepper) */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              실시간 배송 진행 현황
            </h3>
            {order.shipping.trackingNumber && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-semibold">
                {order.shipping.trackingCompany || 'CJ대한통운'}
              </span>
            )}
          </div>

          <div className="py-6 px-2 sm:px-6">
            <div className="flex items-center justify-between relative">
              {DELIVERY_STEPS.map((s, idx) => {
                const isStepCompleted = s.step < currentStep;
                const isStepActive = s.step === currentStep;

                return (
                  <React.Fragment key={s.step}>
                    <div className="flex flex-col items-center text-center z-10">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                          isStepCompleted
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : isStepActive
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-600/30 scale-105'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {isStepCompleted ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <span>{s.step}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-bold ${
                          isStepActive
                            ? 'text-blue-600'
                            : isStepCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="hidden sm:block text-[10px] text-gray-400 mt-0.5 max-w-[80px]">
                        {s.desc}
                      </span>
                    </div>

                    {idx < DELIVERY_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 sm:mx-4 -mt-6 sm:-mt-8 rounded-full transition-colors duration-300 ${
                          s.step < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 운송장 번호 복사 및 배송 안내 박스 */}
          {order.shipping.trackingNumber ? (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">송장번호:</span>
                <span className="font-mono font-bold text-gray-900">
                  {order.shipping.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingNumber}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-white"
                  title="송장번호 복사"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="text-gray-500 text-[11px]">
                {order.estimatedShippingTime || '예상 출고: 오늘 18:00 이전'}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-500 text-center">
              주문이 접수되어 상품 준비 후 운송장 번호가 등록될 예정입니다.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 4. 좌측: 주문 상품 목록 (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">
              주문 상품 ({order.items.length}개)
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Img
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-xs text-gray-400 font-medium">
                    {item.categoryTag || '스토어 상품'} · {item.sku || 'SKU'}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.productName}
                  </h4>
                  <div className="text-xs text-gray-500">
                    {item.unitPrice.toLocaleString('ko-KR')}원 × {item.quantity}개
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-gray-900 block">
                    {item.subtotal.toLocaleString('ko-KR')}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 우측: 배송지 & 결제 정보 패널 (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 배송지 카드 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-gray-900">배송지 정보</h4>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-400 block mb-0.5">받는 사람</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {order.shipping.recipientName} ({order.shipping.phone})
                </span>
              </div>

              <div className="pt-2">
                <span className="text-gray-400 block mb-0.5">배송 주소</span>
                <span className="text-gray-800 leading-relaxed block">
                  {order.shipping.address}
                </span>
              </div>

              {order.shipping.memo && (
                <div className="pt-2">
                  <span className="text-gray-400 block mb-0.5">배송 요청사항</span>
                  <span className="text-gray-700 bg-gray-50 p-2.5 rounded-xl block">
                    {order.shipping.memo}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 결제 정보 영수증 카드 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-gray-900">결제 정보</h4>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>총 상품금액</span>
                <span className="text-gray-900 font-medium">
                  {order.payment.totalProductAmount.toLocaleString('ko-KR')}원
                </span>
              </div>

              <div className="flex justify-between">
                <span>배송비</span>
                <span className="text-blue-600 font-semibold">무료 배송</span>
              </div>

              <div className="flex justify-between">
                <span>결제 수단</span>
                <span className="text-gray-900 font-medium">{order.payment.paymentMethod}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between text-sm">
                <span className="font-bold text-gray-900">최종 결제금액</span>
                <span className="text-lg font-black text-blue-600">
                  {order.payment.finalPaidAmount.toLocaleString('ko-KR')}원
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>정상 결제 승인 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

