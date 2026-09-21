import { OrderRepository, OrderQueryFilter } from '../../domain/repositories/order.repository';
import { OrderListResultDto, OrderDto } from '../dto/order.dto';
import { Order } from '../../domain/entities/order';

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(filter: OrderQueryFilter = {}): Promise<OrderListResultDto> {
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 8;

    const result = await this.orderRepository.getOrders({
      ...filter,
      page,
      pageSize,
    });

    return {
      orders: result.orders.map(this.toDto),
      totalCount: result.totalCount,
      pendingProcessingCount: result.pendingProcessingCount,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  private toDto(order: Order): OrderDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      orderSummary: order.orderSummary,
      paidAmount: order.paidAmount,
      status: order.status,
      statusLabel: order.statusLabel,
      statusBadgeClass: order.statusBadgeClass,
      orderDate: order.orderDate,
      recipientPhone: order.recipientPhone,
      shippingAddress: order.shippingAddress,
    };
  }
}

