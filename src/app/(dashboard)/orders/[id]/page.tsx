import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import { GetOrderDetailUseCase } from '@/modules/orders/application/use-cases/get-order-detail.usecase';
import { OrderDetailView } from '@/modules/orders/presentation/components/order-detail-view';

export const metadata = {
  title: 'CommerceHub - 주문 상세 정보',
  description: '주문 상세 정보, 배송 진행 현황, 운송장 설정 및 고객 정보 조회',
};

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const repository = new SupabaseOrderRepository(supabase);
  const getOrderDetail = new GetOrderDetailUseCase(repository);

  const order = await getOrderDetail.execute(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}

