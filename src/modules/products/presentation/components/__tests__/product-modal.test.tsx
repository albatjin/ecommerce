import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductModal } from '../product-modal';

describe('ProductModal Component (Unit Test)', () => {
  it('isOpen이 false이면 렌더링되지 않는다', () => {
    const { container } = render(
      <ProductModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('모달 폼의 카테고리, 가격, 재고 변경 및 submit이 올바르게 동작한다', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <ProductModal isOpen={true} onClose={onClose} onSave={onSave} />
    );

    // 상품명 입력
    const nameInput = screen.getByPlaceholderText(/예: 16인치 울트라 슬림 노트북/i);
    fireEvent.change(nameInput, { target: { value: '테스트 상품' } });

    // 카테고리 변경
    const categorySelect = screen.getByDisplayValue('전자제품');
    fireEvent.change(categorySelect, { target: { value: '식품' } });

    // 정가, 판매가, 재고, 안전재고 변경
    const regularPriceInput = screen.getByDisplayValue('50000');
    fireEvent.change(regularPriceInput, { target: { value: '60000' } });

    const salePriceInput = screen.getByDisplayValue('45000');
    fireEvent.change(salePriceInput, { target: { value: '55000' } });

    const stockInput = screen.getByDisplayValue('20');
    fireEvent.change(stockInput, { target: { value: '0' } });

    const safetyStockInput = screen.getByDisplayValue('10');
    fireEvent.change(safetyStockInput, { target: { value: '5' } });

    // 저장 버튼 클릭
    const submitBtn = screen.getByRole('button', { name: /등록 완료/i });
    fireEvent.click(submitBtn);

    expect(onSave).toHaveBeenCalledWith({
      id: undefined,
      name: '테스트 상품',
      category: '식품',
      regularPrice: 60000,
      salePrice: 55000,
      stockQuantity: 0,
      safetyStock: 5,
    });
    expect(onClose).toHaveBeenCalled();
  });
});

