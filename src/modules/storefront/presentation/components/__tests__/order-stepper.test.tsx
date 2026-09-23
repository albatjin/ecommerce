import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderStepper } from '../order-stepper';

describe('OrderStepper Component', () => {
  it('Step 1 (장바구니)일 때 1단계가 활성화되고 2, 3단계가 대기 상태로 표시된다', () => {
    render(<OrderStepper currentStep={1} />);

    expect(screen.getByText('STEP 01')).toHaveClass('text-blue-600');
    expect(screen.getByText('장바구니')).toHaveClass('text-gray-900 font-black');
    expect(screen.getByText('STEP 02')).toHaveClass('text-gray-400');
    expect(screen.getByText('STEP 03')).toHaveClass('text-gray-400');
  });

  it('Step 2 (주문 / 결제)일 때 1단계가 완료(STEP 01: text-emerald-600)되고 2단계가 활성화된다', () => {
    render(<OrderStepper currentStep={2} />);

    expect(screen.getByText('STEP 01')).toHaveClass('text-emerald-600');
    expect(screen.getByText('STEP 02')).toHaveClass('text-blue-600');
    expect(screen.getByText('주문 / 결제')).toHaveClass('text-gray-900 font-black');
    expect(screen.getByText('STEP 03')).toHaveClass('text-gray-400');
  });

  it('Step 3 (주문 완료)일 때 1, 2단계가 완료되고 3단계가 활성화된다', () => {
    render(<OrderStepper currentStep={3} />);

    expect(screen.getByText('STEP 01')).toHaveClass('text-emerald-600');
    expect(screen.getByText('STEP 02')).toHaveClass('text-emerald-600');
    expect(screen.getByText('STEP 03')).toHaveClass('text-blue-600');
    expect(screen.getByText('주문 완료')).toHaveClass('text-gray-900 font-black');
  });
});

