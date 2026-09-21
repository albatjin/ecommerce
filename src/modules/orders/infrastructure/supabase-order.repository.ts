import { OrderRepository, OrderQueryFilter, OrderQueryResult } from '../domain/repositories/order.repository';
import { Order, OrderDetail, OrderStatus, OrderCsMemo } from '../domain/entities/order';
import { SupabaseClient } from '@supabase/supabase-js';

export const SEED_ORDERS: Order[] = [
  new Order({
    id: 'ord-01',
    orderNumber: 'ORD-20250520-00192',
    customerName: '김민수',
    orderSummary: '프리미엄 오버핏 캐시미어 코트 외 1건',
    paidAmount: 177000,
    status: 'PREPARING',
    orderDate: '2025-05-20 14:18',
    recipientPhone: '010-8921-3342',
    shippingAddress: '서울특별시 강남구 테헤란로 152 강남파이낸스센터 14층 (역삼동)',
  }),
  new Order({
    id: 'ord-02',
    orderNumber: 'ORD-20250520-00191',
    customerName: '이서연',
    orderSummary: '프리미엄 캐시미어 블렌드 싱글 코트',
    paidAmount: 249000,
    status: 'PAYMENT_PENDING',
    orderDate: '2025-05-20 13:15',
    recipientPhone: '010-9122-3841',
    shippingAddress: '경기도 성남시 분당구 판교역로 235',
  }),
  new Order({
    id: 'ord-03',
    orderNumber: 'ORD-20250520-00190',
    customerName: '박준영',
    orderSummary: '기계식 무접점 게이밍 키보드',
    paidAmount: 149000,
    status: 'SHIPPING',
    orderDate: '2025-05-20 11:45',
    recipientPhone: '010-4491-0329',
    shippingAddress: '부산광역시 해운대구 센텀중앙로 78',
  }),
  new Order({
    id: 'ord-04',
    orderNumber: 'ORD-20250519-00189',
    customerName: '최유나',
    orderSummary: '청송 프리미엄 GAP 유기농 꿀사과 5kg',
    paidAmount: 36000,
    status: 'DELIVERED',
    orderDate: '2025-05-19 18:20',
    recipientPhone: '010-8842-1923',
    shippingAddress: '대구광역시 수성구 달구벌대로 2450',
  }),
  new Order({
    id: 'ord-05',
    orderNumber: 'ORD-20250519-00188',
    customerName: '정우진',
    orderSummary: '무선 노이즈캔슬링 프리미엄 헤드폰',
    paidAmount: 329000,
    status: 'PAID',
    orderDate: '2025-05-19 16:10',
    recipientPhone: '010-3329-8711',
    shippingAddress: '인천광역시 연수구 송도과학로 32',
  }),
  new Order({
    id: 'ord-06',
    orderNumber: 'ORD-20250519-00187',
    customerName: '한지혜',
    orderSummary: '1++ 등급 한우 안심 스테이크 세트 600g',
    paidAmount: 95000,
    status: 'SHIPPING',
    orderDate: '2025-05-19 14:05',
    recipientPhone: '010-5512-8841',
    shippingAddress: '대전광역시 유성구 대덕대로 512',
  }),
  new Order({
    id: 'ord-07',
    orderNumber: 'ORD-20250518-00186',
    customerName: '강태양',
    orderSummary: '헤비웨이트 오버사이즈 후드티 외 2건',
    paidAmount: 131000,
    status: 'PAYMENT_PENDING',
    orderDate: '2025-05-18 20:30',
    recipientPhone: '010-2294-7711',
    shippingAddress: '광주광역시 서구 상무중앙로 80',
  }),
  new Order({
    id: 'ord-08',
    orderNumber: 'ORD-20250518-00185',
    customerName: '윤도현',
    orderSummary: '27인치 4K UHD 고화질 모니터',
    paidAmount: 399000,
    status: 'DELIVERED',
    orderDate: '2025-05-18 10:15',
    recipientPhone: '010-7731-9022',
    shippingAddress: '울산광역시 남구 삼산로 182',
  }),
];

