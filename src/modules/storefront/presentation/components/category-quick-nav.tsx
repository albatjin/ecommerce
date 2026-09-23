import React from 'react';
import Link from 'next/link';
import { Laptop, Shirt, Apple, Grid, Sparkles, Flame } from 'lucide-react';

export function CategoryQuickNav() {
  const items = [
    {
      name: '전체 상품',
      href: '/shop',
      icon: Grid,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: '전자제품',
      href: '/shop?category=전자제품',
      icon: Laptop,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      name: '패션의류',
      href: '/shop?category=의류',
      icon: Shirt,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      name: '식품관',
      href: '/shop?category=식품',
      icon: Apple,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      name: '베스트 특가',
      href: '/shop?sort=discount',
      icon: Flame,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      name: '신규 입고',
      href: '/shop?sort=latest',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">카테고리 탐색</h2>
        <Link href="/shop" className="text-xs text-blue-600 hover:underline">
          전체 카테고리 보기 &gt;
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${item.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
