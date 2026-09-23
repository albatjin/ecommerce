'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, HelpCircle, ChevronDown, LogOut, Store, ExternalLink } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  adminName?: string;
  logoutAction?: () => Promise<void>;
}

export function Header({
  userEmail = 'admin@commercehub.co.kr',
  adminName = '김운영',
  logoutAction,
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="상품명, 주문번호, 고객명 검색..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Customer Storefront Link */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 rounded-xl text-xs font-semibold text-blue-700 transition-colors shadow-2xs group"
          title="고객용 쇼핑몰 메인으로 이동"
        >
          <Store className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">쇼핑몰 바로가기</span>
          <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-blue-600 transition-colors" />
        </Link>

        {/* Store Selector */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>공식 온라인 스토어</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Help Icon */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          title="도움말"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          title="알림"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
            {adminName.slice(0, 1)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">{adminName}</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-none">{userEmail}</p>
          </div>

          {logoutAction && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

