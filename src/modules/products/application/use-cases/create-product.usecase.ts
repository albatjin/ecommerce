import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product';
import { CreateProductInputDto, ProductDto } from '../dto/product.dto';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInputDto): Promise<ProductDto> {
    const trimmedName = input.name?.trim();
    if (!trimmedName) {
      throw new Error('상품명은 필수 입력 항목입니다.');
    }

    if (input.regularPrice < 0) {
      throw new Error('가격은 0원 이상이어야 합니다.');
    }

    if (input.stockQuantity < 0) {
      throw new Error('재고는 0개 이상이어야 합니다.');
    }

    const salePrice = input.salePrice !== undefined 
      ? input.salePrice 
      : (input.discountRate !== undefined && input.discountRate > 0)
        ? Math.round(input.regularPrice * (1 - input.discountRate / 100))
        : input.regularPrice;

    if (salePrice < 0) {
      throw new Error('가격은 0원 이상이어야 합니다.');
    }

    // Generate random code if not provided
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    const productCode = `PRD-${datePrefix}-${randomSuffix}`;
    const id = `prod-${Date.now()}-${randomSuffix}`;

    const product = new Product({
      id,
      productCode,
      name: trimmedName,
      nameEn: input.nameEn?.trim(),
      regularPrice: input.regularPrice,
      salePrice,
      stockQuantity: input.stockQuantity,
      safetyStock: input.safetyStock ?? 10,
      status: input.status ?? (input.stockQuantity === 0 ? 'OUT_OF_STOCK' : 'ACTIVE'),
      category: input.category || '기타',
      imageUrl: input.imageUrl,
      additionalImages: input.additionalImages || [],
      description: input.description,
      skuCode: input.skuCode,
      brandName: input.brandName,
      taxType: input.taxType || 'TAXABLE',
      maxOrderQuantity: input.maxOrderQuantity ?? 99,
      seoTags: input.seoTags || [],
    });

    const savedProduct = await this.productRepository.createProduct(product);

    return {
      id: savedProduct.id,
      productCode: savedProduct.productCode,
      name: savedProduct.name,
      category: savedProduct.category,
      regularPrice: savedProduct.regularPrice,
      salePrice: savedProduct.salePrice,
      stockQuantity: savedProduct.stockQuantity,
      safetyStock: savedProduct.safetyStock,
      status: savedProduct.status,
      stockStatus: savedProduct.stockStatus,
      stockStatusLabel: savedProduct.stockStatusLabel,
      imageUrl: savedProduct.imageUrl,
      createdAt: savedProduct.createdAt,
    };
  }
}

