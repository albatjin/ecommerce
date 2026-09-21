import { describe, it, expect, vi } from 'vitest';
import { GetProductsUseCase } from '../get-products.usecase';
import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { Product } from '@/modules/products/domain/entities/product';

describe('Product Use Cases (Unit Test)', () => {
  const mockProducts = [
    new Product({
      id: 'prod-1',
      productCode: 'PROD-10001',
      name: '스마트 노이즈캔슬링 헤드폰',
      regularPrice: 350000,
      salePrice: 299000,
      stockQuantity: 45,
      safetyStock: 10,
      status: 'ACTIVE',
      category: '전자제품',
      createdAt: '2025-01-10',
    }),
    new Product({
      id: 'prod-2',
      productCode: 'PROD-10002',
      name: '프리미엄 린넨 셔츠',
      regularPrice: 89000,
      salePrice: 79000,
      stockQuantity: 5,
      safetyStock: 10,
      status: 'ACTIVE',
      category: '의류',
      createdAt: '2025-01-12',
    }),
  ];

  const mockRepo: ProductRepository = {
    getProducts: vi.fn().mockResolvedValue({
      products: mockProducts,
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    }),
    deleteProduct: vi.fn().mockResolvedValue(true),
    bulkDeleteProducts: vi.fn().mockResolvedValue(true),
    createProduct: vi.fn().mockResolvedValue(mockProducts[0]),
  };

  it('GetProductsUseCase는 레포지토리를 호출하여 DTO 형식으로 변환된 결과를 반환한다', async () => {
    const useCase = new GetProductsUseCase(mockRepo);
    const result = await useCase.execute({ page: 1, pageSize: 10 });

    expect(mockRepo.getProducts).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(result.totalCount).toBe(2);
    expect(result.products).toHaveLength(2);
    expect(result.products[0].name).toBe('스마트 노이즈캔슬링 헤드폰');
    expect(result.products[0].stockStatus).toBe('NORMAL');
    expect(result.products[1].stockStatus).toBe('LOW');
    expect(result.products[1].stockStatusLabel).toBe('부족');
  });

  it('기본 필터 파라미터를 적용한다 (page=1, pageSize=10)', async () => {
    const useCase = new GetProductsUseCase(mockRepo);
    await useCase.execute();

    expect(mockRepo.getProducts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      searchQuery: undefined,
      category: undefined,
      stockStatus: undefined,
    });
  });
});
