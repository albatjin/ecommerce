'use client';

import React, { useState } from 'react';
import { CustomerDetail } from '../../domain/entities/customer';
import { CustomerDetailHeader } from './customer-detail-header';
import { CustomerProfileCard } from './customer-profile-card';
import { CustomerSummaryCard } from './customer-summary-card';
import { CustomerCategoryChart } from './customer-category-chart';
import { CustomerOrderHistoryCard } from './customer-order-history-card';
import { CustomerCsMemoCard, CustomerRecentCartCards } from './customer-detail-extra-cards';
import { CustomerEditModal } from './customer-edit-modal';

interface CustomerDetailViewProps {
  customer: CustomerDetail;
}

export function CustomerDetailView({ customer: initialCustomer }: CustomerDetailViewProps) {
  const [customer, setCustomer] = useState<CustomerDetail>(initialCustomer);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveCustomer = (updated: Partial<CustomerDetail>) => {
    setCustomer((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header (고객명, 뱃지, 수정 버튼, 액션 버튼) */}
      <CustomerDetailHeader
        customer={customer}
        onEditClick={() => setIsEditModalOpen(true)}
        onRewardPointsClick={() => alert('적립금 지급/차감 팝업이 열립니다.')}
        onResetPasswordClick={() => alert('비밀번호 재설정 인증 메일이 발송되었습니다.')}
        onWithdrawClick={() => {
          if (confirm('해당 고객을 탈퇴 처리하시겠습니까?')) {
            alert('탈퇴 처리되었습니다.');
          }
        }}
      />

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card + CS Memo Card (lg: 4 cols or 5 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          <CustomerProfileCard customer={customer} />
          <CustomerCsMemoCard initialMemos={customer.memos} />
        </div>

        {/* Right Column: Customer Summary + Category Chart + Order History + Extra Cards (lg: 8 cols) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          {/* 고객 요약 카드 */}
          <CustomerSummaryCard customer={customer} />

          {/* 선호 카테고리 카드 */}
          <CustomerCategoryChart categories={customer.preferredCategories} />

          {/* 주문 히스토리 카드 */}
          <CustomerOrderHistoryCard orders={customer.orderHistory} />

          {/* 최근 조회 상품 & 현재 장바구니 보관함 */}
          <CustomerRecentCartCards
            recentProducts={customer.recentViewedProducts}
            cartItems={customer.cartItems}
          />
        </div>
      </div>

      {/* 3. Customer Edit Modal */}
      <CustomerEditModal
        customer={customer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}

