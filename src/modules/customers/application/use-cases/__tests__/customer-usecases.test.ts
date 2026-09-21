import { describe, it, expect, vi } from 'vitest';
import { CustomerRepository, CustomerQueryResult } from '../../../domain/repositories/customer.repository';
import { Customer, CustomerSummary } from '../../../domain/entities/customer';
import { GetCustomersUseCase } from '../get-customers.usecase';
import { GetCustomerStatsUseCase } from '../get-customer-stats.usecase';

describe('Customer Application Use Cases', () => {
  const mockCustomers: Customer[] = [
    {
      id: 'cust-1',
      customerNumber: 'CUST-08419',
      name: '박지헌',
      email: 'jihyeon.park@gmail.com',
      phone: '010-8842-1923',
      membershipGrade: 'VVIP',
      status: 'ACTIVE',
      totalSpent: 4280000,
      totalOrders: 24,
      rewardPoints: 128500,
      smsConsent: true,
      emailConsent: true,
      createdAt: '2024-01-10T09:00:00Z',
      lastVisitAt: '2025-02-14T10:00:00Z',
    },
    {
      id: 'cust-2',
      customerNumber: 'CUST-08398',
      name: '최민성',
      email: 'minseong.choi@naver.com',
      phone: '010-4491-0329',
      membershipGrade: 'VIP',
      status: 'ACTIVE',
      totalSpent: 1890000,
      totalOrders: 15,
      rewardPoints: 42000,
      smsConsent: true,
      emailConsent: true,
      createdAt: '2024-03-12T09:00:00Z',
      lastVisitAt: '2025-02-12T10:00:00Z',
    },
  ];

  const mockStats: CustomerSummary = {
    totalCount: 8420,
    newCount: 342,
    vipCount: 380,
    dormantWarningCount: 48,
    averageOrderValue: 480000,
  };

  const mockQueryResult: CustomerQueryResult = {
    customers: mockCustomers,
    totalCount: 2,
    page: 1,
    pageSize: 20,
    totalPages: 1,
  };

  const mockRepo: CustomerRepository = {
    getCustomers: vi.fn().mockResolvedValue(mockQueryResult),
    getCustomerStats: vi.fn().mockResolvedValue(mockStats),
    getCustomerDetail: vi.fn().mockResolvedValue(null),
  };


  describe('GetCustomersUseCase', () => {
    it('should invoke repository with filter and return query result', async () => {
      const useCase = new GetCustomersUseCase(mockRepo);
      const result = await useCase.execute({
        searchQuery: '박지헌',
        sortBy: 'totalSpent_desc',
      });

      expect(mockRepo.getCustomers).toHaveBeenCalledWith({
        searchQuery: '박지헌',
        sortBy: 'totalSpent_desc',
      });
      expect(result.customers).toHaveLength(2);
      expect(result.customers[0].name).toBe('박지헌');
    });
  });

  describe('GetCustomerStatsUseCase', () => {
    it('should retrieve customer summary stats from repository', async () => {
      const useCase = new GetCustomerStatsUseCase(mockRepo);
      const stats = await useCase.execute();

      expect(mockRepo.getCustomerStats).toHaveBeenCalled();
      expect(stats.totalCount).toBe(8420);
      expect(stats.vipCount).toBe(380);
      expect(stats.newCount).toBe(342);
    });
  });
});

