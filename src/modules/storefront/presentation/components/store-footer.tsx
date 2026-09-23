import React from 'react';
import Link from 'next/link';
import { Headphones, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export function StoreFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      {/* 혜택 안내 배너 */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <Truck className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-white text-sm font-semibold">전 상품 무료 배송</h4>
                <p className="text-xs text-slate-400">조건 없는 기본 무료 배송 혜택</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white text-sm font-semibold">100% 정품 보장</h4>
                <p className="text-xs text-slate-400">공식 파트너 인증 정품 보증</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <RotateCcw className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-white text-sm font-semibold">7일 이내 안심 반품</h4>
                <p className="text-xs text-slate-400">단순 변심도 편리한 반품 처리</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <Headphones className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-white text-sm font-semibold">고객 감동 센터</h4>
                <p className="text-xs text-slate-400">평일 09:00 ~ 18:00 (1588-0000)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회사 정보 및 링크 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                S
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                STORE<span className="text-blue-400">FRONT</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              최고의 제품과 엄선된 품질로 고객의 일상을 더욱 편리하고 풍요롭게 만듭니다.
            </p>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">쇼핑 카테고리</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=전자제품" className="hover:text-white transition-colors">
                  전자제품 & IT
                </Link>
              </li>
              <li>
                <Link href="/shop?category=의류" className="hover:text-white transition-colors">
                  패션의류 & 잡화
                </Link>
              </li>
              <li>
                <Link href="/shop?category=식품" className="hover:text-white transition-colors">
                  신선 & 프리미엄 식품
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  전체 상품 둘러보기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">고객 지원</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문(FAQ)
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  배송 및 환불 정책
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">운영자 메뉴</h5>
            <p className="text-xs mb-3 text-slate-400">
              관리자 계정으로 상품 및 주문을 통합 관리할 수 있습니다.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
            >
              관리자 대시보드 바로가기 →
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 STOREFRONT Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
