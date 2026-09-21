import { Order, OrderDetail, OrderStatus, OrderCsMemo } from '../entities/order';

export interface OrderQueryFilter {
  statusTab?: string; // '전체' | '결제대기' | '결제완료' | '상품준비' | '배송중' | '배송완료'
  searchQuery?: string; // 주문번호 또는 고객명
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  page?: number;
  pageSize?: number;
}

export interface OrderQueryResult {
  orders: Order[];
  totalCount: number;
  pendingProcessingCount: number; // 오늘 처리해야 할 주문 수 (기본 15건 등)
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderRepository {
  getOrders(filter: OrderQueryFilter): Promise<OrderQueryResult>;
  getOrderById(id: string): Promise<Order | null>;
  getOrderDetail(id: string): Promise<OrderDetail | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<boolean>;
  updateTrackingInfo(id: string, trackingCompany: string, trackingNumber: string): Promise<boolean>;
  addCsNote(orderId: string, author: string, content: string): Promise<OrderCsMemo>;
}
