'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

import { usePathname } from 'next/navigation';

interface SidebarProps {
  currentPath?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '상품관리', href: '/products', icon: Package },
  { name: '주문관리', href: '/orders', icon: ShoppingCart },
  { name: '고객관리', href: '/customers', icon: Users },
  { name: '분석', href: '/sales', icon: BarChart3 },
  { name: '설정', href: '/settings', icon: Settings },
];

export function Sidebar({ currentPath }: SidebarProps) {
  const pathname = usePathname();
  const effectivePath = currentPath || pathname || '/dashboard';
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 tracking-tight">CommerceHub</span>
            <span className="block text-[10px] font-medium text-slate-400 -mt-1">ADMIN CONSOLE</span>
          </div>
        </div>

        {/* Storefront Link */}
        <div className="px-4 pt-3 pb-1">
          <Link
            href="/"
            className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 text-xs font-semibold text-blue-700 transition-all group shadow-2xs"
            title="고객용 쇼핑몰 메인 홈으로 이동"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>쇼핑몰 바로가기</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-700 transition-colors" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            메뉴
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = effectivePath === item.href || effectivePath.startsWith(`${item.href}/`);

            const isProducts = item.href === '/products';
            const showProductSubmenu = isProducts && (effectivePath === '/products' || effectivePath.startsWith('/products/'));

            const isOrders = item.href === '/orders';
            const showOrderSubmenu = isOrders && (effectivePath === '/orders' || effectivePath.startsWith('/orders/'));
            const isOrderDetail = effectivePath.startsWith('/orders/') && effectivePath !== '/orders';

            const isCustomers = item.href === '/customers';
            const showCustomerSubmenu = isCustomers && (effectivePath === '/customers' || effectivePath.startsWith('/customers/'));
            const isCustomerDetail = effectivePath.startsWith('/customers/') && effectivePath !== '/customers';

            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  data-active={isActive ? 'true' : 'false'}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>

                {showProductSubmenu && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link
                      href="/products"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        effectivePath === '/products'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 상품 목록
                    </Link>
                    <Link
                      href="/products/create"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        effectivePath === '/products/create' || effectivePath === '/products/new'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 상품 등록
                    </Link>
                  </div>
                )}

                {showOrderSubmenu && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link
                      href="/orders"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        !isOrderDetail
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 주문 목록
                    </Link>
                    <Link
                      href="/orders/detail"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        isOrderDetail
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 주문 상세
                    </Link>
                  </div>
                )}

                {showCustomerSubmenu && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link
                      href="/customers"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        !isCustomerDetail
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 고객 목록
                    </Link>
                    <Link
                      href="/customers/detail"
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        isCustomerDetail
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      • 고객 상세
                    </Link>
                  </div>
                )}
              </div>
            );

          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="text-[11px] font-medium text-slate-600">
            시스템 정상 가동 중
          </div>
        </div>
      </div>
    </aside>
  );
}

