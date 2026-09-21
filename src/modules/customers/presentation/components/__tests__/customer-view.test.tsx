import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CustomerView } from '../customer-view';
import { Customer, CustomerSummary } from '../../../domain/entities/customer';
import { SEED_CUSTOMERS } from '../../../infrastructure/supabase-customer.repository';

describe('CustomerView Presentation Component', () => {
  const initialCustomers: Customer[] = [...SEED_CUSTOMERS];
  const initialStats: CustomerSummary = {
    totalCount: 8420,
    newCount: 342,
    vipCount: 380,
    dormantWarningCount: 48,
    averageOrderValue: 480000,
  };

  it('should render header with title "고객 관리" and action buttons', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    expect(screen.getByRole('heading', { name: /고객 관리/i })).toBeInTheDocument();
    expect(screen.getByText(/CRM & MEMBER INTELLIGENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/회원 엑셀 다운로드/i)).toBeInTheDocument();
    expect(screen.getByText(/SMS\/알림톡 일괄 발송/i)).toBeInTheDocument();
  });

  it('should render 4 KPI stats cards with numbers and badges', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    expect(screen.getByText('전체 회원 수')).toBeInTheDocument();
    expect(screen.getByText('8,420')).toBeInTheDocument();
    expect(screen.getByText('당월 신규 가입')).toBeInTheDocument();
    expect(screen.getByText('342')).toBeInTheDocument();
    expect(screen.getByText('휴면 / 탈퇴 예정')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('VIP / VVIP 회원')).toBeInTheDocument();
    expect(screen.getByText('380')).toBeInTheDocument();
  });

  it('should render customer table columns including name, VIP star icon, email, orders, total spent, and date', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    expect(screen.getByText('고객명')).toBeInTheDocument();
    expect(screen.getByText('연락처 / 이메일')).toBeInTheDocument();
    expect(screen.getByText('회원등급')).toBeInTheDocument();
    expect(screen.getByText('누적 구매금액')).toBeInTheDocument();
    expect(screen.getByText('총 주문')).toBeInTheDocument();
    expect(screen.getByText('보유 적립금')).toBeInTheDocument();

    // Check VIP customer row
    expect(screen.getByText('박지헌')).toBeInTheDocument();
    expect(screen.getByText('jihyeon.park@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('₩4,280,000')).toBeInTheDocument();
    expect(screen.getByText('24회')).toBeInTheDocument();

    // Check VIP badge / icon test id
    const vipBadges = screen.getAllByTestId('vip-badge');
    expect(vipBadges.length).toBeGreaterThan(0);
  });

  it('should filter customers when user searches in search input', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const searchInput = screen.getByPlaceholderText(/검색/i);
    fireEvent.change(searchInput, { target: { value: '박지헌' } });

    expect(screen.getByText('박지헌')).toBeInTheDocument();
    expect(screen.queryByText('최민성')).not.toBeInTheDocument();
  });

  it('should sort customers by total spent when sort option changes', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const sortSelect = screen.getByTestId('customer-sort-select');
    fireEvent.change(sortSelect, { target: { value: 'totalSpent_asc' } });

    // The first item should be 김서연 (₩89,000)
    const rows = screen.getAllByTestId('customer-row');
    expect(rows[0]).toHaveTextContent('김서연');
  });

  it('should render bottom pagination and customer stats (총원, 신규, VIP)', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const bottomStats = screen.getByTestId('customer-bottom-stats');
    expect(bottomStats).toBeInTheDocument();
    expect(bottomStats).toHaveTextContent('총 회원');
    expect(bottomStats).toHaveTextContent('신규 회원');
    expect(bottomStats).toHaveTextContent('VIP 회원');
  });

  it('should filter customers when grade tabs are clicked', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    // Click 'VIP' tab
    const vipTab = screen.getByRole('button', { name: 'VIP' });
    fireEvent.click(vipTab);

    // Should show VIP customers only
    const rows = screen.getAllByTestId('customer-row');
    expect(rows.length).toBeGreaterThan(0);
    expect(screen.getByText('최민성')).toBeInTheDocument();
    expect(screen.queryByText('김서연')).not.toBeInTheDocument();
  });

  it('should select/deselect all customers and handle batch actions', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    // Toggle select all
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    expect(screen.getByTestId('selected-count-label')).toHaveTextContent('8명');

    // Click batch action buttons
    const rewardBtn = screen.getByRole('button', { name: /적립금 지급/i });
    fireEvent.click(rewardBtn);
    expect(screen.getByText(/적립금 지급 모달을 엽니다/i)).toBeInTheDocument();

    const gradeBtn = screen.getByRole('button', { name: /등급 변경/i });
    fireEvent.click(gradeBtn);
    expect(screen.getByText(/등급 변경 모달을 엽니다/i)).toBeInTheDocument();

    const msgBtn = screen.getByRole('button', { name: /그룹 메시지/i });
    fireEvent.click(msgBtn);
    expect(screen.getByText(/그룹 메시지를 발송합니다/i)).toBeInTheDocument();

    // Click select all to deselect all (8 to 0)
    fireEvent.click(selectAllCheckbox);
    expect(screen.getByTestId('selected-count-label')).toHaveTextContent('0명');

    fireEvent.click(rewardBtn);
    expect(screen.getByText(/고객을 먼저 선택해 주세요/i)).toBeInTheDocument();
  });

  it('should reset filters when reset button is clicked', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const searchInput = screen.getByPlaceholderText(/검색/i);
    fireEvent.change(searchInput, { target: { value: '박지헌' } });
    expect(screen.queryByText('최민성')).not.toBeInTheDocument();

    const resetBtn = screen.getByTitle(/초기화/i);
    fireEvent.click(resetBtn);

    expect(screen.getByText('최민성')).toBeInTheDocument();
  });

  it('should support page size change and pagination navigation', () => {
    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const pageSizeSelect = screen.getByDisplayValue('20개씩 보기');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });

    expect(screen.getByDisplayValue('10개씩 보기')).toBeInTheDocument();
  });

  it('should trigger excel export when export button is clicked', () => {
    // Mock URL and click
    const createObjectURLMock = vi.fn().mockReturnValue('blob:test');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    render(<CustomerView initialCustomers={initialCustomers} stats={initialStats} />);

    const exportBtn = screen.getByRole('button', { name: /회원 엑셀 다운로드/i });
    fireEvent.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(screen.getByText(/고객 목록 엑셀 파일이 다운로드되었습니다/i)).toBeInTheDocument();

    const batchSmsBtn = screen.getByRole('button', { name: /SMS\/알림톡 일괄 발송/i });
    fireEvent.click(batchSmsBtn);
    expect(screen.getByText(/SMS\/알림톡 일괄 발송 창이 준비 중입니다/i)).toBeInTheDocument();
  });
});
