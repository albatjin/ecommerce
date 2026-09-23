import { Product } from '../entities/product';

export interface ProductQueryFilter {
  searchQuery?: string;
  category?: string; // '전체' | '전자제품' | '의류' | '식품' | 기타
  stockStatus?: string; // '전체' | '정상' | '부족' | '품절'
  page?: number;
  pageSize?: number;
}

export interface ProductQueryResult {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductRepository {
  getProducts(filter: ProductQueryFilter): Promise<ProductQueryResult>;
  getProductById?(id: string): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  bulkDeleteProducts(ids: string[]): Promise<boolean>;
  bulkUpdateStatus?(ids: string[], status: string): Promise<boolean>;
  createProduct(product: Product): Promise<Product>;
}

