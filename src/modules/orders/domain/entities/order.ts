export type OrderStatus =
  | 'PAYMENT_PENDING' // 결제대기
  | 'PAID'            // 결제완료
  | 'PREPARING'       // 상품준비 (배송준비)
  | 'SHIPPING'        // 배송중
  | 'DELIVERED'       // 배송완료
  | 'CANCELLED';      // 취소완료

export type OrderStatusLabel = '결제대기' | '결제완료' | '상품준비' | '배송중' | '배송완료' | '취소됨';

export interface OrderProgressStep {
  key: OrderStatus;
  label: string;
  subLabelDefault?: string;
}

export const ORDER_PROGRESS_STEPS: OrderProgressStep[] = [
  { key: 'PAYMENT_PENDING', label: '결제대기', subLabelDefault: '주문접수' },
  { key: 'PAID', label: '결제완료', subLabelDefault: '결제완료' },
  { key: 'PREPARING', label: '상품준비', subLabelDefault: '상품 패킹 중' },
  { key: 'SHIPPING', label: '배송중', subLabelDefault: '집하 예정' },
  { key: 'DELIVERED', label: '배송완료', subLabelDefault: '배송완료' },
];

export function getOrderStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'PAYMENT_PENDING':
      return 0;
    case 'PAID':
      return 1;
    case 'PREPARING':
      return 2;
    case 'SHIPPING':
      return 3;
    case 'DELIVERED':
      return 4;
    case 'CANCELLED':
    default:
      return -1;
  }
}

export interface OrderProps {
  id: string;
  orderNumber: string;
  customerName: string;
  orderSummary: string;
  paidAmount: number;
  status: OrderStatus;
  orderDate: string; // YYYY-MM-DD HH:mm
  recipientPhone?: string;
  shippingAddress?: string;
}

export class Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerName: string;
  readonly orderSummary: string;
  readonly paidAmount: number;
  readonly status: OrderStatus;
  readonly orderDate: string;
  readonly recipientPhone?: string;
  readonly shippingAddress?: string;

  constructor(props: OrderProps) {
    if (props.paidAmount < 0) {
      throw new Error('결제 금액은 0원 이상이어야 합니다.');
    }
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.customerName = props.customerName;
    this.orderSummary = props.orderSummary;
    this.paidAmount = props.paidAmount;
    this.status = props.status;
    this.orderDate = props.orderDate;
    this.recipientPhone = props.recipientPhone;
    this.shippingAddress = props.shippingAddress;
  }

  get statusLabel(): OrderStatusLabel {
    switch (this.status) {
      case 'PAYMENT_PENDING':
        return '결제대기';
      case 'PAID':
        return '결제완료';
      case 'PREPARING':
        return '상품준비';
      case 'SHIPPING':
        return '배송중';
      case 'DELIVERED':
        return '배송완료';
      case 'CANCELLED':
      default:
        return '취소됨';
    }
  }

  /**
   * 요구 명세 색상 배지:
   * - 결제대기: 노랑
   * - 결제완료: 파랑
   * - 상품준비: 주황/인디고
   * - 배송중: 보라
   * - 배송완료: 초록
   */
  get statusBadgeClass(): string {
    switch (this.status) {
      case 'PAYMENT_PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PAID':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SHIPPING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }
}

// ----------------------------------------------------
// Order Detail Entities and Types
// ----------------------------------------------------

export interface OrderItem {
  id: string;
  productName: string;
  categoryTag?: string;
  option?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  couponDiscount: number;
  shippingFee: number;
  subtotal: number;
  imageUrl?: string;
}

export interface OrderPaymentInfo {
  totalProductAmount: number;
  couponDiscount: number;
  pointUsed: number;
  shippingFee: number;
  finalPaidAmount: number;
  paymentMethod: string;
  installment?: string;
  approvedAt?: string;
  receiptUrl?: string;
}

export interface OrderShippingInfo {
  recipientName: string;
  isDefaultAddress?: boolean;
  phone: string;
  address: string;
  zipcode?: string;
  memo?: string;
  trackingCompany?: string;
  trackingNumber?: string;
}

export interface OrderCustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipGrade?: string;
  totalOrders: number;
  totalSpent: number;
  rewardPoints: number;
  pointsUsedThisOrder?: number;
  avatarUrl?: string;
}

export interface OrderCsMemo {
  id: string;
  author: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
}

export interface OrderNavigation {
  prevOrderId?: string;
  nextOrderId?: string;
}

export interface OrderDetailProps {
  id: string;
  orderNumber: string;
  displayTitle?: string; // e.g. "주문 #1234"
  status: OrderStatus;
  orderDate: string;
  paidDate?: string;
  estimatedShippingTime?: string; // e.g. "예상 집하 완료: 오늘 18:30 이전"
  items: OrderItem[];
  payment: OrderPaymentInfo;
  shipping: OrderShippingInfo;
  customer: OrderCustomerInfo;
  csNotes?: OrderCsMemo[];
  navigation?: OrderNavigation;
}

export class OrderDetail {
  readonly id: string;
  readonly orderNumber: string;
  readonly displayTitle: string;
  readonly status: OrderStatus;
  readonly orderDate: string;
  readonly paidDate?: string;
  readonly estimatedShippingTime?: string;
  readonly items: OrderItem[];
  readonly payment: OrderPaymentInfo;
  readonly shipping: OrderShippingInfo;
  readonly customer: OrderCustomerInfo;
  readonly csNotes: OrderCsMemo[];
  readonly navigation?: OrderNavigation;

  constructor(props: OrderDetailProps) {
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.displayTitle = props.displayTitle || `주문 #${props.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '1234'}`;
    this.status = props.status;
    this.orderDate = props.orderDate;
    this.paidDate = props.paidDate;
    this.estimatedShippingTime = props.estimatedShippingTime || '예상 집하 완료: 오늘 18:30 이전';
    this.items = props.items;
    this.payment = props.payment;
    this.shipping = props.shipping;
    this.customer = props.customer;
    this.csNotes = props.csNotes || [];
    this.navigation = props.navigation;
  }

  get statusLabel(): OrderStatusLabel {
    switch (this.status) {
      case 'PAYMENT_PENDING':
        return '결제대기';
      case 'PAID':
        return '결제완료';
      case 'PREPARING':
        return '상품준비';
      case 'SHIPPING':
        return '배송중';
      case 'DELIVERED':
        return '배송완료';
      case 'CANCELLED':
      default:
        return '취소됨';
    }
  }

  get currentStepIndex(): number {
    return getOrderStepIndex(this.status);
  }

  get statusBadgeClass(): string {
    switch (this.status) {
      case 'PAYMENT_PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PAID':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'SHIPPING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  }
}
