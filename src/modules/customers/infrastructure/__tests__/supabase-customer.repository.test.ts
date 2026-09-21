import { describe, it, expect } from 'vitest';
import { SupabaseCustomerRepository } from '../supabase-customer.repository';

describe('SupabaseCustomerRepository', () => {
  it('should return initial paginated customers and correct total count', async () => {
    const repository = new SupabaseCustomerRepository();
    const result = await repository.getCustomers({ page: 1, pageSize: 5 });

    expect(result.customers).toHaveLength(5);
    expect(result.totalCount).toBeGreaterThanOrEqual(8);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBeGreaterThanOrEqual(2);
  });

  it('should filter customers by name or email search query', async () => {
    const repository = new SupabaseCustomerRepository();
    
    // Search by name
    const byName = await repository.getCustomers({ searchQuery: '박지헌' });
    expect(byName.customers.some((c) => c.name.includes('박지헌'))).toBe(true);
    expect(byName.customers.every((c) => c.name.includes('박지헌') || c.email.includes('박지헌'))).toBe(true);

    // Search by email
    const byEmail = await repository.getCustomers({ searchQuery: 'naver.com' });
    expect(byEmail.customers.every((c) => c.name.includes('naver.com') || c.email.includes('naver.com'))).toBe(true);
  });

  it('should filter customers by membership grade', async () => {
    const repository = new SupabaseCustomerRepository();
    const result = await repository.getCustomers({ gradeFilter: 'VIP' });

    expect(result.customers.length).toBeGreaterThan(0);
    expect(result.customers.every((c) => c.membershipGrade === 'VIP')).toBe(true);
  });

  it('should sort customers by total spent descending', async () => {
    const repository = new SupabaseCustomerRepository();
    const result = await repository.getCustomers({ sortBy: 'totalSpent_desc', pageSize: 10 });

    for (let i = 0; i < result.customers.length - 1; i++) {
      expect(result.customers[i].totalSpent).toBeGreaterThanOrEqual(result.customers[i + 1].totalSpent);
    }
  });

  it('should sort customers by total spent ascending', async () => {
    const repository = new SupabaseCustomerRepository();
    const result = await repository.getCustomers({ sortBy: 'totalSpent_asc', pageSize: 10 });

    for (let i = 0; i < result.customers.length - 1; i++) {
      expect(result.customers[i].totalSpent).toBeLessThanOrEqual(result.customers[i + 1].totalSpent);
    }
  });

  it('should return accurate customer statistics matching CRM metrics', async () => {
    const repository = new SupabaseCustomerRepository();
    const stats = await repository.getCustomerStats();

    expect(stats.totalCount).toBe(8420);
    expect(stats.newCount).toBe(342);
    expect(stats.dormantWarningCount).toBe(48);
    expect(stats.vipCount).toBe(380);
    expect(stats.averageOrderValue).toBe(480000);
  });
});

