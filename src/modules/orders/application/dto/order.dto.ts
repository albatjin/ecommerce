import {
  OrderStatus,
  OrderStatusLabel,
  OrderItem,
  OrderPaymentInfo,
  OrderShippingInfo,
  OrderCustomerInfo,
  OrderCsMemo,
  OrderNavigation,
} from '../../domain/entities/order';

export interface OrderDto {
  id: string;
  orderNumber: string;
  customerName: string;
  orderSummary: string;
  paidAmount: number;
  status: OrderStatus;
  statusLabel: OrderStatusLabel;
  statusBadgeClass: string;
  orderDate: string;
  recipientPhone?: string;
  shippingAddress?: string;
}

export interface OrderListResultDto {
  orders: OrderDto[];
  totalCount: number;
  pendingProcessingCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderDetailDto {
  id: string;
  orderNumber: string;
  displayTitle: string;
  status: OrderStatus;
  statusLabel: OrderStatusLabel;
  statusBadgeClass: string;
  currentStepIndex: number;
  orderDate: string;
  paidDate?: string;
  estimatedShippingTime?: string;
  items: OrderItem[];
  payment: OrderPaymentInfo;
  shipping: OrderShippingInfo;
  customer: OrderCustomerInfo;
  csNotes: OrderCsMemo[];
  navigation?: OrderNavigation;
}
