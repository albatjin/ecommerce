import React from 'react';
import { StoreHeader } from '@/modules/storefront/presentation/components/store-header';
import { StoreFooter } from '@/modules/storefront/presentation/components/store-footer';
import { CartProvider } from '@/modules/storefront/presentation/context/cart-context';

export const metadata = {
  title: 'STOREFRONT | 프리미엄 온라인 쇼핑몰',
  description: '최고의 품질과 트렌디한 상품을 만나보세요.',
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-900">
        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </div>
    </CartProvider>
  );
}
