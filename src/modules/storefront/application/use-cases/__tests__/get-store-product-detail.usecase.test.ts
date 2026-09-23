import { describe, it, expect, vi } from 'vitest';
import { GetStoreProductDetailUseCase } from '../get-store-product-detail.usecase';
import { Product } from '@/modules/products/domain/entities/product';
import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';

describe('GetStoreProductDetailUseCase', () => {
  const activeProduct = new Product({
    id: 'prod-01',
    productCode: 'P-1',
    name: '공개 상품',
    category: '전자제품',
    regularPrice: 10000,
    salePrice: 9000,
    stockQuantity: 10,
    safetyStock: 2,
    status: 'ACTIVE',
  });

  const hiddenProduct = new Product({
    id: 'prod-02',
    productCode: 'P-2',
    name: '숨김 상품',
    category: '전자제품',
    regularPrice: 10000,
    salePrice: 9000,
    stockQuantity: 10,
    safetyStock: 2,
    status: 'HIDDEN',
  });

  it('ACTIVE 상품은 정상적으로 반환된다', async () => {
    const mockRepo: ProductRepository = {
      getProducts: vi.fn(),
      getProductById: vi.fn().mockResolvedValue(activeProduct),
      deleteProduct: vi.fn(),
      bulkDeleteProducts: vi.fn(),
      createProduct: vi.fn(),
    };

    const useCase = new GetStoreProductDetailUseCase(mockRepo);
    const result = await useCase.execute('prod-01');

    expect(result).not.toBeNull();
    expect(result?.id).toBe('prod-01');
  });

  it('HIDDEN 또는 DRAFT 상품은 null을 반환한다', async () => {
    const mockRepo: ProductRepository = {
      getProducts: vi.fn(),
      getProductById: vi.fn().mockResolvedValue(hiddenProduct),
      deleteProduct: vi.fn(),
      bulkDeleteProducts: vi.fn(),
      createProduct: vi.fn(),
    };

    const useCase = new GetStoreProductDetailUseCase(mockRepo);
    const result = await useCase.execute('prod-02');

    expect(result).toBeNull();
  });
});

