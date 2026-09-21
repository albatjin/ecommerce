'use client';

import React from 'react';
import { Check, CreditCard, PackageCheck, Truck, MapPin } from 'lucide-react';
import { getOrderStepIndex, OrderStatus } from '../../domain/entities/order';

interface OrderStatusStepperProps {
  currentStatus: OrderStatus;
  estimatedTime?: string;
  orderDate?: string;
  paidDate?: string;
}

interface StepItem {
  key: OrderStatus;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function OrderStatusStepper({
  currentStatus,
  estimatedTime = '예상 집하 완료: 오늘 18:30 이전',
  orderDate,
  paidDate,
}: OrderStatusStepperProps) {
  const currentStepIndex = getOrderStepIndex(currentStatus);

  const formattedOrderTime = orderDate ? orderDate.replace(/^2025-/, '').slice(0, 11) : '05/20 14:18';
  const formattedPaidTime = paidDate ? paidDate.replace(/^2025-/, '').slice(0, 11) : '05/20 14:22';

  const steps: StepItem[] = [
    {
      key: 'PAYMENT_PENDING',
      label: '결제대기',
      subLabel: formattedOrderTime,
      icon: Check,
    },
    {
      key: 'PAID',
      label: '결제완료',
      subLabel: formattedPaidTime,
      icon: CreditCard,
    },
    {
      key: 'PREPARING',
      label: '상품준비',
      subLabel: '상품 패킹 중',
      icon: PackageCheck,
    },
    {
      key: 'SHIPPING',
      label: '배송중',
      subLabel: '집하 예정',
      icon: Truck,
    },
    {
      key: 'DELIVERED',
      label: '배송완료',
      subLabel: '예정 05/22',
      icon: MapPin,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 text-sm tracking-tight flex items-center gap-2">
          <span>배송 진행 현황</span>
        </h3>
        {estimatedTime && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50/70 px-3 py-1 rounded-full border border-blue-100">
            {estimatedTime}
          </span>
        )}
      </div>

      {/* 5-Step Stepper */}
      <div className="relative pt-4 pb-2 px-4 sm:px-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isActive = idx <= currentStepIndex;

            // Visual variants
            let circleClass = 'bg-slate-100 text-slate-400 border border-slate-200';
            if (isCurrent) {
              circleClass = 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/20';
            } else if (isPassed) {
              if (idx === 0) circleClass = 'bg-emerald-700 text-white';
              else circleClass = 'bg-teal-700 text-white';
            }

            return (
              <div
                key={step.key}
                data-step-index={idx}
                data-active={isActive ? 'true' : 'false'}
                className="flex-1 flex flex-col items-center relative group"
              >
                {/* Connector Line on Left */}
                {idx > 0 && (
                  <div
                    className={`absolute top-5 right-1/2 w-full h-1 -translate-y-1/2 -z-0 transition-all ${
                      idx <= currentStepIndex ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-all ${circleClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Labels */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'text-blue-600 font-extrabold'
                        : isPassed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-[11px] mt-0.5 tracking-tight font-mono ${
                      isCurrent
                        ? 'text-blue-500 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.subLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

