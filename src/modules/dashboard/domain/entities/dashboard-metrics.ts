export interface DashboardMetricsProps {
  todaySales: number;
  salesDiffRate: number;
  todayOrders: number;
  ordersDiff: number;
  todayCustomers: number;
  customersDiff: number;
  lowStockProducts: number;
}

export function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

export class DashboardMetrics {
  readonly todaySales: number;
  readonly salesDiffRate: number;
  readonly todayOrders: number;
  readonly ordersDiff: number;
  readonly todayCustomers: number;
  readonly customersDiff: number;
  readonly lowStockProducts: number;

  constructor(props: DashboardMetricsProps) {
    this.todaySales = props.todaySales;
    this.salesDiffRate = props.salesDiffRate;
    this.todayOrders = props.todayOrders;
    this.ordersDiff = props.ordersDiff;
    this.todayCustomers = props.todayCustomers;
    this.customersDiff = props.customersDiff;
    this.lowStockProducts = props.lowStockProducts;
  }

  get formattedTodaySales(): string {
    return formatCurrency(this.todaySales);
  }

  get formattedSalesDiff(): string {
    const sign = this.salesDiffRate > 0 ? '+' : '';
    return `${sign}${this.salesDiffRate}%`;
  }

  get formattedOrdersDiff(): string {
    const sign = this.ordersDiff > 0 ? '+' : '';
    return `${sign}${this.ordersDiff}건`;
  }

  get formattedCustomersDiff(): string {
    const sign = this.customersDiff > 0 ? '+' : '';
    return `${sign}${this.customersDiff}명`;
  }

  get hasLowStockWarning(): boolean {
    return this.lowStockProducts > 0;
  }
}

export interface WeeklySalesPoint {
  day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  amount: number;
}

export interface CategorySalesRatio {
  category: string;
  percentage: number;
  amount: number;
  color: string;
}

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED'
  | 'RETURNED';

export interface RecentOrderProps {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  orderedAt: string;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PAYMENT_PENDING: '입금대기',
  PAID: '결제완료',
  PREPARING: '배송준비',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
  CANCEL_REQUESTED: '취소요청',
  CANCELLED: '취소완료',
  RETURNED: '반품완료',
};

export class RecentOrder {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerName: string;
  readonly productName: string;
  readonly amount: number;
  readonly status: OrderStatus;
  readonly orderedAt: string;

  constructor(props: RecentOrderProps) {
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.customerName = props.customerName;
    this.productName = props.productName;
    this.amount = props.amount;
    this.status = props.status;
    this.orderedAt = props.orderedAt;
  }

  get statusLabel(): string {
    return ORDER_STATUS_LABELS[this.status] || this.status;
  }

  get formattedAmount(): string {
    return formatCurrency(this.amount);
  }
}

