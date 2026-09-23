import { describe, it, expect, vi } from 'vitest';
import { GetStoreProductsUseCase } from '../get-store-products.usecase';
import { Product } from '@/modules/products/domain/entities/product';
import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';

describe('GetStoreProductsUseCase', () => {
  const mockProducts = [
    new Product({
      id: 'prod-01',
      productCode: 'P-1',
      name: '울트라 노트북',
      category: '전자제품',
      regularPrice: 2000000,
      salePrice: 1600000, // 20%
      stockQuantity: 10,
      safetyStock: 5,
      status: 'ACTIVE',
      createdAt: '2025-01-01',
    }),
    new Product({
      id: 'prod-02',
      productCode: 'P-2',
      name: '무선 헤드폰',
      category: '전자제품',
      regularPrice: 300000,
      salePrice: 210000, // 30%
      stockQuantity: 2,
      safetyStock: 5,
      status: 'ACTIVE',
      createdAt: '2025-01-02',
    }),
    new Product({
      id: 'prod-03',
      productCode: 'P-3',
      name: '숨김 상품',
      category: '전자제품',
      regularPrice: 100000,
      salePrice: 100000,
      stockQuantity: 5,
      safetyStock: 2,
      status: 'HIDDEN',
      createdAt: '2025-01-03',
    }),
    new Product({
      id: 'prod-04',
      productCode: 'P-4',
      name: '작성중 초안 상품',
      category: '의류',
      regularPrice: 50000,
      salePrice: 50000,
      stockQuantity: 0,
      safetyStock: 0,
      status: 'DRAFT',
      createdAt: '2025-01-04',
    }),
  ];

  const mockRepo: ProductRepository = {
    getProducts: vi.fn().mockResolvedValue({
      products: mockProducts,
      totalCount: 4,
      page: 1,
      pageSize: 500,
      totalPages: 1,
    }),
    getProductById: vi.fn(),
    deleteProduct: vi.fn(),
    bulkDeleteProducts: vi.fn(),
    createProduct: vi.fn(),
  };

  it('HIDDEN 및 DRAFT 상태 상품은 제외하고 공개 상품만 반환한다', async () => {
    const useCase = new GetStoreProductsUseCase(mockRepo);
    const result = await useCase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products.map((p) => p.id)).toEqual(['prod-02', 'prod-01']); // latest순
  });

  it('카테고리 필터링이 올바르게 적용된다', async () => {
    const useCase = new GetStoreProductsUseCase(mockRepo);
    const result = await useCase.execute({ category: '전자제품' });

    expect(result.products.every((p) => p.category === '전자제품')).toBe(true);
  });

  it('할인율순(discount) 정렬 시 할인율이 높은 상품이 우선 노출된다', async () => {
    const useCase = new GetStoreProductsUseCase(mockRepo);
    const result = await useCase.execute({ sort: 'discount' });

    // prod-02 (30%), prod-01 (20%)
    expect(result.products[0].id).toBe('prod-02');
    expect(result.products[1].id).toBe('prod-01');
  });

  it('가격 오름차순(price_asc) 정렬 시 저렴한 상품이 우선 노출된다', async () => {
    const useCase = new GetStoreProductsUseCase(mockRepo);
    const result = await useCase.execute({ sort: 'price_asc' });

    expect(result.products[0].salePrice).toBe(210000);
    expect(result.products[1].salePrice).toBe(1600000);
  });
});

