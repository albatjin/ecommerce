export type CustomerGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP' | 'VVIP';

export type CustomerStatus = 'ACTIVE' | 'DORMANT_WARNING' | 'DORMANT' | 'WITHDRAWN';

export type CustomerSortOption =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'totalSpent_desc'
  | 'totalSpent_asc';

export interface Customer {
  id: string;
  customerNumber: string; // e.g. 'CUST-08419'
  name: string;
  email: string;
  phone: string;
  membershipGrade: CustomerGrade;
  status: CustomerStatus;
  totalSpent: number;
  totalOrders: number;
  rewardPoints: number;
  smsConsent: boolean;
  emailConsent: boolean;
  createdAt: string;
  lastVisitAt: string;
  isNew?: boolean;
}

export interface CustomerSummary {
  totalCount: number;
  newCount: number;
  vipCount: number;
  dormantWarningCount: number;
  averageOrderValue?: number;
}

export interface CustomerQueryFilter {
  searchQuery?: string;
  gradeFilter?: CustomerGrade | 'ALL';
  sortBy?: CustomerSortOption;
  page?: number;
  pageSize?: number;
}

export function isVipCustomer(customer: Customer): boolean {
  return customer.membershipGrade === 'VIP' || customer.membershipGrade === 'VVIP';
}

export function formatCurrencyWon(amount: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

export function formatPoints(points: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(points)}P`;
}

export function calculateCustomerStats(customers: Customer[]): CustomerSummary {
  const totalCount = customers.length;
  let newCount = 0;
  let vipCount = 0;
  let dormantWarningCount = 0;

  for (const customer of customers) {
    if (customer.isNew) {
      newCount++;
    }
    if (isVipCustomer(customer)) {
      vipCount++;
    }
    if (customer.status === 'DORMANT_WARNING') {
      dormantWarningCount++;
    }
  }

  return {
    totalCount,
    newCount,
    vipCount,
    dormantWarningCount,
  };
}

export function calculateAverageOrderValue(totalSpent: number, totalOrders: number): number {
  if (!totalOrders || totalOrders <= 0) return 0;
  return Math.round(totalSpent / totalOrders);
}

export function calculateDaysSinceJoined(createdAt: string): number {
  const joinDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export interface PreferredCategory {
  category: string;
  percentage: number;
  color?: string;
}

export interface CustomerOrderHistoryItem {
  id: string;
  orderNumber: string;
  productSummary: string;
  amount: number;
  status: string;
  orderDate: string;
}

export interface CustomerMemo {
  id: string;
  author: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

export interface CustomerRecentProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  viewedAt: string;
  imageUrl?: string;
}

export interface CustomerCartItem {
  id: string;
  name: string;
  option: string;
  price: number;
  quantity: number;
  stockStatus: string;
  imageUrl?: string;
}

export interface CustomerDetail extends Customer {
  avatarUrl?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthYear?: number;
  personalCustomsCode?: string;
  defaultAddress?: string;
  defaultZipcode?: string;
  appPushConsent?: boolean;
  couponsCount?: number;
  daysSinceJoined?: number;
  averageOrderValue?: number;
  preferredCategories: PreferredCategory[];
  orderHistory: CustomerOrderHistoryItem[];
  memos?: CustomerMemo[];
  recentViewedProducts?: CustomerRecentProduct[];
  cartItems?: CustomerCartItem[];
}


