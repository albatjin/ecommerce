import { describe, it, expect } from 'vitest';
import {
  Customer,
  isVipCustomer,
  formatCurrencyWon,
  formatPoints,
  calculateCustomerStats,
} from '../customer';

describe('Customer Domain Entity', () => {
  const sampleCustomerVIP: Customer = {
    id: 'user-1',
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
  };

  const sampleCustomerBronze: Customer = {
    id: 'user-2',
    customerNumber: 'CUST-08412',
    name: '김서연',
    email: 'seoyeon.kim@gmail.com',
    phone: '010-6712-4402',
    membershipGrade: 'BRONZE',
    status: 'ACTIVE',
    totalSpent: 89000,
    totalOrders: 1,
    rewardPoints: 3000,
    smsConsent: false,
    emailConsent: true,
    createdAt: '2025-02-13T12:00:00Z',
    lastVisitAt: '2025-02-13T12:00:00Z',
    isNew: true,
  };

  it('should correctly identify VIP or VVIP customers', () => {
    expect(isVipCustomer(sampleCustomerVIP)).toBe(true);
    expect(isVipCustomer(sampleCustomerBronze)).toBe(false);

    const vipCustomer: Customer = {
      ...sampleCustomerBronze,
      membershipGrade: 'VIP',
    };
    expect(isVipCustomer(vipCustomer)).toBe(true);
  });

  it('should format currency correctly with Korean Won sign', () => {
    expect(formatCurrencyWon(4280000)).toBe('₩4,280,000');
    expect(formatCurrencyWon(0)).toBe('₩0');
  });

  it('should format reward points with P suffix', () => {
    expect(formatPoints(128500)).toBe('128,500P');
    expect(formatPoints(450)).toBe('450P');
  });

  it('should calculate customer statistics accurately from customer list', () => {
    const customers: Customer[] = [
      sampleCustomerVIP,
      sampleCustomerBronze,
      {
        id: 'user-3',
        customerNumber: 'CUST-06102',
        name: '송태섭',
        email: 'taesup.song@naver.com',
        phone: '010-2211-9874',
        membershipGrade: 'GOLD',
        status: 'DORMANT_WARNING',
        totalSpent: 1120000,
        totalOrders: 11,
        rewardPoints: 450,
        smsConsent: false,
        emailConsent: false,
        createdAt: '2024-02-18T10:00:00Z',
        lastVisitAt: '2024-02-18T10:00:00Z',
      },
    ];

    const stats = calculateCustomerStats(customers);
    expect(stats.totalCount).toBe(3);
    expect(stats.newCount).toBe(1);
    expect(stats.vipCount).toBe(1);
    expect(stats.dormantWarningCount).toBe(1);
  });
});

