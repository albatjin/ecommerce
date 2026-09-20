export interface ProductProps {
  id: string;
  productCode: string;
  name: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  safetyStock: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';
}

export class Product {
  readonly id: string;
  readonly productCode: string;
  readonly name: string;
  readonly regularPrice: number;
  readonly salePrice: number;
  readonly stockQuantity: number;
  readonly safetyStock: number;
  readonly status: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';

  constructor(props: ProductProps) {
    if (props.regularPrice < 0 || props.salePrice < 0) {
      throw new Error('가격은 0원 이상이어야 합니다.');
    }
    if (props.stockQuantity < 0) {
      throw new Error('재고는 0개 이상이어야 합니다.');
    }

    this.id = props.id;
    this.productCode = props.productCode;
    this.name = props.name;
    this.regularPrice = props.regularPrice;
    this.salePrice = props.salePrice;
    this.stockQuantity = props.stockQuantity;
    this.safetyStock = props.safetyStock;
    this.status = props.status;
  }

  get discountRate(): number {
    if (this.regularPrice <= 0) return 0;
    const rate = ((this.regularPrice - this.salePrice) / this.regularPrice) * 100;
    return Math.max(0, Math.round(rate));
  }

  get isLowStock(): boolean {
    return this.stockQuantity <= this.safetyStock && this.stockQuantity > 0;
  }

  get isSoldOut(): boolean {
    return this.stockQuantity === 0 || this.status === 'OUT_OF_STOCK';
  }
}

