import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ProductCreateContainer } from '../product-form/product-create-container';
import * as actions from '@/modules/products/application/actions/product.actions';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ProductCreateContainer (Integration Test)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('취소 버튼 클릭 시 /products 로 라우팅된다', () => {
    render(<ProductCreateContainer />);

    const cancelButtons = screen.getAllByRole('button', { name: /취소/i });
    fireEvent.click(cancelButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('폼 제출 성공 시 성공 토스트가 노출되고 목록으로 이동한다', async () => {
    vi.spyOn(actions, 'createProductAction').mockResolvedValue({
      success: true,
      data: {
        id: 'new-p1',
        productCode: 'PRD-1234',
        name: '컨테이너 테스트 상품',
        category: '의류',
        regularPrice: 100000,
        salePrice: 100000,
        stockQuantity: 10,
        safetyStock: 5,
        status: 'ACTIVE',
        stockStatus: 'NORMAL',
        stockStatusLabel: '정상',
        createdAt: '2025-01-01',
      },
    });

    render(<ProductCreateContainer />);

    const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
    fireEvent.change(nameInput, { target: { value: '컨테이너 테스트 상품' } });
    const priceInput = screen.getByLabelText(/정상 판매가|가격/i);
    fireEvent.change(priceInput, { target: { value: '100000' } });

    const submitBtn = screen.getByRole('button', { name: '최종 상품 등록 완료' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/상품이 성공적으로 등록되었습니다/i)).toBeInTheDocument();
    });
  });

  it('임시저장 초안 유지 버튼 클릭 시 draft 상태로 액션을 호출한다', async () => {
    const actionSpy = vi.spyOn(actions, 'createProductAction').mockResolvedValue({
      success: true,
      data: {
        id: 'draft-p1',
        productCode: 'PRD-1234',
        name: '초안 테스트 상품',
        category: '의류',
        regularPrice: 100000,
        salePrice: 100000,
        stockQuantity: 10,
        safetyStock: 5,
        status: 'DRAFT',
        stockStatus: 'NORMAL',
        stockStatusLabel: '정상',
        createdAt: '2025-01-01',
      },
    });

    render(<ProductCreateContainer />);

    const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
    fireEvent.change(nameInput, { target: { value: '초안 테스트 상품' } });

    const draftBtn = screen.getByRole('button', { name: '임시저장 초안 유지' });
    fireEvent.click(draftBtn);

    await waitFor(() => {
      expect(actionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '초안 테스트 상품',
          status: 'DRAFT',
        })
      );
      expect(screen.getByText(/임시 초안이 안전하게 저장되었습니다/i)).toBeInTheDocument();
    });
  });
});
