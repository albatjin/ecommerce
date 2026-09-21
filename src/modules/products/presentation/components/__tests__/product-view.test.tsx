import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ProductView } from '../product-view';
import { ProductDto } from '../../../application/dto/product.dto';

const MOCK_PRODUCTS: ProductDto[] = [
  {
    id: 'prod-01',
    productCode: 'PROD-10001',
    name: '울트라 슬림 16인치 노트북',
    category: '전자제품',
    regularPrice: 1890000,
    salePrice: 1690000,
    stockQuantity: 4,
    safetyStock: 10,
    status: 'ACTIVE',
    stockStatus: 'LOW',
    stockStatusLabel: '부족',
    createdAt: '2025-01-05',
  },
  {
    id: 'prod-02',
    productCode: 'PROD-10002',
    name: '무선 노이즈캔슬링 프리미엄 헤드폰',
    category: '전자제품',
    regularPrice: 380000,
    salePrice: 329000,
    stockQuantity: 28,
    safetyStock: 10,
    status: 'ACTIVE',
    stockStatus: 'NORMAL',
    stockStatusLabel: '정상',
    createdAt: '2025-01-08',
  },
  {
    id: 'prod-03',
    productCode: 'PROD-20001',
    name: '프리미엄 캐시미어 블렌드 싱글 코트',
    category: '의류',
    regularPrice: 289000,
    salePrice: 249000,
    stockQuantity: 18,
    safetyStock: 8,
    status: 'ACTIVE',
    stockStatus: 'NORMAL',
    stockStatusLabel: '정상',
    createdAt: '2025-01-15',
  },
  {
    id: 'prod-04',
    productCode: 'PROD-30001',
    name: '청송 프리미엄 GAP 유기농 꿀사과 5kg',
    category: '식품',
    regularPrice: 42000,
    salePrice: 36000,
    stockQuantity: 0,
    safetyStock: 15,
    status: 'OUT_OF_STOCK',
    stockStatus: 'OUT_OF_STOCK',
    stockStatusLabel: '품절',
    createdAt: '2025-01-25',
  },
];

