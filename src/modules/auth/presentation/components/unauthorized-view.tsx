'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogIn, ShoppingBag, User } from 'lucide-react';

interface UnauthorizedViewProps {
  targetPath?: string;
}

export function UnauthorizedView({ targetPath }: UnauthorizedViewProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl text-center space-y-6">
        {/* 아이콘 */}
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-rose-100">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* 상태 코드 및 타이틀 */}
        <div>
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full uppercase tracking-wider mb-2">
            403 Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            접근 권한이 없습니다
          </h1>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            요청하신 관리자 페이지는 인가된 관리자 계정만 접근할 수 있습니다.
            {targetPath && (
              <span className="block mt-1 font-mono text-xs text-rose-500 font-semibold truncate bg-rose-50/60 py-1 px-2 rounded-md">
                접근 시도: {targetPath}
              </span>
            )}
          </p>
        </div>

        {/* 안내 카드 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left text-xs text-gray-600 space-y-1.5">
          <p className="font-bold text-gray-800">이런 이유로 발생할 수 있습니다:</p>
          <ul className="list-disc list-inside space-y-0.5 text-gray-500">
            <li>일반 고객 계정으로 관리자 페이지에 접속한 경우</li>
            <li>해당 페이지를 관리할 권한(Role)이 부여되지 않은 경우</li>
            <li>로그인 세션이 만료된 경우</li>
          </ul>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="space-y-3 pt-2">
          <Link
            href="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>관리자 계정으로 로그인</span>
          </Link>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              <span>쇼핑몰 홈</span>
            </Link>

            <Link
              href="/mypage"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>마이페이지</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

