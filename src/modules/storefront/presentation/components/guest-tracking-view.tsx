'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { lookupOrderAction } from '../../application/actions/tracking.actions';
import { MyOrderDetailDto } from '../../application/dto/my-order.dto';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  AlertCircle,
  Loader2,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function GuestTrackingView() {
  const [orderQuery, setOrderQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<MyOrderDetailDto | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setTrackedOrder(null);

    if (!orderQuery.trim()) {
      setErrorMessage('주문번호를 입력해 주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await lookupOrderAction(orderQuery.trim(), phone.trim() || undefined);

      if (res.success && res.data) {
        setTrackedOrder(res.data);
      } else {
        setErrorMessage(res.error || '주문 정보를 찾을 수 없습니다.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          비회원 주문 / 배송 조회
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          주문 시 발급받으신 주문번호와 연락처를 입력하시면 실시간 배송 상태를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 검색 입력 폼 카드 */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs mb-8">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                주문번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="ORD-YYYYMMDD-XXXXX"
                  required
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                주문자 / 수령인 연락처
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>주문 정보 조회 중...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>주문 및 배송 현황 조회하기</span>
              </>
            )}
          </button>
        </form>

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 검색 결과 표시 카드 */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 font-medium">조회 결과</span>
              <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                주문번호 {trackedOrder.orderNumber}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${trackedOrder.statusBadgeClass}`}
            >
              {trackedOrder.statusLabel}
            </span>
          </div>

          {/* 배송 상태 및 수령인 요약 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <span className="text-gray-400 block mb-1">받는 사람</span>
              <span className="font-bold text-gray-900 text-sm">{trackedOrder.shipping.recipientName}</span>
              <span className="text-gray-500 block mt-0.5">{trackedOrder.shipping.phone}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl">
              <span className="text-gray-400 block mb-1">배송지 주소</span>
              <span className="font-medium text-gray-800 line-clamp-2 leading-relaxed">
                {trackedOrder.shipping.address}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl">
              <span className="text-gray-400 block mb-1">결제 금액 및 수단</span>
              <span className="font-black text-blue-600 text-sm">
                {trackedOrder.payment.finalPaidAmount.toLocaleString('ko-KR')}원
              </span>
              <span className="text-gray-500 block mt-0.5">{trackedOrder.payment.paymentMethod}</span>
            </div>
          </div>

          {/* 주문 상품 리스트 축약 */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-600 mb-3">주문 상품 내역</h3>
            <div className="space-y-2">
              {trackedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-none"
                >
                  <span className="font-medium text-gray-800 truncate max-w-sm">
                    {item.productName} ({item.quantity}개)
                  </span>
                  <span className="font-bold text-gray-900">
                    {item.subtotal.toLocaleString('ko-KR')}원
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 상세보기 이동 버튼 */}
          <div className="pt-4 flex justify-end">
            <Link
              href={`/mypage/orders/${trackedOrder.id}`}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <span>실시간 배송 추적 상세 보기</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

