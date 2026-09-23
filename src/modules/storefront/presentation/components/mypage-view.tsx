'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MyOrderSummaryDto } from '../../application/dto/my-order.dto';
import {
  User,
  Package,
  ChevronRight,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';

interface MyPageViewProps {
  initialOrders: MyOrderSummaryDto[];
  totalCount: number;
}

export function MyPageView({ initialOrders, totalCount }: MyPageViewProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'benefits' | 'address'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 1. 상단 고객 대시보드 프로필 헤더 카드 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-white backdrop-blur-md">
              <User className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">홍길동 고객님</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  VIP 회원
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                스토어를 찾아주셔서 감사합니다. 주문 및 배송 상태를 한눈에 확인하세요.
              </p>
            </div>
          </div>

          {/* 3대 핵심 혜택 지표 */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <div>
              <span className="block text-[11px] text-slate-400 font-medium">총 주문</span>
              <span className="text-base sm:text-xl font-black text-white">{totalCount}건</span>
            </div>
            <div className="border-x border-white/10 px-2 sm:px-4">
              <span className="block text-[11px] text-slate-400 font-medium">보유 적립금</span>
              <span className="text-base sm:text-xl font-black text-amber-400">3,450P</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-medium">보유 쿠폰</span>
              <span className="text-base sm:text-xl font-black text-blue-400">2장</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 탭 내비게이션 바 */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>주문 / 배송 조회 ({initialOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('benefits')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'benefits'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>쿠폰 및 포인트 혜택</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('address')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'address'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>배송지 관리</span>
        </button>
      </div>

      {/* 3. 탭별 콘텐츠 */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {initialOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">아직 주문 내역이 없습니다</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                마음에 드는 상품을 찾아 장바구니에 담고 첫 주문을 시작해 보세요!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105"
              >
                상품 둘러보기
              </Link>
            </div>
          ) : (
            initialOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
              >
                {/* 카드 상단: 주문 일자 및 주문번호 */}
                <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {order.orderDate}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="font-mono text-gray-500">주문번호 {order.orderNumber}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${order.statusBadgeClass}`}
                  >
                    {order.statusLabel}
                  </span>
                </div>

                {/* 카드 본문 */}
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      <Link href={`/mypage/orders/${order.id}`}>{order.orderSummary}</Link>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>수령인: {order.recipientName}</span>
                      <span className="text-gray-300">·</span>
                      <span className="truncate max-w-xs">{order.shippingAddress}</span>
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 pt-1">
                      총 결제 금액: <span className="text-blue-600">{order.paidAmount.toLocaleString('ko-KR')}원</span>
                    </div>
                  </div>

                  {/* 액션 버튼 그룹 */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <Link
                      href={`/mypage/orders/${order.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>배송 조회</span>
                    </Link>

                    <Link
                      href={`/mypage/orders/${order.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <span>상세 내역</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. 혜택 탭 콘텐츠 */}
      {activeTab === 'benefits' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">VIP 회원 특별 혜택</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            현재 회원님은 VIP 등급으로 전 상품 3% 상시 추가 적립 및 무료 배송 혜택을 받고 계십니다.
          </p>
        </div>
      )}

      {/* 5. 배송지 탭 콘텐츠 */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">기본 배송지</span>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
              기본
            </span>
          </div>
          <div className="text-xs text-gray-700 space-y-1">
            <div className="font-bold text-sm">홍길동 (010-1234-5678)</div>
            <div>[06236] 서울특별시 강남구 테헤란로 152 14층 강남파이낸스센터</div>
          </div>
        </div>
      )}
    </div>
  );
}

