'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, LayoutDashboard, Menu, X } from 'lucide-react';

interface StoreHeaderProps {
  cartItemCount?: number;
}

export function StoreHeader({ cartItemCount = 0 }: StoreHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: '전체', href: '/shop' },
    { name: '전자제품', href: '/shop?category=전자제품' },
    { name: '의류', href: '/shop?category=의류' },
    { name: '식품', href: '/shop?category=식품' },
    { name: '기타', href: '/shop?category=기타' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* 상단 서브 배너 */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center">
        <span>🎉 첫 구매 시 전 상품 무료 배송 혜택 + 즉시 할인 적용</span>
        <Link
          href="/dashboard"
          className="ml-4 inline-flex items-center text-blue-400 hover:text-blue-300 font-medium underline"
        >
          <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
          관리자 대시보드 바로가기
        </Link>
      </div>

      {/* 메인 헤더 바 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                STORE<span className="text-blue-600">FRONT</span>
              </span>
            </Link>
          </div>

          {/* 데스크톱 카테고리 내비게이션 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어떤 상품을 찾으시나요?"
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* 우측 아이콘 액션 */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="장바구니"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품 검색..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
