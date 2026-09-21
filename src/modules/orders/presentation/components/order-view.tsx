'use client';

import React, { useState, useMemo } from 'react';
import { OrderDto } from '../../application/dto/order.dto';
import { OrderHeader } from './order-header';
import { OrderFilterBar } from './order-filter-bar';
import { OrderTable } from './order-table';
import { OrderDetailModal } from './order-detail-modal';
import { OrderBottomBanner } from './order-bottom-banner';

interface OrderViewProps {
  initialOrders: OrderDto[];
  pendingProcessingCount?: number;
}

export function OrderView({ initialOrders, pendingProcessingCount = 15 }: OrderViewProps) {
  const [orders] = useState<OrderDto[]>(initialOrders);
  const [currentTab, setCurrentTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  // 탭별 카운트 계산
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      전체: orders.length,
      결제대기: 0,
      결제완료: 0,
      배송중: 0,
      배송완료: 0,
    };
    for (const order of orders) {
      if (counts[order.statusLabel] !== undefined) {
        counts[order.statusLabel]++;
      }
    }
    return counts;
  }, [orders]);

  // 필터링 적용
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. 상태별 탭 필터: 전체 | 결제대기 | 결제완료 | 배송중 | 배송완료
      if (currentTab !== '전체' && order.statusLabel !== currentTab) {
        return false;
      }

      // 2. 검색어 필터: 주문번호 또는 고객명
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchCust = order.customerName.toLowerCase().includes(q);
        if (!matchNum && !matchCust) return false;
      }

      // 3. 날짜 범위 필터 (시작일~종료일)
      if (startDate && order.orderDate.slice(0, 10) < startDate) {
        return false;
      }
      if (endDate && order.orderDate.slice(0, 10) > endDate) {
        return false;
      }

      return true;
    });
  }, [orders, currentTab, searchQuery, startDate, endDate]);

  const handleResetFilters = () => {
    setCurrentTab('전체');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-5">
      {/* 헤더 & 상태 탭 버튼 */}
      <OrderHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tabCounts={tabCounts}
      />

      {/* 검색 & 날짜 범위 필터 */}
      <OrderFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
      />

      {/* 주문 목록 테이블 (8개 행 렌더링, 색상 배지, 클릭 시 상세) */}
      <OrderTable
        orders={filteredOrders}
        onOrderClick={(order) => setSelectedOrder(order)}
      />

      {/* 하단 안내 배너: "오늘 처리해야 할 주문: 15건" */}
      <OrderBottomBanner pendingCount={pendingProcessingCount} />

      {/* 주문 상세 모달 */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

