'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, CreditCard, CheckCircle2, ChevronRight, Check } from 'lucide-react';

export type OrderStep = 1 | 2 | 3;

interface OrderStepperProps {
  currentStep: OrderStep;
}

interface StepItem {
  step: OrderStep;
  title: string;
  subtitle: string;
  href?: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  {
    step: 1,
    title: '장바구니',
    subtitle: '상품 확인 및 수량 조절',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    step: 2,
    title: '주문 / 결제',
    subtitle: '배송지 입력 및 결제 수단',
    href: '/checkout',
    icon: CreditCard,
  },
  {
    step: 3,
    title: '주문 완료',
    subtitle: '주문 접수 및 내역 확인',
    icon: CheckCircle2,
  },
];

export function OrderStepper({ currentStep }: OrderStepperProps) {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-4 sm:py-5 mb-6 sm:mb-8 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative">
          {STEPS.map((item, index) => {
            const isCompleted = item.step < currentStep;
            const isActive = item.step === currentStep;
            const isUpcoming = item.step > currentStep;
            const IconComponent = item.icon;

            const isClickable = item.href && (isCompleted || isActive);

            const content = (
              <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
                {/* 원형 스텝 번호 / 아이콘 */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-600/30 scale-105'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* 스텝 텍스트 정보 */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'text-emerald-600'
                          : isActive
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    >
                      STEP 0{item.step}
                    </span>
                    {isActive && (
                      <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                    )}
                  </div>
                  <h3
                    className={`text-xs sm:text-sm font-extrabold tracking-tight transition-colors ${
                      isActive
                        ? 'text-gray-900 font-black'
                        : isCompleted
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="hidden md:block text-[11px] text-gray-400">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );

            return (
              <React.Fragment key={item.step}>
                {/* 스텝 요소 */}
                <div className="flex-1 flex justify-center first:justify-start last:justify-end">
                  {isClickable ? (
                    <Link
                      href={item.href!}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div>{content}</div>
                  )}
                </div>

                {/* 스텝 사이 연결 화살표 / 바 (마지막 스텝 제외) */}
                {index < STEPS.length - 1 && (
                  <div className="flex items-center px-1 sm:px-4 shrink-0">
                    <div
                      className={`h-0.5 w-6 sm:w-16 md:w-24 transition-colors duration-300 ${
                        item.step < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                      }`}
                    />
                    <ChevronRight
                      className={`w-3.5 h-3.5 -ml-1 transition-colors ${
                        item.step < currentStep ? 'text-emerald-500' : 'text-gray-300'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

