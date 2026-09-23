import { Product } from '@/modules/products/domain/entities/product';

export interface StoreProductDto {
  id: string;
  productCode: string;
  name: string;
  nameEn?: string;
  category: string;
  regularPrice: number;
  salePrice: number;
  discountRate: number;
  stockQuantity: number;
  safetyStock: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';
  stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
  stockStatusLabel: string;
  isSoldOut: boolean;
  isLowStock: boolean;
  imageUrl?: string;
  additionalImages: string[];
  description?: string;
  skuCode?: string;
  brandName?: string;
  taxType: 'TAXABLE' | 'TAX_EXEMPT';
  maxOrderQuantity: number;
  createdAt: string;
}

export function toStoreProductDto(product: Product): StoreProductDto {
  return {
    id: product.id,
    productCode: product.productCode,
    name: product.name,
    nameEn: product.nameEn,
    category: typeof product.category === 'string' ? product.category : '기타',
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,
    discountRate: product.discountRate,
    stockQuantity: product.stockQuantity,
    safetyStock: product.safetyStock,
    status: product.status,
    stockStatus: product.stockStatus,
    stockStatusLabel: product.stockStatusLabel,
    isSoldOut: product.isSoldOut,
    isLowStock: product.isLowStock,
    imageUrl: product.imageUrl,
    additionalImages: product.additionalImages || [],
    description: product.description,
    skuCode: product.skuCode,
    brandName: product.brandName,
    taxType: product.taxType || 'TAXABLE',
    maxOrderQuantity: product.maxOrderQuantity ?? 99,
    createdAt: product.createdAt,
  };
}