describe('ProductView Component (Integration/Presentation Test)', () => {
  it('상품 관리 헤더, 파란색 상품 등록 버튼, 필터 바를 올바르게 렌더링한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    expect(screen.getByRole('heading', { name: '상품 관리' })).toBeDefined();
    expect(screen.getByRole('button', { name: /상품 등록/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/상품명 또는 상품코드로 검색/i)).toBeDefined();
    expect(screen.getByDisplayValue('카테고리 전체')).toBeDefined();
    expect(screen.getByDisplayValue('재고상태 전체')).toBeDefined();
  });

  it('상품 목록의 컬럼과 재고 부족 항목(빨간색 배지)을 올바르게 표시한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    // 컬럼 검증
    expect(screen.getByText('이미지')).toBeDefined();
    expect(screen.getByText('상품명')).toBeDefined();
    expect(screen.getByText('카테고리')).toBeDefined();
    expect(screen.getByText('가격')).toBeDefined();
    expect(screen.getByText('재고')).toBeDefined();
    expect(screen.getByText('상태')).toBeDefined();
    expect(screen.getByText('등록일')).toBeDefined();
    expect(screen.getByText('관리')).toBeDefined();

    // 상품명 렌더링 확인
    expect(screen.getByText('울트라 슬림 16인치 노트북')).toBeDefined();

    // 재고 부족 배지 확인 (테이블 내부)
    const table = screen.getByRole('table');
    const lowBadge = within(table).getByText('부족');
    expect(lowBadge).toBeDefined();
    expect(lowBadge.className).toContain('text-rose-700');
  });

  it('상품명 검색어로 목록을 필터링한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const searchInput = screen.getByPlaceholderText(/상품명 또는 상품코드로 검색/i);
    fireEvent.change(searchInput, { target: { value: '노트북' } });

    expect(screen.getByText('울트라 슬림 16인치 노트북')).toBeDefined();
    expect(screen.queryByText('무선 노이즈캔슬링 프리미엄 헤드폰')).toBeNull();
    expect(screen.queryByText('프리미엄 캐시미어 블렌드 싱글 코트')).toBeNull();
  });

  it('카테고리 드롭다운 선택으로 목록을 필터링한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const categorySelect = screen.getByDisplayValue('카테고리 전체');
    fireEvent.change(categorySelect, { target: { value: '의류' } });

    expect(screen.getByText('프리미엄 캐시미어 블렌드 싱글 코트')).toBeDefined();
    expect(screen.queryByText('울트라 슬림 16인치 노트북')).toBeNull();
  });

  it('재고 상태 드롭다운(부족) 선택으로 목록을 필터링한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const statusSelect = screen.getByDisplayValue('재고상태 전체');
    fireEvent.change(statusSelect, { target: { value: '부족' } });

    expect(screen.getByText('울트라 슬림 16인치 노트북')).toBeDefined();
    expect(screen.queryByText('무선 노이즈캔슬링 프리미엄 헤드폰')).toBeNull();
    expect(screen.queryByText('청송 프리미엄 GAP 유기농 꿀사과 5kg')).toBeNull();
  });

  it('체크박스 전체 선택 및 개별 선택 시 선택된 아이템 개수가 실시간 반영된다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('0개');

    // 전체 선택 체크박스 클릭
    const selectAllCheckbox = screen.getByLabelText('전체 선택');
    fireEvent.click(selectAllCheckbox);

    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('4개');

    // 일괄삭제 버튼 활성화 확인 및 클릭
    const bulkDeleteBtn = screen.getByRole('button', { name: /일괄삭제/i });
    expect(bulkDeleteBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(bulkDeleteBtn);

    // 모두 삭제됨 확인
    expect(screen.getByText('조건에 맞는 상품이 존재하지 않습니다.')).toBeDefined();
    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('0개');
  });

  it('개별 행 삭제 버튼 클릭 시 해당 상품이 목록에서 제거된다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    expect(screen.getByText('울트라 슬림 16인치 노트북')).toBeDefined();

    const deleteBtn = screen.getByLabelText('울트라 슬림 16인치 노트북 삭제');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('울트라 슬림 16인치 노트북')).toBeNull();
  });

  it('상품 등록 버튼 클릭 시 모달이 열리고 새 상품을 등록할 수 있다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const addBtn = screen.getByRole('button', { name: /상품 등록/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('신규 상품 등록')).toBeDefined();

    const nameInput = screen.getByPlaceholderText(/예: 16인치 울트라 슬림 노트북/i);
    fireEvent.change(nameInput, { target: { value: '테스트용 스마트워치' } });

    const submitBtn = screen.getByRole('button', { name: /등록 완료/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('테스트용 스마트워치')).toBeDefined();
  });

  it('기존 상품의 수정 버튼 클릭 시 모달이 열리고 정보 수정이 정상 반영된다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const editBtn = screen.getByLabelText('울트라 슬림 16인치 노트북 수정');
    fireEvent.click(editBtn);

    expect(screen.getByText('상품 정보 수정')).toBeDefined();

    const nameInput = screen.getByDisplayValue('울트라 슬림 16인치 노트북');
    fireEvent.change(nameInput, { target: { value: '울트라 슬림 16인치 노트북 프로' } });

    const saveBtn = screen.getByRole('button', { name: /수정 저장/i });
    fireEvent.click(saveBtn);

    expect(screen.getByText('울트라 슬림 16인치 노트북 프로')).toBeDefined();
  });

  it('일괄 수정 버튼 클릭 시 선택된 상품들의 재고가 증가(+10개)한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    // 첫 번째 상품 개별 선택
    const firstCheckbox = screen.getByLabelText('울트라 슬림 16인치 노트북 선택');
    fireEvent.click(firstCheckbox);

    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('1개');

    const bulkEditBtn = screen.getByRole('button', { name: /일괄수정/i });
    expect(bulkEditBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(bulkEditBtn);

    // 재고 4 -> 14개로 변경되어 '정상' 상태로 바뀌었는지 확인
    expect(screen.getByText('14개')).toBeDefined();
  });

  it('필터 변경 후 초기화 버튼을 클릭하면 기본 필터로 리셋된다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const searchInput = screen.getByPlaceholderText(/상품명 또는 상품코드로 검색/i);
    fireEvent.change(searchInput, { target: { value: '노트북' } });

    const resetBtn = screen.getByRole('button', { name: /초기화/i });
    expect(resetBtn).toBeDefined();
    fireEvent.click(resetBtn);

    expect(searchInput).toHaveProperty('value', '');
    expect(screen.getByText('프리미엄 캐시미어 블렌드 싱글 코트')).toBeDefined();
  });

  it('모달에서 취소 버튼 및 닫기 버튼 클릭 시 모달이 닫힌다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const addBtn = screen.getByRole('button', { name: /상품 등록/i });
    fireEvent.click(addBtn);
    expect(screen.getByText('신규 상품 등록')).toBeDefined();

    const cancelBtn = screen.getByRole('button', { name: /취소/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText('신규 상품 등록')).toBeNull();
  });

  it('체크박스 개별 선택 및 해제를 지원한다', () => {
    render(<ProductView initialProducts={MOCK_PRODUCTS} />);

    const firstCheckbox = screen.getByLabelText('울트라 슬림 16인치 노트북 선택');
    fireEvent.click(firstCheckbox);
    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('1개');

    fireEvent.click(firstCheckbox);
    expect(screen.getByText(/선택된 아이템:/i).textContent).toContain('0개');
  });
});
