import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseCustomerRepository } from '@/modules/customers/infrastructure/supabase-customer.repository';
import { GetCustomerDetailUseCase } from '@/modules/customers/application/use-cases/get-customer-detail.usecase';
import { CustomerDetailView } from '@/modules/customers/presentation/components/customer-detail-view';

export const metadata = {
  title: 'CommerceHub - 고객 상세 정보',
  description: '고객 프로필, LTV 분석, 주문 히스토리 및 선호 카테고리 상세 조회',
};

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const repository = new SupabaseCustomerRepository(supabase);
  const getCustomerDetail = new GetCustomerDetailUseCase(repository);

  const customer = await getCustomerDetail.execute(id);

  if (!customer) {
    notFound();
  }

  return <CustomerDetailView customer={customer} />;
}

