import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { StoreProductDto, toStoreProductDto } from '../dto/store-product.dto';

export type StoreProductSortType = 'latest' | 'price_asc' | 'price_desc' | 'discount' | 'popular';

export interface GetStoreProductsQuery {
  category?: string;
  search?: string;
  sort?: StoreProductSortType;
  page?: number;
  pageSize?: number;
}

export interface GetStoreProductsResult {
  products: StoreProductDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: { name: string; count: number }[];
}

export class GetStoreProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: GetStoreProductsQuery = {}): Promise<GetStoreProductsResult> {
    const { category, search, sort = 'latest', page = 1, pageSize = 12 } = query;

    // 1. 전체 상품을 가져온 후 공개 가능한 상품만 필터링
    const rawResult = await this.productRepository.getProducts({
      category: category && category !== '전체' ? category : undefined,
      searchQuery: search,
      page: 1,
      pageSize: 500, // 카테고리별 집계 및 커스텀 정렬을 위해
    });

    // 2. 고객 노출 가능한 상품만 (HIDDEN, DRAFT 제외)
    let publicProducts = rawResult.products.filter(
      (p) => p.status !== 'HIDDEN' && p.status !== 'DRAFT'
    );

    // 3. 카테고리별 상품 수 계산 (전체 공개 상품 기준)
    const categoryCounts: Record<string, number> = {};
    publicProducts.forEach((p) => {
      const cat = p.category || '기타';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // 4. 특정 카테고리 필터링이 있다면 적용
    if (category && category !== '전체') {
      publicProducts = publicProducts.filter((p) => p.category === category);
    }

    // 5. 정렬 적용
    switch (sort) {
      case 'price_asc':
        publicProducts.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price_desc':
        publicProducts.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'discount':
        publicProducts.sort((a, b) => b.discountRate - a.discountRate);
        break;
      case 'popular':
        publicProducts.sort((a, b) => (b.regularPrice - b.salePrice) - (a.regularPrice - a.salePrice));
        break;
      case 'latest':
      default:
        publicProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // 6. 페이지네이션
    const totalCount = publicProducts.length;
    const startIndex = (page - 1) * pageSize;
    const pagedProducts = publicProducts.slice(startIndex, startIndex + pageSize);

    const categories = [
      { name: '전체', count: totalCount },
      ...Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    ];

    return {
      products: pagedProducts.map(toStoreProductDto),
      totalCount,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      categories,
    };
  }
}
