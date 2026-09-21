import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { OrderStatusStepper } from '../order-status-stepper';

describe('OrderStatusStepper Component', () => {
  it('should render all 5 progress steps in Korean', () => {
    render(
      <OrderStatusStepper
        currentStatus="PREPARING"
        estimatedTime="예상 집하 완료: 오늘 18:30 이전"
        orderDate="2025-05-20 14:18:04"
        paidDate="2025-05-20 14:22:15"
      />
    );

    expect(screen.getByText('배송 진행 현황')).toBeInTheDocument();
    expect(screen.getByText('예상 집하 완료: 오늘 18:30 이전')).toBeInTheDocument();

    // 5 steps
    expect(screen.getByText('결제대기')).toBeInTheDocument();
    expect(screen.getByText('결제완료')).toBeInTheDocument();
    expect(screen.getByText('상품준비')).toBeInTheDocument();
    expect(screen.getByText('배송중')).toBeInTheDocument();
    expect(screen.getByText('배송완료')).toBeInTheDocument();
  });

  it('should highlight steps up to current step (PREPARING is step index 2)', () => {
    const { container } = render(
      <OrderStatusStepper
        currentStatus="PREPARING"
        estimatedTime="예상 집하 완료: 오늘 18:30 이전"
        orderDate="2025-05-20 14:18:04"
        paidDate="2025-05-20 14:22:15"
      />
    );

    // Check step items
    const stepElements = container.querySelectorAll('[data-step-index]');
    expect(stepElements).toHaveLength(5);

    // First 3 steps (index 0, 1, 2) should have active/completed attribute
    expect(stepElements[0]).toHaveAttribute('data-active', 'true');
    expect(stepElements[1]).toHaveAttribute('data-active', 'true');
    expect(stepElements[2]).toHaveAttribute('data-active', 'true');
    expect(stepElements[3]).toHaveAttribute('data-active', 'false');
    expect(stepElements[4]).toHaveAttribute('data-active', 'false');
  });
});

