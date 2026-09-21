import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseCustomerRepository } from '@/modules/customers/infrastructure/supabase-customer.repository';
import { GetCustomersUseCase } from '@/modules/customers/application/use-cases/get-customers.usecase';
import { GetCustomerStatsUseCase } from '@/modules/customers/application/use-cases/get-customer-stats.usecase';
import { CustomerView } from '@/modules/customers/presentation/components/customer-view';

export const metadata = {
  title: 'CommerceHub - 고객 관리',
  description: '쇼핑몰 회원 및 VIP 고객 관리 대시보드',
};

export default async function CustomersPage() {
  const supabase = await createClient();
  const repository = new SupabaseCustomerRepository(supabase);

  const getCustomers = new GetCustomersUseCase(repository);
  const getCustomerStats = new GetCustomerStatsUseCase(repository);

  const [customerResult, stats] = await Promise.all([
    getCustomers.execute({ page: 1, pageSize: 20, sortBy: 'createdAt_desc' }),
    getCustomerStats.execute(),
  ]);

  return (
    <CustomerView
      initialCustomers={customerResult.customers}
      stats={stats}
    />
  );
}

