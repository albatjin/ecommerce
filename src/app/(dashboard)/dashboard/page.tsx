import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut, TrendingUp, ShoppingBag, Users, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'CommerceHub - 대시보드',
  description: '온라인 쇼핑몰 관리자 대시보드',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated (fallback defense in addition to middleware)
  if (!user) {
    redirect('/login');
  }

  // Handle logout via Server Action
  async function handleLogout() {
    'use server';
    const serverSupabase = await createClient();
    await serverSupabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M7 10l5-5 5 5H7zm10 4l-5 5-5-5h10z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">CommerceHub Console</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900">{user.email}</p>
            <p className="text-[11px] text-gray-500">최고 관리자</p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-xs text-gray-500 mt-1">오늘의 주요 쇼핑몰 운영 현황 및 핵심 지표입니다.</p>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. 오늘 매출 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">오늘 매출</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">₩14,280,000</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <span>↑ 18.4%</span>
                <span className="text-gray-400 font-normal">전일 대비</span>
              </div>
            </div>
          </div>

          {/* 2. 신규 주문 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">신규 주문</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">482건</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <span>↑ 12건</span>
                <span className="text-gray-400 font-normal">전일 대비</span>
              </div>
            </div>
          </div>

          {/* 3. 신규 고객 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">신규 고객</span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">342명</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <span>↑ 4.1%</span>
                <span className="text-gray-400 font-normal">전월 대비 증가</span>
              </div>
            </div>
          </div>

          {/* 4. 재고 부족 상품 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">재고 부족 상품</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-rose-600">98건</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-500 font-medium">
                <span>주의 요망</span>
                <span className="text-gray-400 font-normal">안전재고 미달</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

