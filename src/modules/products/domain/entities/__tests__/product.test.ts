import { describe, it, expect } from 'vitest';
import { Product } from '../product';

describe('Product Entity (Unit Test)', () => {
  it('정상적인 상품 엔티티를 생성한다', () => {
    const product = new Product({
      id: 'prod-1',
      productCode: 'PROD-10001',
      name: '캐시미어 코트',
      regularPrice: 200000,
      salePrice: 160000,
      stockQuantity: 15,
      safetyStock: 10,
      status: 'ACTIVE',
    });

    expect(product.id).toBe('prod-1');
    expect(product.productCode).toBe('PROD-10001');
    expect(product.name).toBe('캐시미어 코트');
    expect(product.regularPrice).toBe(200000);
    expect(product.salePrice).toBe(160000);
  });

  it('할인율을 올바르게 계산한다', () => {
    const product = new Product({
      id: 'prod-1',
      productCode: 'PROD-10001',
      name: '캐시미어 코트',
      regularPrice: 200000,
      salePrice: 150000,
      stockQuantity: 15,
      safetyStock: 10,
      status: 'ACTIVE',
    });

    // 200,000 -> 150,000 = 25%
    expect(product.discountRate).toBe(25);
  });

  it('정상 가격이 0원 이하일 때 할인율은 0을 반환한다', () => {
    const product = new Product({
      id: 'prod-1',
      productCode: 'PROD-10001',
      name: '무료 이벤트 상품',
      regularPrice: 0,
      salePrice: 0,
      stockQuantity: 10,
      safetyStock: 5,
      status: 'ACTIVE',
    });

    expect(product.discountRate).toBe(0);
  });

  it('재고가 안전재고 이하이고 0보다 크면 재고부족(isLowStock) 상태이다', () => {
    const lowStockProduct = new Product({
      id: 'prod-2',
      productCode: 'PROD-10002',
      name: '인기 가디건',
      regularPrice: 80000,
      salePrice: 80000,
      stockQuantity: 5,
      safetyStock: 10,
      status: 'ACTIVE',
    });

    expect(lowStockProduct.isLowStock).toBe(true);
    expect(lowStockProduct.isSoldOut).toBe(false);
  });

  it('재고가 0개이거나 상태가 OUT_OF_STOCK이면 품절(isSoldOut) 상태이다', () => {
    const soldOutProduct = new Product({
      id: 'prod-3',
      productCode: 'PROD-10003',
      name: '품절된 슈즈',
      regularPrice: 100000,
      salePrice: 100000,
      stockQuantity: 0,
      safetyStock: 10,
      status: 'ACTIVE',
    });

    expect(soldOutProduct.isSoldOut).toBe(true);
    expect(soldOutProduct.isLowStock).toBe(false);
  });

  it('가격 또는 재고가 음수이면 에러를 던진다', () => {
    expect(() => {
      new Product({
        id: 'prod-err',
        productCode: 'PROD-ERR',
        name: '잘못된 상품',
        regularPrice: -100,
        salePrice: 50,
        stockQuantity: 10,
        safetyStock: 5,
        status: 'ACTIVE',
      });
    }).toThrow('가격은 0원 이상이어야 합니다.');

    expect(() => {
      new Product({
        id: 'prod-err-2',
        productCode: 'PROD-ERR',
        name: '잘못된 상품',
        regularPrice: 1000,
        salePrice: 1000,
        stockQuantity: -5,
        safetyStock: 5,
        status: 'ACTIVE',
      });
    }).toThrow('재고는 0개 이상이어야 합니다.');
  });
});

