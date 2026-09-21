import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';
import { CustomerDetailView } from '../customer-detail-view';
import { CustomerDetail } from '../../../domain/entities/customer';

describe('CustomerDetailView Component (Presentation & Integration Test)', () => {
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
    couponsCount: 3,
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

  it('상단: 고객 이름과 수정 버튼, VIP 회원 뱃지, 액션 버튼을 올바르게 렌더링한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    // 고객 이름
    const nameHeadings = screen.getAllByText('김민서');
    expect(nameHeadings.length).toBeGreaterThanOrEqual(1);

    // 수정 버튼
    const editButtons = screen.getAllByRole('button', { name: /수정/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(1);

    // 상단 액션 버튼 및 상태
    expect(screen.getByText(/VIP 회원/i)).toBeInTheDocument();
    expect(screen.getByText(/정상 활동/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /적립금 지급\/차감/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /비밀번호 초기화 메일/i })).toBeInTheDocument();
  });

  it('왼쪽 - 프로필 카드: 아이콘, 이름, 이메일, 전화번호, 가입일을 표시한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    const profileCard = screen.getByTestId('customer-profile-card');
    expect(profileCard).toBeInTheDocument();

    expect(profileCard).toHaveTextContent('김민서');
    expect(profileCard).toHaveTextContent('minseo.kim@gmail.com');
    expect(profileCard).toHaveTextContent('010-8294-7102');
    expect(profileCard).toHaveTextContent(/2023\.08\.14/);

    // 아바타 아이콘/프로필 이미지 존재 확인
    expect(screen.getByTestId('profile-avatar-icon')).toBeInTheDocument();
  });

  it('오른쪽 - 고객요약 카드: 총 주문 15건, 총 구매액 ₩4,500,000, 평균 주문 ₩300,000, 등급 VIP(별아이콘)을 표시한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    const summaryCard = screen.getByTestId('customer-summary-card');
    expect(summaryCard).toBeInTheDocument();

    // 총 주문 15건
    expect(summaryCard).toHaveTextContent(/15\s*건/);

    // 총 구매액 ₩4,500,000
    expect(summaryCard).toHaveTextContent(/4,500,000/);

    // 평균 주문 ₩300,000
    expect(summaryCard).toHaveTextContent(/300,000/);

    // 등급: VIP 및 별 아이콘
    expect(summaryCard).toHaveTextContent(/VIP/);
    expect(screen.getByTestId('vip-star-icon')).toBeInTheDocument();
  });

  it('선호 카테고리: 가로 막대 그래프와 전자기기 80%, 의류 15%, 기타 5%를 표시한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    const categoryCard = screen.getByTestId('preferred-category-card');
    expect(categoryCard).toBeInTheDocument();

    expect(categoryCard).toHaveTextContent('선호 카테고리');
    expect(categoryCard).toHaveTextContent(/전자기기\s*80%/);
    expect(categoryCard).toHaveTextContent(/의류\s*15%/);
    expect(categoryCard).toHaveTextContent(/기타\s*5%/);

    // 가로 막대 그래프 렌더링 확인
    expect(screen.getByTestId('category-bar-chart')).toBeInTheDocument();
  });

  it('주문 히스토리 카드: 제목 "주문 히스토리", 컬럼 5종, 5개 행을 올바르게 렌더링한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    const historyCard = screen.getByTestId('order-history-card');
    expect(historyCard).toBeInTheDocument();

    // 제목: "주문 히스토리"
    expect(screen.getByText('주문 히스토리')).toBeInTheDocument();

    // 컬럼 5개: 주문번호, 상품요약, 금액, 상태, 날짜
    expect(screen.getByText('주문번호')).toBeInTheDocument();
    expect(screen.getByText('상품요약')).toBeInTheDocument();
    expect(screen.getByText('금액')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('날짜')).toBeInTheDocument();

    // 5개 행 데이터 확인
    const rows = screen.getAllByTestId('order-history-row');
    expect(rows.length).toBe(5);

    expect(historyCard).toHaveTextContent('#ORD-20250224-8819');
    expect(historyCard).toHaveTextContent('모던 캐시미어 블렌드 오버사이즈 코트 외 1건');
    expect(historyCard).toHaveTextContent('342,000');
    expect(historyCard).toHaveTextContent('배송완료');
    expect(historyCard).toHaveTextContent('2025.02.24 18:22');

    expect(historyCard).toHaveTextContent('#ORD-20241114-0982');
    expect(historyCard).toHaveTextContent('데일리 리사이클 패딩 베스트 (Black)');
    expect(historyCard).toHaveTextContent('89,000');
    expect(historyCard).toHaveTextContent('결제완료');
    expect(historyCard).toHaveTextContent('2024.11.14 09:12');
  });

  it('상단 "수정" 버튼 클릭 시 고객 정보 수정 모달이 노출되고 폼 입력 후 저장/닫기가 동작한다', () => {
    render(<CustomerDetailView customer={mockCustomerDetail} />);

    // 수정 모달은 처음에 보이지 않음
    expect(screen.queryByTestId('customer-edit-modal')).not.toBeInTheDocument();

    // 상단 "수정" 버튼 클릭
    const editBtn = screen.getByRole('button', { name: /고객 정보 수정|수정/i });
    fireEvent.click(editBtn);

    // 모달 표시 확인
    const modal = screen.getByTestId('customer-edit-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('고객 정보 수정');


    // 취소 버튼 클릭 시 모달 닫힘
    const cancelBtn = screen.getByRole('button', { name: /취소/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByTestId('customer-edit-modal')).not.toBeInTheDocument();
  });
});
