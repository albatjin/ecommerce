'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderDetail, OrderStatus } from '../../domain/entities/order';
import { OrderDetailHeader } from './order-detail-header';
import { OrderStatusStepper } from './order-status-stepper';
import { OrderItemsCard } from './order-items-card';
import { OrderShippingCard } from './order-shipping-card';
import { OrderTrackingCard } from './order-tracking-card';
import { OrderPaymentCard } from './order-payment-card';
import { OrderCustomerCard } from './order-customer-card';
import { OrderCsMemoCard } from './order-cs-memo-card';
import { OrderBottomActionBar } from './order-bottom-action-bar';

interface OrderDetailViewProps {
  order: OrderDetail;
  onCancelOrder?: () => void;
  onStatusSave?: (status: OrderStatus) => void;
  onTrackingSave?: (company: string, trackingNumber: string) => void;
}

export function OrderDetailView({
  order: initialOrder,
  onCancelOrder,
  onStatusSave,
  onTrackingSave,
}: OrderDetailViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail>(initialOrder);

  // Status Change Handler
  const handleStatusSave = (newStatus: OrderStatus) => {
    setOrder(
      new OrderDetail({
        ...order,
        status: newStatus,
      })
    );
    if (onStatusSave) {
      onStatusSave(newStatus);
    }
  };

  // Tracking Save Handler
  const handleTrackingSave = (company: string, trackingNumber: string) => {
    setOrder(
      new OrderDetail({
        ...order,
        shipping: {
          ...order.shipping,
          trackingCompany: company,
          trackingNumber,
        },
      })
    );
    if (onTrackingSave) {
      onTrackingSave(company, trackingNumber);
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = () => {
    setOrder(
      new OrderDetail({
        ...order,
        status: 'CANCELLED',
      })
    );
    if (onCancelOrder) {
      onCancelOrder();
    }
  };

  // CS Memo Handler
  const handleAddMemo = (content: string) => {
    const newMemo = {
      id: `memo-${Date.now()}`,
      author: '김운영 (관리자)',
      content,
      isSystem: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setOrder(
      new OrderDetail({
        ...order,
        csNotes: [newMemo, ...order.csNotes],
      })
    );
  };

  // Navigations
  const handlePrev = () => {
    if (order.navigation?.prevOrderId) {
      router.push(`/orders/${order.navigation.prevOrderId}`);
    }
  };

  const handleNext = () => {
    if (order.navigation?.nextOrderId) {
      router.push(`/orders/${order.navigation.nextOrderId}`);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Top Header: Title "주문 #1234", 이전/목록/다음, 운송장 등록, 주문서 출력, 주문 취소/환불 */}
      <OrderDetailHeader
        order={order}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenTrackingModal={() => {
          const el = document.getElementById('tracking-input');
          if (el) el.focus();
        }}
        onPrintInvoice={() => window.print()}
        onCancelOrder={handleCancelOrder}
      />

      {/* 2. Order Status Stepper: 5단계 가로 진행바 (결제대기 → 결제완료 → 상품준비 → 배송중 → 배송완료) */}
      <OrderStatusStepper
        currentStatus={order.status}
        estimatedTime={order.estimatedShippingTime}
        orderDate={order.orderDate}
        paidDate={order.paidDate}
      />

      {/* 3. 2-Column Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): 주문 상품 목록, 배송지 정보, 운송장 설정, 관리자 CS 메모 */}
        <div className="lg:col-span-8 space-y-6">
          {/* 주문 상품 카드 */}
          <OrderItemsCard
            items={order.items}
            totalProductAmount={order.payment.totalProductAmount}
            shippingFee={order.payment.shippingFee}
            finalPaidAmount={order.payment.finalPaidAmount}
            onCheckStock={() => router.push('/products')}
          />

          {/* 배송지 정보 카드 */}
          <OrderShippingCard
            shipping={order.shipping}
            onEditAddress={() => alert('배송지 변경 팝업이 열립니다.')}
          />

          {/* 배송 및 운송장 설정 카드 */}
          <OrderTrackingCard
            initialCompany={order.shipping.trackingCompany}
            initialTrackingNumber={order.shipping.trackingNumber}
            onSaveTracking={handleTrackingSave}
          />

          {/* 관리자 CS 메모 및 처리 이력 카드 */}
          <OrderCsMemoCard
            initialMemos={order.csNotes}
            onAddMemo={handleAddMemo}
          />
        </div>

        {/* Right Column (4 cols): 결제 금액 상세 (주문 정보), 주문자 정보 (고객 정보) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 결제 금액 상세 카드 (주문 정보: 주문일, 결제일, 결제수단 등) */}
          <OrderPaymentCard
            payment={order.payment}
            orderDate={order.orderDate}
            paidDate={order.paidDate}
          />

          {/* 주문자 정보 카드 (고객 정보: 이름, 연락처, 이메일 등) */}
          <OrderCustomerCard customer={order.customer} />
        </div>
      </div>

      {/* 4. Bottom Action Bar: 왼쪽 주문 취소(빨간색), 오른쪽 상태 변경 드롭다운 + 저장 */}
      <OrderBottomActionBar
        currentStatus={order.status}
        onCancelOrder={handleCancelOrder}
        onStatusSave={handleStatusSave}
      />
    </div>
  );
}

