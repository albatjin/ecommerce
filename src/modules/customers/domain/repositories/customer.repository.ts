import { Customer, CustomerDetail, CustomerSummary, CustomerQueryFilter } from '../entities/customer';

export interface CustomerQueryResult {
  customers: Customer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CustomerRepository {
  getCustomers(filter: CustomerQueryFilter): Promise<CustomerQueryResult>;
  getCustomerStats(): Promise<CustomerSummary>;
  getCustomerDetail(id: string): Promise<CustomerDetail | null>;
}


