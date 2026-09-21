import { ProductRepository, ProductQueryFilter } from '@/modules/products/domain/repositories/product.repository';
import { ProductListResultDto, ProductDto } from '../dto/product.dto';
import { Product } from '@/modules/products/domain/entities/product';

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(filter: ProductQueryFilter = {}): Promise<ProductListResultDto> {
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 10;

    const result = await this.productRepository.getProducts({
      searchQuery: filter.searchQuery,
      category: filter.category,
      stockStatus: filter.stockStatus,
      page,
      pageSize,
    });

    return {
      products: result.products.map(this.toDto),
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  private toDto(product: Product): ProductDto {
    return {
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      category: product.category,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      stockQuantity: product.stockQuantity,
      safetyStock: product.safetyStock,
      status: product.status,
      stockStatus: product.stockStatus,
      stockStatusLabel: product.stockStatusLabel,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
    };
  }
}
