import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import { GetMyOrdersUseCase } from '@/modules/storefront/application/use-cases/get-my-orders.usecase';
import { MyPageView } from '@/modules/storefront/presentation/components/mypage-view';

export const metadata = {
  title: '마이페이지 | CommerceHub',
  description: '내 주문 내역 확인 및 실시간 배송 추적',
};

export default async function MyPage() {
  const supabase = await createClient();
  const repository = new SupabaseOrderRepository(supabase);
  const useCase = new GetMyOrdersUseCase(repository);

  const result = await useCase.execute();

  return (
    <MyPageView
      initialOrders={result.orders}
      totalCount={result.totalCount}
    />
  );
}

