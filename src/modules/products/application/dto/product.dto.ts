export interface ProductDto {
  id: string;
  productCode: string;
  name: string;
  category: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  safetyStock: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';
  stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
  stockStatusLabel: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductListResultDto {
  products: ProductDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProductInputDto {
  name: string;
  nameEn?: string;
  category: string;
  regularPrice: number;
  salePrice?: number;
  discountRate?: number;
  stockQuantity: number;
  safetyStock?: number;
  status?: 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT';
  description?: string;
  imageUrl?: string;
  additionalImages?: string[];
  skuCode?: string;
  brandName?: string;
  taxType?: 'TAXABLE' | 'TAX_EXEMPT';
  maxOrderQuantity?: number;
  seoTags?: string[];
}

export interface ProductAiDescriptionRequestDto {
  productName: string;
  category?: string;
  features?: string[];
}

export interface ProductAiDescriptionResponseDto {
  description: string;
}

export interface ProductAiSeoTagsRequestDto {
  productName: string;
  category?: string;
}

export interface ProductAiSeoTagsResponseDto {
  tags: string[];
}


