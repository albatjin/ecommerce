import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerDetail } from '../../domain/entities/customer';

export class GetCustomerDetailUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string): Promise<CustomerDetail | null> {
    if (!customerId || !customerId.trim()) {
      return null;
    }
    return this.customerRepository.getCustomerDetail(customerId.trim());
  }
}

