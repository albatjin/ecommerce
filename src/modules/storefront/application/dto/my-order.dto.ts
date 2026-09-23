import { Order, OrderDetail, OrderStatus, OrderItem, OrderPaymentInfo, OrderShippingInfo, OrderCustomerInfo } from '@/modules/orders/domain/entities/order';

export interface MyOrderSummaryDto {
  id: string;
  orderNumber: string;
  orderSummary: string;
  paidAmount: number;
  status: OrderStatus;
  statusLabel: string;
  statusBadgeClass: string;
  orderDate: string;
  recipientName: string;
  shippingAddress: string;
  recipientPhone?: string;
}

export function toMyOrderSummaryDto(order: Order): MyOrderSummaryDto {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    orderSummary: order.orderSummary,
    paidAmount: order.paidAmount,
    status: order.status,
    statusLabel: order.statusLabel,
    statusBadgeClass: order.statusBadgeClass,
    orderDate: order.orderDate,
    recipientName: order.customerName,
    shippingAddress: order.shippingAddress || '',
    recipientPhone: order.recipientPhone,
  };
}

export interface MyOrderDetailDto {
  id: string;
  orderNumber: string;
  displayTitle: string;
  status: OrderStatus;
  statusLabel: string;
  statusBadgeClass: string;
  currentStepIndex: number;
  orderDate: string;
  paidDate?: string;
  estimatedShippingTime?: string;
  items: OrderItem[];
  payment: OrderPaymentInfo;
  shipping: OrderShippingInfo;
  customer: OrderCustomerInfo;
}

export function toMyOrderDetailDto(detail: OrderDetail): MyOrderDetailDto {
  return {
    id: detail.id,
    orderNumber: detail.orderNumber,
    displayTitle: detail.displayTitle,
    status: detail.status,
    statusLabel: detail.statusLabel,
    statusBadgeClass: detail.statusBadgeClass,
    currentStepIndex: detail.currentStepIndex,
    orderDate: detail.orderDate,
    paidDate: detail.paidDate,
    estimatedShippingTime: detail.estimatedShippingTime,
    items: detail.items,
    payment: detail.payment,
    shipping: detail.shipping,
    customer: detail.customer,
  };
}

