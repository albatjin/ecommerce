import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import { TrackOrderUseCase } from '@/modules/storefront/application/use-cases/track-order.usecase';
import { MyOrderDetailView } from '@/modules/storefront/presentation/components/my-order-detail-view';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: '주문 상세 및 배송 추적 | CommerceHub',
  description: '실시간 배송 진행 현황 및 주문 상세 내역',
};

export default async function MyOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const repository = new SupabaseOrderRepository(supabase);
  const useCase = new TrackOrderUseCase(repository);

  const orderDetail = await useCase.execute({
    orderQuery: id,
  });

  if (!orderDetail) {
    notFound();
  }

  return <MyOrderDetailView order={orderDetail} />;
}

