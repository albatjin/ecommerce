import { describe, it, expect, vi } from 'vitest';
import { GetCustomerDetailUseCase } from '../get-customer-detail.usecase';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerDetail } from '../../../domain/entities/customer';

describe('GetCustomerDetailUseCase', () => {
  const mockCustomerDetail: CustomerDetail = {
    id: 'cust-kim',
    customerNumber: 'CUST-849201',
    name: '김민서',
    email: 'minseo.kim@gmail.com',
    phone: '010-8294-7102',
    membershipGrade: 'VIP',
    status: 'ACTIVE',
    totalSpent: 4500000,
    totalOrders: 15,
    rewardPoints: 14500,
    smsConsent: true,
    emailConsent: true,
    appPushConsent: true,
    createdAt: '2023-08-14T09:00:00Z',
    lastVisitAt: '2025-02-26T14:22:09Z',
    gender: 'FEMALE',
    birthYear: 1994,
    personalCustomsCode: 'P123456789012',
    defaultAddress: '서울특별시 마포구 월드컵북로 120, 에코빌리지 702호',
    defaultZipcode: '03992',
    preferredCategories: [
      { category: '전자기기', percentage: 80 },
      { category: '의류', percentage: 15 },
      { category: '기타', percentage: 5 },
    ],
    orderHistory: [],
  };

  it('존재하는 고객 ID로 조회 시 CustomerDetail 객체를 반환한다', () => {
    const mockRepo: CustomerRepository = {
      getCustomers: vi.fn(),
      getCustomerStats: vi.fn(),
      getCustomerDetail: vi.fn().mockResolvedValue(mockCustomerDetail),
    };

    const useCase = new GetCustomerDetailUseCase(mockRepo);
    return useCase.execute('cust-kim').then((result) => {
      expect(mockRepo.getCustomerDetail).toHaveBeenCalledWith('cust-kim');
      expect(result).toEqual(mockCustomerDetail);
      expect(result?.name).toBe('김민서');
      expect(result?.totalSpent).toBe(4500000);
    });
  });

  it('고객이 존재하지 않을 경우 null을 반환한다', async () => {
    const mockRepo: CustomerRepository = {
      getCustomers: vi.fn(),
      getCustomerStats: vi.fn(),
      getCustomerDetail: vi.fn().mockResolvedValue(null),
    };

    const useCase = new GetCustomerDetailUseCase(mockRepo);
    const result = await useCase.execute('non-existent-id');
    expect(result).toBeNull();
  });
});

