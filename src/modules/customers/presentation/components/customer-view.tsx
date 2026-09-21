'use client';

import React, { useState, useMemo } from 'react';
import {
  Customer,
  CustomerSummary,
  CustomerGrade,
  CustomerSortOption,
} from '../../domain/entities/customer';
import { CustomerHeader } from './customer-header';
import { CustomerStatsCards } from './customer-stats-cards';
import { CustomerFilterBar } from './customer-filter-bar';
import { CustomerTable } from './customer-table';
import { CustomerPagination } from './customer-pagination';
import { CustomerBottomStats } from './customer-bottom-stats';

interface CustomerViewProps {
  initialCustomers: Customer[];
  stats: CustomerSummary;
}

export function CustomerView({ initialCustomers, stats }: CustomerViewProps) {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<CustomerGrade | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<CustomerSortOption>('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter and Sort Customers
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    // 1. Search Query Filter (name, email, phone, customerNumber)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.customerNumber.toLowerCase().includes(q)
      );
    }

    // 2. Grade Filter
    if (gradeFilter !== 'ALL') {
      result = result.filter((c) => c.membershipGrade === gradeFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
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

    return result;
  }, [customers, searchQuery, gradeFilter, sortBy]);

  // Paginated slice
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedCustomers.slice(start, start + pageSize);
  }, [filteredAndSortedCustomers, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedCustomers.length / pageSize));

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCustomers.map((c) => c.id));
    }
  };

  const handleToggleSelectCustomer = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter Reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setGradeFilter('ALL');
    setSortBy('createdAt_desc');
    setCurrentPage(1);
    setSelectedIds([]);
    showNotification('검색 및 필터 조건이 초기화되었습니다.');
  };

  // Excel CSV Export
  const handleExportExcel = () => {
    const headers = [
      '회원번호',
      '고객명',
      '연락처',
      '이메일',
      '회원등급',
      '누적구매액',
      '총주문수',
      '보유적립금',
      '가입일',
    ];

    const rows = filteredAndSortedCustomers.map((c) => [
      c.customerNumber,
      c.name,
      c.phone,
      c.email,
      c.membershipGrade,
      c.totalSpent,
      c.totalOrders,
      c.rewardPoints,
      c.createdAt.slice(0, 10),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `고객목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('고객 목록 엑셀 파일이 다운로드되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header */}
      <CustomerHeader
        stats={stats}
        onExportExcel={handleExportExcel}
        onBatchMessage={() => showNotification('SMS/알림톡 일괄 발송 창이 준비 중입니다.')}
      />

      {/* 2. Top Stats Cards (4 KPI Cards) */}
      <CustomerStatsCards stats={stats} />

      {/* 3. Filter Bar (Search, Grade tabs, Sort dropdown, Reset) */}
      <CustomerFilterBar
        currentGrade={gradeFilter}
        onGradeChange={(grade) => {
          setGradeFilter(grade);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(sort) => {
          setSortBy(sort);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Customer Table */}
      <CustomerTable
        customers={paginatedCustomers}
        totalCount={filteredAndSortedCustomers.length}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectCustomer={handleToggleSelectCustomer}
        onRewardPointsAction={() =>
          showNotification(
            selectedIds.length > 0
              ? `선택한 ${selectedIds.length}명에게 적립금 지급 모달을 엽니다.`
              : '고객을 먼저 선택해 주세요.'
          )
        }
        onGradeChangeAction={() =>
          showNotification(
            selectedIds.length > 0
              ? `선택한 ${selectedIds.length}명의 등급 변경 모달을 엽니다.`
              : '고객을 먼저 선택해 주세요.'
          )
        }
        onGroupMessageAction={() =>
          showNotification(
            selectedIds.length > 0
              ? `선택한 ${selectedIds.length}명에게 그룹 메시지를 발송합니다.`
              : '고객을 먼저 선택해 주세요.'
          )
        }
      />

      {/* 5. Pagination */}
      <CustomerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={filteredAndSortedCustomers.length}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* 6. Bottom Customer Stats (총원, 신규, VIP) */}
      <CustomerBottomStats stats={stats} />
    </div>
  );
}

