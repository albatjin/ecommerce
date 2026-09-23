import { ProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { StoreProductDto, toStoreProductDto } from '../dto/store-product.dto';

export class GetStoreProductDetailUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<StoreProductDto | null> {
    if (!this.productRepository.getProductById) {
      const result = await this.productRepository.getProducts({ page: 1, pageSize: 500 });
      const found = result.products.find((p) => p.id === id);
      if (!found || found.status === 'HIDDEN' || found.status === 'DRAFT') return null;
      return toStoreProductDto(found);
    }

    const product = await this.productRepository.getProductById(id);
    if (!product) return null;

    // 비공개 상품(숨김, 임시저장)은 고객에게 노출하지 않음
    if (product.status === 'HIDDEN' || product.status === 'DRAFT') {
      return null;
    }

    return toStoreProductDto(product);
  }
}
