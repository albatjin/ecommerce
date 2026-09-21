import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProductUseCase } from '../create-product.usecase';
import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { Product } from '@/modules/products/domain/entities/product';
import { CreateProductInputDto } from '../../dto/product.dto';

describe('CreateProductUseCase (Unit Test)', () => {
  let mockRepository: ProductRepository;
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    mockRepository = {
      getProducts: vi.fn(),
      deleteProduct: vi.fn(),
      bulkDeleteProducts: vi.fn(),
      createProduct: vi.fn().mockImplementation(async (prod: Product) => prod),
    };
    useCase = new CreateProductUseCase(mockRepository);
  });

  it('상품명이 비어 있으면 에러를 발생시킨다 (필수값 검증)', async () => {
    const invalidInput: CreateProductInputDto = {
      name: '   ',
      category: '의류',
      regularPrice: 50000,
      stockQuantity: 10,
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow('상품명은 필수 입력 항목입니다.');
  });

  it('가격이 음수이면 에러를 발생시킨다', async () => {
    const invalidInput: CreateProductInputDto = {
      name: '테스트 상품',
      category: '의류',
      regularPrice: -1000,
      stockQuantity: 10,
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow('가격은 0원 이상이어야 합니다.');
  });

  it('재고 수량이 음수이면 에러를 발생시킨다', async () => {
    const invalidInput: CreateProductInputDto = {
      name: '테스트 상품',
      category: '의류',
      regularPrice: 50000,
      stockQuantity: -5,
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow('재고는 0개 이상이어야 합니다.');
  });

  it('유효한 입력값으로 상품을 성공적으로 등록하고 DTO를 반환한다', async () => {
    const validInput: CreateProductInputDto = {
      name: '울 블렌드 프리미엄 싱글 브레스트 블레이저',
      nameEn: 'Wool Blend Premium Single-Breasted Blazer',
      category: '의류',
      regularPrice: 289000,
      salePrice: 245650,
      stockQuantity: 45,
      safetyStock: 10,
      status: 'ACTIVE',
      description: '호주산 메리노 울 블렌드 원단으로 제작된 테일러드 블레이저',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      skuCode: 'JK-WL-089-BLK',
      brandName: 'STUDIO ATELIER',
    };

    const result = await useCase.execute(validInput);

    expect(mockRepository.createProduct).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.productCode).toMatch(/^PRD-/);
    expect(result.name).toBe(validInput.name);
    expect(result.regularPrice).toBe(289000);
    expect(result.salePrice).toBe(245650);
    expect(result.stockQuantity).toBe(45);
    expect(result.stockStatus).toBe('NORMAL');
    expect(result.stockStatusLabel).toBe('정상');
  });

  it('임시저장(DRAFT) 상태로 저장이 가능하다', async () => {
    const draftInput: CreateProductInputDto = {
      name: '작성 중인 신규 상품',
      category: '전자제품',
      regularPrice: 100000,
      stockQuantity: 0,
      status: 'DRAFT',
    };

    const result = await useCase.execute(draftInput);

    expect(result.status).toBe('DRAFT');
    expect(mockRepository.createProduct).toHaveBeenCalled();
  });
});

