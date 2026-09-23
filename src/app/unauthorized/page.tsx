import React from 'react';
import { UnauthorizedView } from '@/modules/auth/presentation/components/unauthorized-view';

interface UnauthorizedPageProps {
  searchParams: Promise<{ from?: string }>;
}

export const metadata = {
  title: '접근 권한 없음 (403 Forbidden) - FRONT Store',
  description: '해당 페이지에 접근할 수 있는 권한이 없습니다.',
};

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const resolvedSearchParams = await searchParams;
  const targetPath = resolvedSearchParams.from;

  return <UnauthorizedView targetPath={targetPath} />;
}

