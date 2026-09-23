import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-xl mb-12">
      {/* 배경 장식 원형 블러 */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>2026 시즌 신규 프리미엄 라인업 런칭</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          일상에 특별함을 더하는 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
            스마트 & 라이프스타일 셀렉션
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          엄선된 디지털 IT 기기부터 트렌디한 패션, 신선한 식탁을 위한 프리미엄 식품까지.
          지금 첫 주문 시 최대 30% 특별 할인 혜택을 드립니다.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            전체 상품 둘러보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop?category=전자제품"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-6 py-3.5 rounded-xl backdrop-blur-sm border border-white/10 transition-colors"
          >
            인기 전자제품 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
