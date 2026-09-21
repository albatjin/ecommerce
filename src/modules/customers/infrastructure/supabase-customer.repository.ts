import { CustomerRepository, CustomerQueryResult } from '../domain/repositories/customer.repository';
import { Customer, CustomerDetail, CustomerSummary, CustomerQueryFilter } from '../domain/entities/customer';


export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerNumber: 'CUST-08419',
    name: '박지헌',
    email: 'jihyeon.park@gmail.com',
    phone: '010-8842-1923',
    membershipGrade: 'VVIP',
    status: 'ACTIVE',
    totalSpent: 4280000,
    totalOrders: 24,
    rewardPoints: 128500,
    smsConsent: true,
    emailConsent: true,
    createdAt: '2023-08-15T09:00:00Z',
    lastVisitAt: '2025-02-14T10:00:00Z',
  },
  {
    id: 'cust-2',
    customerNumber: 'CUST-08398',
    name: '최민성',
    email: 'minseong.choi@naver.com',
    phone: '010-4491-0329',
    membershipGrade: 'VIP',
    status: 'ACTIVE',
    totalSpent: 1890000,
    totalOrders: 15,
    rewardPoints: 42000,
    smsConsent: true,
    emailConsent: true,
    createdAt: '2023-10-20T09:00:00Z',
    lastVisitAt: '2025-02-12T10:00:00Z',
  },
  {
    id: 'cust-3',
    customerNumber: 'CUST-08204',
    name: '이하은',
    email: 'haeun.lee@kakao.com',
    phone: '010-9122-3841',
    membershipGrade: 'GOLD',
    status: 'ACTIVE',
    totalSpent: 840000,
    totalOrders: 8,
    rewardPoints: 18200,
    smsConsent: true,
    emailConsent: false,
    createdAt: '2023-11-05T09:00:00Z',
    lastVisitAt: '2025-02-05T10:00:00Z',
  },
  {
    id: 'cust-4',
    customerNumber: 'CUST-07981',
    name: '정우진',
    email: 'woojin.jung@daum.net',
    phone: '010-3329-8711',
    membershipGrade: 'SILVER',
    status: 'ACTIVE',
    totalSpent: 430000,
    totalOrders: 4,
    rewardPoints: 5000,
    smsConsent: true,
    emailConsent: true,
    createdAt: '2024-01-12T09:00:00Z',
    lastVisitAt: '2025-01-28T10:00:00Z',
  },
  {
    id: 'cust-5',
    customerNumber: 'CUST-08412',
    name: '김서연',
    email: 'seoyeon.kim@gmail.com',
    phone: '010-6712-4402',
    membershipGrade: 'BRONZE',
    status: 'ACTIVE',
    totalSpent: 89000,
    totalOrders: 1,
    rewardPoints: 3000,
    smsConsent: false,
    emailConsent: true,
    createdAt: '2025-02-13T09:00:00Z',
    lastVisitAt: '2025-02-13T09:00:00Z',
    isNew: true,
  },
  {
    id: 'cust-6',
    customerNumber: 'CUST-06102',
    name: '송태섭',
    email: 'taesup.song@naver.com',
    phone: '010-2211-9874',
    membershipGrade: 'GOLD',
    status: 'DORMANT_WARNING',
    totalSpent: 1120000,
    totalOrders: 11,
    rewardPoints: 450,
    smsConsent: false,
    emailConsent: false,
    createdAt: '2023-05-18T09:00:00Z',
    lastVisitAt: '2024-02-18T09:00:00Z',
  },
  {
    id: 'cust-7',
    customerNumber: 'CUST-07440',
    name: '윤도경',
    email: 'dokyung.yoon@company.com',
    phone: '010-7399-5501',
    membershipGrade: 'VIP',
    status: 'ACTIVE',
    totalSpent: 2410000,
    totalOrders: 18,
    rewardPoints: 54000,
    smsConsent: true,
    emailConsent: true,
    createdAt: '2023-09-02T09:00:00Z',
    lastVisitAt: '2025-02-08T09:00:00Z',
  },
  {
    id: 'cust-8',
    customerNumber: 'CUST-08015',
    name: '한가을',
    email: 'fall.han@outlook.kr',
    phone: '010-5110-3372',
    membershipGrade: 'SILVER',
    status: 'ACTIVE',
    totalSpent: 612000,
    totalOrders: 6,
    rewardPoints: 11500,
    smsConsent: true,
    emailConsent: false,
    createdAt: '2024-02-01T09:00:00Z',
    lastVisitAt: '2025-02-01T09:00:00Z',
  },
];

export class SupabaseCustomerRepository implements CustomerRepository {
  private readonly supabaseClient?: unknown;

  constructor(supabaseClient?: unknown) {
    this.supabaseClient = supabaseClient;
  }