export const SEED_ORDER_DETAILS: Record<string, OrderDetail> = {
  'ord-01': new OrderDetail({
    id: 'ord-01',
    orderNumber: 'ORD-20250520-00192',
    displayTitle: '주문 #1234',
    status: 'PREPARING',
    orderDate: '2025-05-20 14:18:04',
    paidDate: '2025-05-20 14:22:15',
    estimatedShippingTime: '오늘 18:30 이전',
    items: [
      {
        id: 'item-01',
        productName: '프리미엄 오버핏 캐시미어 코트',
        categoryTag: 'FW 프리미엄 라인업',
        option: '차콜 (Charcoal) / Size L (105)',
        sku: 'COAT-CASH-CH-L',
        unitPrice: 189000,
        quantity: 1,
        couponDiscount: 10000,
        shippingFee: 0,
        subtotal: 179000,
        imageUrl: '/products/coat.png',
      },
    ],
    payment: {
      totalProductAmount: 189000,
      couponDiscount: 10000,
      pointUsed: 2000,
      shippingFee: 0,
      finalPaidAmount: 177000,
      paymentMethod: '신용카드 (현대카드)',
      installment: '12개월 무이자',
      approvedAt: '2025-05-20 14:22:15',
    },
    shipping: {
      recipientName: '김민서',
      isDefaultAddress: true,
      phone: '010-8921-3342',
      address: '서울특별시 강남구 테헤란로 152 강남파이낸스센터 14층 (역삼동)',
      zipcode: '06236',
      memo: '문 앞에 두고 벨 눌러주세요',
      trackingCompany: 'CJ대한통운 (택배)',
      trackingNumber: '689124409121',
    },
    customer: {
      id: 'cust-kim',
      name: '김민서',
      email: 'minseo.kim@gmail.com',
      phone: '010-8921-3342',
      membershipGrade: 'VIP 회원',
      totalOrders: 8,
      totalSpent: 1420000,
      rewardPoints: 3450,
      pointsUsedThisOrder: 2000,
    },
    csNotes: [
      {
        id: 'note-01',
        author: '김윤영 (물류 담당)',
        content: '코트 패킹 완료 후 특수 보호 비닐 포장 적용. 오늘 18시 로젠/CJ 통합 수거트럭으로 출고 예정.',
        isSystem: false,
        createdAt: '2025-05-20 15:10',
      },
      {
        id: 'note-02',
        author: '시스템 자동 기록',
        content: 'PG 결제 승인 완료 (현대카드 / 승인번호: 82910394 / 12개월 무이자). 주문 상태가 [배송 준비중]으로 자동 변경되었습니다.',
        isSystem: true,
        createdAt: '2025-05-20 14:22',
      },
      {
        id: 'note-03',
        author: '시스템 자동 기록',
        content: '온라인 스토어 웹 채널을 통해 주문 접수되었습니다.',
        isSystem: true,
        createdAt: '2025-05-20 14:18',
      },
    ],
    navigation: {
      prevOrderId: 'ord-02',
      nextOrderId: 'ord-03',
    },
  }),
};

export class SupabaseOrderRepository implements OrderRepository {
  private localOrders: Order[] = [...SEED_ORDERS];
  private localOrderDetails: Record<string, OrderDetail> = { ...SEED_ORDER_DETAILS };

  constructor(private readonly supabase: SupabaseClient) {}

