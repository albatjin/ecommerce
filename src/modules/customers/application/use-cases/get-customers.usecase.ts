import { CustomerRepository, CustomerQueryResult } from '../../domain/repositories/customer.repository';
import { CustomerQueryFilter } from '../../domain/entities/customer';

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(filter: CustomerQueryFilter = {}): Promise<CustomerQueryResult> {
    return this.customerRepository.getCustomers(filter);
  }
}

