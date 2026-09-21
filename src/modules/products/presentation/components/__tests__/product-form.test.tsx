import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ProductFormView } from '../product-form/product-form-view';

describe('ProductFormView (Presentation & Integration Test)', () => {
  it('상단 타이틀 "상품 등록/수정"과 취소/저장 버튼을 올바르게 렌더링한다', () => {
    render(<ProductFormView onCancel={vi.fn()} onSubmit={vi.fn()} />);

    // 상단 제목
    expect(screen.getByRole('heading', { name: '상품 등록/수정' })).toBeInTheDocument();

    // 취소 버튼
    const cancelButtons = screen.getAllByRole('button', { name: /취소/i });
    expect(cancelButtons.length).toBeGreaterThanOrEqual(1);

    // 저장 버튼
    const saveButtons = screen.getAllByRole('button', { name: /저장|등록/i });
    expect(saveButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('기본 정보 섹션의 모든 필수 필드를 렌더링한다 (상품명, 설명, 카테고리, 가격, 재고)', () => {
    render(<ProductFormView onCancel={vi.fn()} onSubmit={vi.fn()} />);

    // 기본 정보 라벨 및 입력 요소
    const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
    expect(nameInput).toBeInTheDocument();
    expect(screen.getByLabelText(/카테고리/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/정상 판매가|가격/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/재고 수량|현재 가용재고|재고/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/상품 스펙|설명|서술해주세요/i)).toBeInTheDocument();
  });

  it('이미지 섹션의 드래그 앤 드롭 업로드 영역 및 이미지 미리보기/삭제를 제공한다', async () => {
    render(<ProductFormView onCancel={vi.fn()} onSubmit={vi.fn()} />);

    // 드래그 앤 드롭 업로드 텍스트 또는 파일 입력 존재
    expect(screen.getByText(/드래그 앤 드롭/i)).toBeInTheDocument();

    // 파일 업로드 시뮬레이션
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput, { target: { files: [file] } });

    // 미리보기 확인 및 삭제 버튼 작동
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /삭제|제거/i });
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('AI 도우미 섹션의 "AI로 상품 설명 생성" 및 "SEO 태그 추천" 버튼이 정상 작동한다', async () => {
    render(<ProductFormView onCancel={vi.fn()} onSubmit={vi.fn()} />);

    const aiDescBtn = screen.getByRole('button', { name: /AI로 상품 설명 생성/i });
    const aiSeoBtn = screen.getByRole('button', { name: /SEO 태그 추천/i });

    expect(aiDescBtn).toBeInTheDocument();
    expect(aiSeoBtn).toBeInTheDocument();

    // 상품명 입력
    const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
    fireEvent.change(nameInput, { target: { value: '호주산 메리노 울 블레이저' } });

    // AI 설명 생성 클릭
    fireEvent.click(aiDescBtn);

    const descTextarea = screen.getByPlaceholderText(/상품 스펙|설명|서술해주세요/i) as HTMLTextAreaElement;
    await waitFor(() => {
      expect(descTextarea.value.length).toBeGreaterThan(0);
    });

    // SEO 태그 추천 클릭
    fireEvent.click(aiSeoBtn);
    await waitFor(() => {
      expect(screen.getByText('#블레이저')).toBeInTheDocument();
    });
  });

  it('상품명이 비어있는 채 저장 시도 시 유효성 검사 에러 메시지를 표시한다', async () => {
    const handleSubmit = vi.fn();
    render(<ProductFormView onCancel={vi.fn()} onSubmit={handleSubmit} />);

    // 저장 버튼 클릭
    const saveButton = screen.getByRole('button', { name: '최종 상품 등록 완료' });
    fireEvent.click(saveButton);

    expect(handleSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument();
    });
  });

  it('유효한 데이터 입력 후 저장 클릭 시 onSubmit 콜백을 호출한다', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(true);
    render(<ProductFormView onCancel={vi.fn()} onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
    const priceInput = screen.getByLabelText(/정상 판매가|가격/i);
    const stockInput = screen.getByLabelText(/재고 수량|현재 가용재고|재고/i);

    fireEvent.change(nameInput, { target: { value: '테스트 상품 등록' } });
    fireEvent.change(priceInput, { target: { value: '150000' } });
    fireEvent.change(stockInput, { target: { value: '25' } });

    const saveButton = screen.getAllByRole('button', { name: /최종 상품 등록 완료|저장|상품 등록하기/i })[0];
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('대분류 선택에 따라 중분류 및 소분류 옵션과 값이 동적으로 연동되어 변경된다', () => {
    render(<ProductFormView onCancel={vi.fn()} onSubmit={vi.fn()} />);

    const mainCategorySelect = screen.getByLabelText('카테고리') as HTMLSelectElement;
    const subCategorySelect = screen.getByLabelText('중분류') as HTMLSelectElement;
    const detailCategorySelect = screen.getByLabelText('소분류') as HTMLSelectElement;

    // 초기값 확인: 의류
    expect(mainCategorySelect.value).toBe('의류');
    expect(subCategorySelect.value).toBe('남성 아우터');
    expect(detailCategorySelect.value).toBe('미니멀 테일러드 재킷');

    // 대분류를 '전자제품'으로 변경
    fireEvent.change(mainCategorySelect, { target: { value: '전자제품' } });
    expect(subCategorySelect.value).toBe('컴퓨터/노트북');
    expect(detailCategorySelect.value).toBe('울트라 슬림 노트북');
    expect(screen.getByRole('option', { name: /중분류: 컴퓨터\/노트북/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /소분류: 울트라 슬림 16인치 노트북/i })).toBeInTheDocument();

    // 중분류를 '음향가전'으로 변경
    fireEvent.change(subCategorySelect, { target: { value: '음향가전' } });
    expect(detailCategorySelect.value).toBe('노이즈캔슬링 헤드폰');
    expect(screen.getByRole('option', { name: /소분류: 무선 노이즈캔슬링 헤드폰/i })).toBeInTheDocument();

    // 대분류를 '식품'으로 변경
    fireEvent.change(mainCategorySelect, { target: { value: '식품' } });
    expect(subCategorySelect.value).toBe('신선식품');
    expect(detailCategorySelect.value).toBe('유기농 꿀사과');
    expect(screen.getByRole('option', { name: /중분류: 신선식품/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /소분류: 청송 프리미엄 GAP 꿀사과/i })).toBeInTheDocument();
  });

  describe('TanStack Form & Zod 유효성 검사 (TDD)', () => {
    it('저장 버튼 클릭 시 필수 및 형식 오류가 있는 각 인풋별로 에러 메시지를 표시한다', async () => {
      const handleSubmit = vi.fn();
      render(<ProductFormView onCancel={vi.fn()} onSubmit={handleSubmit} />);

      // 상품명을 비우고, 가격을 0으로 입력하고, 할인율을 150%로 입력
      const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
      const priceInput = screen.getByLabelText(/정상 판매가|가격/i);
      const discountInput = screen.getByLabelText(/할인 프로모션/i);

      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(priceInput, { target: { value: '0' } });
      fireEvent.change(discountInput, { target: { value: '150' } });

      const saveButton = screen.getByRole('button', { name: '최종 상품 등록 완료' });
      fireEvent.click(saveButton);

      expect(handleSubmit).not.toHaveBeenCalled();

      // 인풋별 오류 메시지 확인
      await waitFor(() => {
        expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument();
        expect(screen.getByText(/정상 판매가를 입력해주세요/i)).toBeInTheDocument();
        expect(screen.getByText(/할인율은 0%에서 99% 사이/i)).toBeInTheDocument();
      });
    });

    it('상단 헤더의 "상품 등록하기" 버튼 클릭 시에도 인풋별 유효성 검사가 트리거된다', async () => {
      const handleSubmit = vi.fn();
      render(<ProductFormView onCancel={vi.fn()} onSubmit={handleSubmit} />);

      const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
      fireEvent.change(nameInput, { target: { value: '' } });

      const headerSaveButton = screen.getByRole('button', { name: '상품 등록하기' });
      fireEvent.click(headerSaveButton);

      expect(handleSubmit).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it('인풋 오류 발생 후 올바른 값을 입력하고 저장하면 onSubmit이 호출된다', async () => {
      const handleSubmit = vi.fn().mockResolvedValue(true);
      render(<ProductFormView onCancel={vi.fn()} onSubmit={handleSubmit} />);

      const nameInput = screen.getByLabelText(/상품명 \(국문\)/i);
      const priceInput = screen.getByLabelText(/정상 판매가|가격/i);
      const discountInput = screen.getByLabelText(/할인 프로모션/i);
      const stockInput = screen.getByLabelText(/재고 수량|현재 가용재고|재고/i);

      // 먼저 잘못된 값으로 저장 시도
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(priceInput, { target: { value: '0' } });
      const saveButton = screen.getByRole('button', { name: '최종 상품 등록 완료' });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument();
        expect(screen.getByText(/정상 판매가를 입력해주세요/i)).toBeInTheDocument();
      });

      // 올바른 값 입력
      fireEvent.change(nameInput, { target: { value: '올바른 프리미엄 코트' } });
      fireEvent.change(priceInput, { target: { value: '250000' } });
      fireEvent.change(discountInput, { target: { value: '10' } });
      fireEvent.change(stockInput, { target: { value: '50' } });

      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '올바른 프리미엄 코트',
            regularPrice: 250000,
            discountRate: 10,
            salePrice: 225000,
            stockQuantity: 50,
          })
        );
      });
    });
  });
});

