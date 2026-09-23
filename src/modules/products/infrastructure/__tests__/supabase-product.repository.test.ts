import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseProductRepository, resetInMemoryProducts } from '../supabase-product.repository';

describe('SupabaseProductRepository (Integration/Unit Test)', () => {
  let repository: SupabaseProductRepository;

  beforeEach(() => {
    resetInMemoryProducts();
    // Supabase client mock (에러 발생 시 내장 시드 데이터로 fallback하거나 seed 모드로 동작)
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: null, error: new Error('Offline fallback') }),
        delete: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: new Error('Fallback') }),
          }),
        }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    };

    repository = new SupabaseProductRepository(mockSupabase as any);
  });

  it('기본 상품 목록 10개 이상과 올바른 페이지네이션 정보를 반환한다', async () => {
    const result = await repository.getProducts({ page: 1, pageSize: 10 });

    expect(result.products.length).toBeGreaterThanOrEqual(10);
    expect(result.totalCount).toBeGreaterThanOrEqual(10);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('상품명 검색어(searchQuery)로 필터링할 수 있다', async () => {
    const result = await repository.getProducts({
      searchQuery: '노트북',
      page: 1,
      pageSize: 10,
    });

    expect(result.products.every(p => p.name.includes('노트북'))).toBe(true);
  });

  it('카테고리(category)로 필터링할 수 있다', async () => {
    const result = await repository.getProducts({
      category: '전자제품',
      page: 1,
      pageSize: 10,
    });

    expect(result.products.every(p => p.category === '전자제품')).toBe(true);
  });

  it('재고 상태(stockStatus: 부족, 정상, 품절)로 필터링할 수 있다', async () => {
    const lowResult = await repository.getProducts({
      stockStatus: '부족',
      page: 1,
      pageSize: 10,
    });
    expect(lowResult.products.every(p => p.stockStatus === 'LOW')).toBe(true);

    const normalResult = await repository.getProducts({
      stockStatus: '정상',
      page: 1,
      pageSize: 10,
    });
    expect(normalResult.products.every(p => p.stockStatus === 'NORMAL')).toBe(true);

    const soldOutResult = await repository.getProducts({
      stockStatus: '품절',
      page: 1,
      pageSize: 10,
    });
    expect(soldOutResult.products.every(p => p.stockStatus === 'OUT_OF_STOCK')).toBe(true);
  });

  it('상품코드(productCode)로도 검색할 수 있다', async () => {
    const result = await repository.getProducts({
      searchQuery: 'PROD-10001',
      page: 1,
      pageSize: 10,
    });
    expect(result.products.some(p => p.productCode === 'PROD-10001')).toBe(true);
  });

  it('단일 상품 삭제(deleteProduct)가 정상 동작한다', async () => {
    const all = await repository.getProducts({ page: 1, pageSize: 20 });
    const targetId = all.products[0].id;

    const success = await repository.deleteProduct(targetId);
    expect(success).toBe(true);

    const afterDelete = await repository.getProducts({ page: 1, pageSize: 20 });
    expect(afterDelete.products.some(p => p.id === targetId)).toBe(false);
  });

  it('일괄 상품 삭제(bulkDeleteProducts)가 정상 동작한다', async () => {
    const all = await repository.getProducts({ page: 1, pageSize: 20 });
    const targetIds = [all.products[0].id, all.products[1].id];

    const success = await repository.bulkDeleteProducts(targetIds);
    expect(success).toBe(true);

    const afterDelete = await repository.getProducts({ page: 1, pageSize: 20 });
    expect(afterDelete.products.some(p => targetIds.includes(p.id))).toBe(false);
  });

  it('신규 상품 등록(createProduct)이 정상 동작하고 목록 최상단에 추가된다', async () => {
    const { Product } = await import('../../domain/entities/product');
    const newProduct = new Product({
      id: 'prod-new-test',
      productCode: 'PRD-99999',
      name: '새로운 테스트 등록 상품',
      category: '의류',
      regularPrice: 199000,
      salePrice: 179000,
      stockQuantity: 20,
      safetyStock: 5,
      status: 'ACTIVE',
    });

    const created = await repository.createProduct(newProduct);
    expect(created.name).toBe('새로운 테스트 등록 상품');

    const list = await repository.getProducts({ page: 1, pageSize: 10 });
    expect(list.products[0].id).toBe('prod-new-test');
    expect(list.products[0].name).toBe('새로운 테스트 등록 상품');
  });
});
