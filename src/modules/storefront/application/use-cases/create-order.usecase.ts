import { Order, OrderDetail, OrderItem, OrderPaymentInfo, OrderShippingInfo, OrderCustomerInfo, OrderCsMemo } from '@/modules/orders/domain/entities/order';
import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';

export interface CreateOrderItemInput {
  productId: string;
  productCode: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface CreateOrderInput {
  shipping: {
    recipientName: string;
    phone: string;
    address: string;
    zipcode: string;
    memo?: string;
  };
  payment: {
    method: string;
    methodLabel: string;
    installment?: string;
  };
  items: CreateOrderItemInput[];
}

export interface CreatedOrderResult {
  id: string;
  orderNumber: string;
  orderSummary: string;
  paidAmount: number;
  orderDate: string;
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
  itemCount: number;
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<CreatedOrderResult> {
    if (!input.items || input.items.length === 0) {
      throw new Error('주문할 상품이 없습니다.');
    }

    if (!input.shipping.recipientName || !input.shipping.phone || !input.shipping.address) {
      throw new Error('배송지 정보를 모두 입력해 주세요.');
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;
    const orderId = `ord-${Date.now().toString().slice(-6)}`;

    const totalProductAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 0; // 무료 배송 정책
    const totalPaidAmount = totalProductAmount + shippingFee;

    const firstItem = input.items[0];
    const orderSummary =
      input.items.length > 1
        ? `${firstItem.name} 외 ${input.items.length - 1}건`
        : firstItem.name;

    const formattedOrderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const order = new Order({
      id: orderId,
      orderNumber,
      customerName: input.shipping.recipientName,
      orderSummary,
      paidAmount: totalPaidAmount,
      status: 'PAID',
      orderDate: formattedOrderDate,
      recipientPhone: input.shipping.phone,
      shippingAddress: input.shipping.address,
    });

    const orderItems: OrderItem[] = input.items.map((item, idx) => ({
      id: `item-${orderId}-${idx + 1}`,
      productName: item.name,
      categoryTag: item.category || '일반 상품',
      sku: item.productCode,
      unitPrice: item.price,
      quantity: item.quantity,
      couponDiscount: 0,
      shippingFee: 0,
      subtotal: item.price * item.quantity,
      imageUrl: item.imageUrl,
    }));

    const payment: OrderPaymentInfo = {
      totalProductAmount,
      couponDiscount: 0,
      pointUsed: 0,
      shippingFee,
      finalPaidAmount: totalPaidAmount,
      paymentMethod: input.payment.methodLabel,
      installment: input.payment.installment || '일시불',
      approvedAt: formattedOrderDate,
    };

    const shipping: OrderShippingInfo = {
      recipientName: input.shipping.recipientName,
      isDefaultAddress: true,
      phone: input.shipping.phone,
      address: input.shipping.address,
      zipcode: input.shipping.zipcode,
      memo: input.shipping.memo || '부재 시 경비실에 맡겨주세요.',
      trackingCompany: 'CJ대한통운 (택배)',
      trackingNumber: `689${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    const customer: OrderCustomerInfo = {
      id: `cust-${input.shipping.phone.replace(/[^0-9]/g, '').slice(-4) || 'guest'}`,
      name: input.shipping.recipientName,
      email: `${input.shipping.recipientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: input.shipping.phone,
      membershipGrade: '일반 회원',
      totalOrders: 1,
      totalSpent: totalPaidAmount,
      rewardPoints: Math.floor(totalPaidAmount * 0.01),
    };

    const csNotes: OrderCsMemo[] = [
      {
        id: `note-${Date.now()}-1`,
        author: '시스템 자동 기록',
        content: `PG 결제 승인 완료 (${input.payment.methodLabel} / 승인번호: ${Math.floor(
          10000000 + Math.random() * 90000000
        )}). 주문이 [결제완료] 상태로 접수되었습니다.`,
        isSystem: true,
        createdAt: formattedOrderDate,
      },
      {
        id: `note-${Date.now()}-2`,
        author: '시스템 자동 기록',
        content: '온라인 쇼핑몰 체크아웃을 통해 주문 접수되었습니다.',
        isSystem: true,
        createdAt: formattedOrderDate,
      },
    ];

    const detail = new OrderDetail({
      id: orderId,
      orderNumber,
      displayTitle: `주문 #${orderNumber.slice(-4)}`,
      status: 'PAID',
      orderDate: formattedOrderDate,
      paidDate: formattedOrderDate,
      items: orderItems,
      payment,
      shipping,
      customer,
      csNotes,
    });

    await this.orderRepository.createOrder(order, detail);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      orderSummary: order.orderSummary,
      paidAmount: order.paidAmount,
      orderDate: order.orderDate,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress || '',
      paymentMethod: payment.paymentMethod,
      itemCount: input.items.reduce((cnt, it) => cnt + it.quantity, 0),
    };
  }
}

