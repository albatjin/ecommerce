import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { MyOrderSummaryDto, toMyOrderSummaryDto } from '../dto/my-order.dto';

export interface GetMyOrdersResult {
  orders: MyOrderSummaryDto[];
  totalCount: number;
}

export class GetMyOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<GetMyOrdersResult> {
    const result = await this.orderRepository.getOrders({
      page: 1,
      pageSize: 20,
    });

    return {
      orders: result.orders.map(toMyOrderSummaryDto),
      totalCount: result.totalCount,
    };
  }
}

