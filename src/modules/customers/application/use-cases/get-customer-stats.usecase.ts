import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerSummary } from '../../domain/entities/customer';

export class GetCustomerStatsUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<CustomerSummary> {
    return this.customerRepository.getCustomerStats();
  }
}

