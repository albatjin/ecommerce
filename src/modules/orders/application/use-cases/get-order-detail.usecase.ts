import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderDetail } from '../../domain/entities/order';

export class GetOrderDetailUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(idOrNumber: string): Promise<OrderDetail | null> {
    if (!idOrNumber || idOrNumber.trim() === '') {
      return null;
    }
    return this.orderRepository.getOrderDetail(idOrNumber.trim());
  }
}

