import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderStatus } from '../../domain/entities/order';

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string, status: OrderStatus): Promise<boolean> {
    if (!orderId) {
      throw new Error('주문 ID가 필요합니다.');
    }
    return this.orderRepository.updateOrderStatus(orderId, status);
  }
}