  async getCustomers(filter: CustomerQueryFilter = {}): Promise<CustomerQueryResult> {
    const {
      searchQuery = '',
      gradeFilter = 'ALL',
      sortBy = 'createdAt_desc',
      page = 1,
      pageSize = 20,
    } = filter;

    let items = [...SEED_CUSTOMERS];

    // Filter by search query (name, email, or phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.customerNumber.toLowerCase().includes(q)
      );
    }

    // Filter by grade
    if (gradeFilter && gradeFilter !== 'ALL') {
      items = items.filter((c) => c.membershipGrade === gradeFilter);
    }

    // Sort
    items.sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent_desc':
          return b.totalSpent - a.totalSpent;
        case 'totalSpent_asc':
          return a.totalSpent - b.totalSpent;
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedCustomers = items.slice(startIndex, startIndex + pageSize);

    return {
      customers: paginatedCustomers,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async getCustomerStats(): Promise<CustomerSummary> {
    return {
      totalCount: 8420,
      newCount: 342,
      vipCount: 380,
      dormantWarningCount: 48,
      averageOrderValue: 480000,
    };
  }

  async getCustomerDetail(id: string): Promise<CustomerDetail | null> {
    if (!id) return null;

    // Check if ID matches one of our known seed customers or is default
    const baseCustomer = SEED_CUSTOMERS.find((c) => c.id === id || c.customerNumber === id);

    // Default detailed customer mockup modeled after '김민서'
    const defaultDetail: CustomerDetail = {
      id: baseCustomer ? baseCustomer.id : id,
      customerNumber: baseCustomer ? baseCustomer.customerNumber : 'CUST-849201',
      name: baseCustomer ? baseCustomer.name : '김민서',
      email: baseCustomer ? baseCustomer.email : 'minseo.kim@gmail.com',
      phone: baseCustomer ? baseCustomer.phone : '010-8294-7102',
      membershipGrade: baseCustomer?.membershipGrade || 'VIP',
      status: baseCustomer?.status || 'ACTIVE',
      totalSpent: baseCustomer ? (baseCustomer.id === 'cust-kim' ? 4500000 : baseCustomer.totalSpent) : 4500000,
      totalOrders: baseCustomer ? (baseCustomer.id === 'cust-kim' ? 15 : baseCustomer.totalOrders) : 15,
      rewardPoints: baseCustomer ? baseCustomer.rewardPoints : 14500,
      couponsCount: 3,
      smsConsent: baseCustomer ? baseCustomer.smsConsent : true,
      emailConsent: baseCustomer ? baseCustomer.emailConsent : true,
      appPushConsent: true,
      createdAt: baseCustomer ? baseCustomer.createdAt : '2023-08-14T09:00:00Z',
      lastVisitAt: baseCustomer ? baseCustomer.lastVisitAt : '2025-02-26T14:22:09Z',
      gender: 'FEMALE',
      birthYear: 1994,
      personalCustomsCode: 'P123456789012',
      defaultAddress: '서울특별시 마포구 월드컵북로 120, 에코빌리지 702호',
      defaultZipcode: '03992',
      preferredCategories: [
        { category: '전자기기', percentage: 80, color: '#3B82F6' },
        { category: '의류', percentage: 15, color: '#10B981' },
        { category: '기타', percentage: 5, color: '#9CA3AF' },
      ],
      orderHistory: [
        {
          id: 'ord-1',
          orderNumber: '#ORD-20250224-8819',
          productSummary: '모던 캐시미어 블렌드 오버사이즈 코트 외 1건',
          amount: 342000,
          status: '배송완료',
          orderDate: '2025.02.24 18:22',
        },
        {
          id: 'ord-2',
          orderNumber: '#ORD-20250210-6421',
          productSummary: '프리미엄 메리노울 니트 가디건',
          amount: 159000,
          status: '배송완료',
          orderDate: '2025.02.10 11:15',
        },
        {
          id: 'ord-3',
          orderNumber: '#ORD-20250119-3289',
          productSummary: '천연 소가죽 클래식 스퀘어 토트백',
          amount: 289000,
          status: '배송완료',
          orderDate: '2025.01.19 14:02',
        },
        {
          id: 'ord-4',
          orderNumber: '#ORD-20241225-1104',
          productSummary: '에센셜 실크 블라우스 & 슬림 핀턱 팬츠',
          amount: 218000,
          status: '배송완료',
          orderDate: '2024.12.25 21:40',
        },
        {
          id: 'ord-5',
          orderNumber: '#ORD-20241114-0982',
          productSummary: '데일리 리사이클 패딩 베스트 (Black)',
          amount: 89000,
          status: '결제완료',
          orderDate: '2024.11.14 09:12',
        },
      ],
      memos: [
        {
          id: 'memo-1',
          author: '이수민 매니저(배송CS)',
          authorRole: '배송CS',
          content: '문 앞 공동현관 비밀번호 재확인 안내 드렸으며, 통화 시 항상 부재중일 경우 문자 안내 선호하심.',
          createdAt: '2025.02.18 10:45',
        },
        {
          id: 'memo-2',
          author: '김운영 관리자',
          authorRole: '최고관리자',
          content: '연말 VIP 감사 프로모션 20% 추가 쿠폰 수동 지급 완료.',
          createdAt: '2024.12.24 16:30',
        },
      ],
      recentViewedProducts: [
        {
          id: 'view-1',
          name: '이탈리안 레더 앵클 첼시 부츠',
          category: 'Footwear',
          price: 245000,
          viewedAt: '조회 2시간 전',
        },
        {
          id: 'view-2',
          name: '소프트 알파카 V넥 루즈 니트',
          category: 'Apparel',
          price: 138000,
          viewedAt: '조회 어제',
        },
      ],
      cartItems: [
        {
          id: 'cart-1',
          name: '클래식 레더 미니 크로스바디 백',
          option: '옵션: 카멜브라운 / One Size',
          price: 189000,
          quantity: 1,
          stockStatus: '재고 여유',
        },
        {
          id: 'cart-2',
          name: '실크 터치 프리미엄 파자마 세트',
          option: '옵션: 아이보리 / M (수량 2)',
          price: 158000,
          quantity: 2,
          stockStatus: '품절임박 (3개 남음)',
        },
      ],
    };

    return defaultDetail;
  }
}

