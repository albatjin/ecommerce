import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Header } from '../header';

describe('Header Component (Integration Test)', () => {
  it('검색 입력창, 스토어 선택기, 관리자 정보 및 알림을 올바르게 렌더링한다', () => {
    render(
      <Header
        userEmail="admin@commercehub.co.kr"
        adminName="김운영"
        logoutAction={vi.fn()}
      />
    );

    // 검색창
    expect(
      screen.getByPlaceholderText('상품명, 주문번호, 고객명 검색...')
    ).toBeInTheDocument();

    // 스토어 선택
    expect(screen.getByText('공식 온라인 스토어')).toBeInTheDocument();

    // 관리자 프로필 정보
    expect(screen.getByText('김운영')).toBeInTheDocument();
    expect(screen.getByText('admin@commercehub.co.kr')).toBeInTheDocument();

    // 알림 카운트
    expect(screen.getByText('3')).toBeInTheDocument();

    // 쇼핑몰 바로가기 링크
    const mallLink = screen.getByRole('link', { name: /쇼핑몰 바로가기/i });
    expect(mallLink).toBeInTheDocument();
    expect(mallLink).toHaveAttribute('href', '/');

    // 로그아웃 버튼
    expect(screen.getByTitle('로그아웃')).toBeInTheDocument();
  });
});

