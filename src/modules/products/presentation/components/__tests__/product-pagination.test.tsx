import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductPagination } from '../product-pagination';

describe('ProductPagination Component (Unit Test)', () => {
  it('페이지네이션 번호 및 이전/다음 버튼을 올바르게 렌더링하고 클릭 이벤트를 트리거한다', () => {
    const onPageChange = vi.fn();
    const onBulkEdit = vi.fn();
    const onBulkDelete = vi.fn();

    const { rerender } = render(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        selectedCount={3}
        onPageChange={onPageChange}
        onBulkEdit={onBulkEdit}
        onBulkDelete={onBulkDelete}
      />
    );

    expect(screen.getByText('선택된 아이템:')).toBeDefined();
    expect(screen.getByText('3개')).toBeDefined();

    // 3페이지 클릭
    const page3Btn = screen.getByRole('button', { name: '3' });
    fireEvent.click(page3Btn);
    expect(onPageChange).toHaveBeenCalledWith(3);

    // 이전 버튼 클릭
    const prevBtn = screen.getByLabelText('이전 페이지');
    fireEvent.click(prevBtn);
    expect(onPageChange).toHaveBeenCalledWith(1);

    // 다음 버튼 클릭
    const nextBtn = screen.getByLabelText('다음 페이지');
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(3);

    // 일괄수정 / 일괄삭제 클릭
    const bulkEditBtn = screen.getByRole('button', { name: /일괄수정/i });
    fireEvent.click(bulkEditBtn);
    expect(onBulkEdit).toHaveBeenCalled();

    const bulkDeleteBtn = screen.getByRole('button', { name: /일괄삭제/i });
    fireEvent.click(bulkDeleteBtn);
    expect(onBulkDelete).toHaveBeenCalled();

    // selectedCount === 0일 때 비활성화 확인
    rerender(
      <ProductPagination
        currentPage={1}
        totalPages={1}
        selectedCount={0}
        onPageChange={onPageChange}
        onBulkEdit={onBulkEdit}
        onBulkDelete={onBulkDelete}
      />
    );

    const prevDisabled = screen.getByLabelText('이전 페이지');
    expect(prevDisabled.hasAttribute('disabled')).toBe(true);

    const nextDisabled = screen.getByLabelText('다음 페이지');
    expect(nextDisabled.hasAttribute('disabled')).toBe(true);
  });
});

