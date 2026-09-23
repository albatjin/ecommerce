import React from 'react';
import { GuestTrackingView } from '@/modules/storefront/presentation/components/guest-tracking-view';

export const metadata = {
  title: '주문 / 배송 조회 | CommerceHub',
  description: '주문번호와 연락처로 실시간 배송 상태 조회',
};

export default function GuestTrackPage() {
  return <GuestTrackingView />;
}

