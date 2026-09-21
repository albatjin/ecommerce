export type ProductCategoryType = '전자제품' | '의류' | '식품' | '기타';
export type StockStatusType = 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';

export interface ProductProps {
  id: string;
  productCode: string;
  name: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  safetyStock: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';
  category?: ProductCategoryType | string;
  imageUrl?: string;
  createdAt?: string;
  nameEn?: string;
  description?: string;
  skuCode?: string;
  brandName?: string;
  additionalImages?: string[];
  taxType?: 'TAXABLE' | 'TAX_EXEMPT';
  maxOrderQuantity?: number;
  seoTags?: string[];
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
  readonly category: ProductCategoryType | string;
  readonly imageUrl?: string;
  readonly createdAt: string;
  readonly nameEn?: string;
  readonly description?: string;
  readonly skuCode?: string;
  readonly brandName?: string;
  readonly additionalImages: string[];
  readonly taxType: 'TAXABLE' | 'TAX_EXEMPT';
  readonly maxOrderQuantity: number;
  readonly seoTags: string[];

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
    this.category = props.category || '기타';
    this.imageUrl = props.imageUrl;
    this.createdAt = props.createdAt || new Date().toISOString().split('T')[0];
    this.nameEn = props.nameEn;
    this.description = props.description;
    this.skuCode = props.skuCode;
    this.brandName = props.brandName;
    this.additionalImages = props.additionalImages || [];
    this.taxType = props.taxType || 'TAXABLE';
    this.maxOrderQuantity = props.maxOrderQuantity ?? 99;
    this.seoTags = props.seoTags || [];
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

  get stockStatus(): StockStatusType {
    if (this.isSoldOut) return 'OUT_OF_STOCK';
    if (this.isLowStock) return 'LOW';
    return 'NORMAL';
  }

  get stockStatusLabel(): string {
    switch (this.stockStatus) {
      case 'OUT_OF_STOCK':
        return '품절';
      case 'LOW':
        return '부족';
      case 'NORMAL':
      default:
        return '정상';
    }
  }
}

