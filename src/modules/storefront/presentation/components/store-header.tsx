'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, LayoutDashboard, Menu, X, User, Truck, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { createClient } from '@/shared/lib/supabase/client';

interface StoreHeaderProps {
  cartItemCount?: number;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function StoreHeader({ cartItemCount }: StoreHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);

  // useCart 안전하게 참조 (Provider 밖 테스트에서도 안전)
  let contextCount = 0;
  try {
    const cart = useCart();
    contextCount = cart.totalItemCount;
  } catch {
    contextCount = 0;
  }

  const effectiveCartCount = cartItemCount !== undefined ? cartItemCount : contextCount;

  // Supabase 세션 감지
  useEffect(() => {
    try {
      const supabase = createClient();
      if (!supabase?.auth) return;

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || '고객',
            role: user.user_metadata?.role || 'customer',
          });
        } else {
          setCurrentUser(null);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '고객',
            role: session.user.user_metadata?.role || 'customer',
          });
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } catch {
      // test environment fallback
    }
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase?.auth) {
        await supabase.auth.signOut();
      }
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch {
      setCurrentUser(null);
    }
  };

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
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FRONT
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                STORE
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
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

          {/* 우측 액션 바 */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/track"
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
              title="배송조회"
              aria-label="배송조회"
            >
              <Truck className="w-5 h-5" />
              <span className="hidden lg:inline">배송조회</span>
            </Link>

            {/* 로그인 / 회원가입 또는 마이페이지 / 로그아웃 */}
            {currentUser ? (
              <>
                <Link
                  href="/mypage"
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
                  title="마이페이지"
                  aria-label="마이페이지"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">{currentUser.name}님</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-gray-50 rounded-full transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                  title="로그아웃"
                  aria-label="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
                  title="로그인"
                  aria-label="로그인"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">로그인</span>
                </Link>

                <Link
                  href="/signup"
                  className="ml-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  title="회원가입"
                  aria-label="회원가입"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">회원가입</span>
                </Link>
              </>
            )}

            {/* 장바구니 */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors ml-1"
              aria-label="장바구니"
            >
              <ShoppingCart className="w-5 h-5" />
              {effectiveCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {effectiveCartCount > 99 ? '99+' : effectiveCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-3">
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

          {/* 카테고리 링크 */}
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

          {/* 모바일 하단 액션 메뉴 */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-around text-xs font-medium text-gray-600">
            {currentUser ? (
              <>
                <Link
                  href="/mypage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1.5 px-3 hover:text-blue-600 rounded-md hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  <span>마이페이지</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 hover:text-rose-600 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1.5 px-3 hover:text-blue-600 rounded-md hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>로그인</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1.5 px-3 text-blue-600 font-bold rounded-md hover:bg-blue-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>회원가입</span>
                </Link>
              </>
            )}

            <Link
              href="/track"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 py-1.5 px-3 hover:text-blue-600 rounded-md hover:bg-gray-50"
            >
              <Truck className="w-4 h-4" />
              <span>배송조회</span>
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 py-1.5 px-3 hover:text-blue-600 rounded-md hover:bg-gray-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>장바구니 ({effectiveCartCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