  async getOrders(filter: OrderQueryFilter): Promise<OrderQueryResult> {
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 8;

    try {
      let query = this.supabase
        .from('orders')
        .select(`
          id,
          order_number,
          order_name,
          status,
          total_paid_amount,
          created_at,
          recipient_name,
          recipient_phone,
          shipping_address
        `, { count: 'exact' });

      if (filter.searchQuery) {
        query = query.or(`order_number.ilike.%${filter.searchQuery}%,recipient_name.ilike.%${filter.searchQuery}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

      if (error || !data || data.length === 0) {
        return this.filterInMemory(filter, page, pageSize);
      }

      const orders = data.map((item: any) => {
        return new Order({
          id: item.id,
          orderNumber: item.order_number,
          customerName: item.recipient_name || '고객',
          orderSummary: item.order_name,
          paidAmount: Number(item.total_paid_amount),
          status: item.status,
          orderDate: item.created_at ? item.created_at.replace('T', ' ').slice(0, 16) : '',
          recipientPhone: item.recipient_phone,
          shippingAddress: item.shipping_address,
        });
      });

      const totalCount = count ?? orders.length;
      return {
        orders,
        totalCount,
        pendingProcessingCount: 15,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch {
      return this.filterInMemory(filter, page, pageSize);
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    const normId = id.replace(/^(ord-)([0-9])$/, '$10$2');
    const found = this.localOrders.find((o) => o.id === id || o.id === normId || o.orderNumber === id);
    return found || null;
  }

  async getOrderDetail(id: string): Promise<OrderDetail | null> {
    const normId = id.replace(/^(ord-)([0-9])$/, '$10$2');
    // 1. Check local details by ID or order number
    if (this.localOrderDetails[id]) {
      return this.localOrderDetails[id];
    }
    if (this.localOrderDetails[normId]) {
      return this.localOrderDetails[normId];
    }
    const foundByNum = Object.values(this.localOrderDetails).find(
      (d) => d.orderNumber === id || d.orderNumber.toLowerCase() === id.toLowerCase()
    );
    if (foundByNum) {
      return foundByNum;
    }

    // 2. If it is in SEED_ORDERS, synthesize an OrderDetail
    const basicOrder = this.localOrders.find(
      (o) => o.id === id || o.id === normId || o.orderNumber === id
    );
    if (basicOrder) {
      const synthDetail = new OrderDetail({
        id: basicOrder.id,
        orderNumber: basicOrder.orderNumber,
        displayTitle: `주문 #${basicOrder.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '1234'}`,
        status: basicOrder.status,
        orderDate: basicOrder.orderDate,
        paidDate: basicOrder.orderDate,
        items: [
          {
            id: `item-${basicOrder.id}`,
            productName: basicOrder.orderSummary,
            categoryTag: '주문 상품',
            option: '기본 옵션',
            sku: 'ITEM-DEFAULT',
            unitPrice: basicOrder.paidAmount,
            quantity: 1,
            couponDiscount: 0,
            shippingFee: 0,
            subtotal: basicOrder.paidAmount,
          },
        ],
        payment: {
          totalProductAmount: basicOrder.paidAmount,
          couponDiscount: 0,
          pointUsed: 0,
          shippingFee: 0,
          finalPaidAmount: basicOrder.paidAmount,
          paymentMethod: '신용카드 (현대카드)',
          installment: '일시불',
          approvedAt: basicOrder.orderDate,
        },
        shipping: {
          recipientName: basicOrder.customerName,
          isDefaultAddress: true,
          phone: basicOrder.recipientPhone || '010-0000-0000',
          address: basicOrder.shippingAddress || '배송지 정보 없음',
          zipcode: '06236',
          memo: '부재 시 경비실에 맡겨주세요.',
          trackingCompany: 'CJ대한통운 (택배)',
          trackingNumber: '689124409121',
        },
        customer: {
          id: 'cust-kim',
          name: basicOrder.customerName,
          email: `${basicOrder.customerName.toLowerCase()}@example.com`,
          phone: basicOrder.recipientPhone || '010-0000-0000',
          membershipGrade: '일반 회원',
          totalOrders: 3,
          totalSpent: basicOrder.paidAmount,
          rewardPoints: 1000,
        },
        csNotes: [
          {
            id: `note-${basicOrder.id}`,
            author: '시스템 자동 기록',
            content: '주문이 정상 접수되었습니다.',
            isSystem: true,
            createdAt: basicOrder.orderDate,
          },
        ],
        navigation: {
          prevOrderId: 'ord-01',
          nextOrderId: 'ord-03',
        },
      });
      return synthDetail;
    }

    return null;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    const detail = await this.getOrderDetail(id);
    if (detail) {
      const updated = new OrderDetail({
        ...detail,
        status,
      });
      this.localOrderDetails[detail.id] = updated;
      this.localOrderDetails[detail.orderNumber] = updated;

      // Also update in localOrders
      const oIdx = this.localOrders.findIndex((o) => o.id === detail.id || o.orderNumber === detail.orderNumber);
      if (oIdx >= 0) {
        this.localOrders[oIdx] = new Order({
          ...this.localOrders[oIdx],
          status,
        });
      }
      return true;
    }
    return false;
  }

  async updateTrackingInfo(id: string, trackingCompany: string, trackingNumber: string): Promise<boolean> {
    const detail = await this.getOrderDetail(id);
    if (detail) {
      const updated = new OrderDetail({
        ...detail,
        shipping: {
          ...detail.shipping,
          trackingCompany,
          trackingNumber,
        },
      });
      this.localOrderDetails[detail.id] = updated;
      this.localOrderDetails[detail.orderNumber] = updated;
      return true;
    }
    return false;
  }

  async addCsNote(orderId: string, author: string, content: string): Promise<OrderCsMemo> {
    const detail = await this.getOrderDetail(orderId);
    const newMemo: OrderCsMemo = {
      id: `note-${Date.now()}`,
      author,
      content,
      isSystem: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    if (detail) {
      const updated = new OrderDetail({
        ...detail,
        csNotes: [newMemo, ...detail.csNotes],
      });
      this.localOrderDetails[detail.id] = updated;
      this.localOrderDetails[detail.orderNumber] = updated;
    }
    return newMemo;
  }

  private filterInMemory(filter: OrderQueryFilter, page: number, pageSize: number): OrderQueryResult {
    let filtered = [...this.localOrders];

    // 1. 상태별 탭 필터: 전체 | 결제대기 | 결제완료 | 상품준비 | 배송중 | 배송완료
    if (filter.statusTab && filter.statusTab !== '전체') {
      filtered = filtered.filter((o) => o.statusLabel === filter.statusTab);
    }

    // 2. 검색어 필터: 주문번호 또는 고객명
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
      );
    }

    // 3. 날짜 범위 필터
    if (filter.startDate) {
      filtered = filtered.filter((o) => o.orderDate.slice(0, 10) >= filter.startDate!);
    }
    if (filter.endDate) {
      filtered = filtered.filter((o) => o.orderDate.slice(0, 10) <= filter.endDate!);
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    return {
      orders: paged,
      totalCount,
      pendingProcessingCount: 15,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };
  }
}
