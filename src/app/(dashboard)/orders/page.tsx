import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import { GetOrdersUseCase } from '@/modules/orders/application/use-cases/get-orders.usecase';
import { OrderView } from '@/modules/orders/presentation/components/order-view';

export const metadata = {
  title: 'CommerceHub - 주문 관리',
  description: '쇼핑몰 주문 내역 조회, 배송 및 결제 상태 관리 대시보드',
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const repository = new SupabaseOrderRepository(supabase);
  const getOrdersUseCase = new GetOrdersUseCase(repository);

  const result = await getOrdersUseCase.execute({
    page: 1,
    pageSize: 8,
  });

  return (
    <OrderView
      initialOrders={result.orders}
      pendingProcessingCount={result.pendingProcessingCount}
    />
  );
}

