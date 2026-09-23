import React, { Suspense } from 'react';
import { CheckoutSuccessView } from '@/modules/storefront/presentation/components/checkout-success-view';

export const metadata = {
  title: '주문 완료 | CommerceHub',
  description: '주문이 성공적으로 접수되었습니다.',
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-gray-500">
          주문 내역을 불러오는 중입니다...
        </div>
      }
    >
      <CheckoutSuccessView />
    </Suspense>
  );
}

