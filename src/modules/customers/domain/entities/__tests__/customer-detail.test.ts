import { describe, it, expect } from 'vitest';
import {
  CustomerDetail,
  formatCurrencyWon,
  calculateAverageOrderValue,
  calculateDaysSinceJoined,
} from '../customer';

describe('Customer Detail Entity & Domain Functions', () => {
  const mockCustomerDetail: CustomerDetail = {
    id: 'cust-kim',
    customerNumber: 'CUST-849201',
    name: '김민서',
    email: 'minseo.kim@gmail.com',
    phone: '010-8294-7102',
    membershipGrade: 'VIP',
    status: 'ACTIVE',
    totalSpent: 4500000,
    totalOrders: 15,
    rewardPoints: 14500,
    smsConsent: true,
    emailConsent: true,
    appPushConsent: true,
    createdAt: '2023-08-14T09:00:00Z',
    lastVisitAt: '2025-02-26T14:22:09Z',
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
  };

  it('고객 상세 정보의 기본 속성이 올바르게 정의되어 있어야 한다', () => {
    expect(mockCustomerDetail.name).toBe('김민서');
    expect(mockCustomerDetail.membershipGrade).toBe('VIP');
    expect(mockCustomerDetail.totalOrders).toBe(15);
    expect(mockCustomerDetail.totalSpent).toBe(4500000);
  });

  it('평균 주문 금액(AOV)을 정확히 계산한다: 4,500,000 / 15 = 300,000', () => {
    const aov = calculateAverageOrderValue(mockCustomerDetail.totalSpent, mockCustomerDetail.totalOrders);
    expect(aov).toBe(300000);
    expect(formatCurrencyWon(aov)).toBe('₩300,000');
  });

  it('총 주문수가 0일 경우 평균 주문 금액은 0을 반환한다', () => {
    expect(calculateAverageOrderValue(0, 0)).toBe(0);
  });

  it('선호 카테고리 비율의 총합은 100%이어야 한다', () => {
    const totalPercentage = mockCustomerDetail.preferredCategories.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBe(100);
  });

  it('주문 히스토리는 5건의 주문 항목을 포함한다', () => {
    expect(mockCustomerDetail.orderHistory.length).toBe(5);
    expect(mockCustomerDetail.orderHistory[0].orderNumber).toBe('#ORD-20250224-8819');
    expect(mockCustomerDetail.orderHistory[0].status).toBe('배송완료');
    expect(mockCustomerDetail.orderHistory[4].status).toBe('결제완료');
  });

  it('가입일 기준 경과 일수(D-day)를 정상 계산한다', () => {
    const days = calculateDaysSinceJoined(mockCustomerDetail.createdAt);
    expect(days).toBeGreaterThan(0);
  });
});


