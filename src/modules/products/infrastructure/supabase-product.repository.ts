import { ProductRepository, ProductQueryFilter, ProductQueryResult } from '../domain/repositories/product.repository';
import { Product } from '../domain/entities/product';
import { SupabaseClient } from '@supabase/supabase-js';

export const SEED_PRODUCTS: Product[] = [
  new Product({
    id: 'prod-01',
    productCode: 'PROD-10001',
    name: '울트라 슬림 16인치 노트북',
    category: '전자제품',
    regularPrice: 1890000,
    salePrice: 1690000,
    stockQuantity: 4,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-05',
  }),
  new Product({
    id: 'prod-02',
    productCode: 'PROD-10002',
    name: '무선 노이즈캔슬링 프리미엄 헤드폰',
    category: '전자제품',
    regularPrice: 380000,
    salePrice: 329000,
    stockQuantity: 28,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-08',
  }),
  new Product({
    id: 'prod-03',
    productCode: 'PROD-10003',
    name: '기계식 무접점 게이밍 키보드',
    category: '전자제품',
    regularPrice: 175000,
    salePrice: 149000,
    stockQuantity: 2,
    safetyStock: 5,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-11',
  }),
  new Product({
    id: 'prod-04',
    productCode: 'PROD-10004',
    name: '27인치 4K UHD 고화질 모니터',
    category: '전자제품',
    regularPrice: 450000,
    salePrice: 399000,
    stockQuantity: 0,
    safetyStock: 5,
    status: 'OUT_OF_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-14',
  }),
  new Product({
    id: 'prod-05',
    productCode: 'PROD-20001',
    name: '프리미엄 캐시미어 블렌드 싱글 코트',
    category: '의류',
    regularPrice: 289000,
    salePrice: 249000,
    stockQuantity: 18,
    safetyStock: 8,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-15',
  }),
  new Product({
    id: 'prod-06',
    productCode: 'PROD-20002',
    name: '헤비웨이트 베이직 오버사이즈 후드티',
    category: '의류',
    regularPrice: 69000,
    salePrice: 52000,
    stockQuantity: 3,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-18',
  }),
  new Product({
    id: 'prod-07',
    productCode: 'PROD-20003',
    name: '클래식 테이퍼드 핏 데님 팬츠',
    category: '의류',
    regularPrice: 89000,
    salePrice: 79000,
    stockQuantity: 35,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-20',
  }),
  new Product({
    id: 'prod-08',
    productCode: 'PROD-20004',
    name: '메리노 울 니트 크루넥 가디건',
    category: '의류',
    regularPrice: 119000,
    salePrice: 99000,
    stockQuantity: 0,
    safetyStock: 5,
    status: 'OUT_OF_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-22',
  }),
  new Product({
    id: 'prod-09',
    productCode: 'PROD-30001',
    name: '청송 프리미엄 GAP 유기농 꿀사과 5kg',
    category: '식품',
    regularPrice: 42000,
    salePrice: 36000,
    stockQuantity: 65,
    safetyStock: 15,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-25',
  }),
  new Product({
    id: 'prod-10',
    productCode: 'PROD-30002',
    name: '1++ 등급 한우 안심 스테이크 세트 600g',
    category: '식품',
    regularPrice: 110000,
    salePrice: 95000,
    stockQuantity: 5,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-01-28',
  }),
  new Product({
    id: 'prod-11',
    productCode: 'PROD-30003',
    name: '스페셜티 에티오피아 싱글오리진 원두 500g',
    category: '식품',
    regularPrice: 28000,
    salePrice: 24000,
    stockQuantity: 42,
    safetyStock: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-02-01',
  }),
  new Product({
    id: 'prod-12',
    productCode: 'PROD-30004',
    name: '제주 수제 프리미엄 감귤 한과 세트',
    category: '식품',
    regularPrice: 35000,
    salePrice: 29000,
    stockQuantity: 0,
    safetyStock: 10,
    status: 'OUT_OF_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=120&auto=format&fit=crop&q=60',
    createdAt: '2025-02-05',
  }),
];

export let inMemoryProducts: Product[] = [...SEED_PRODUCTS];

export function resetInMemoryProducts(): void {
  inMemoryProducts = [...SEED_PRODUCTS];
}

export class SupabaseProductRepository implements ProductRepository {
  get localProducts(): Product[] {
    return inMemoryProducts;
  }
  set localProducts(products: Product[]) {
    inMemoryProducts = products;
  }

  constructor(private readonly supabase: SupabaseClient) {}

  async getProducts(filter: ProductQueryFilter): Promise<ProductQueryResult> {
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 10;

    try {
      let query = this.supabase
        .from('products')
        .select(`
          id,
          product_code,
          name_ko,
          regular_price,
          sale_price,
          stock_quantity,
          safety_stock,
          status,
          cover_image_url,
          created_at,
          category:categories ( name )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filter.searchQuery) {
        query = query.ilike('name_ko', `%${filter.searchQuery}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await query.range(from, to);

      if (error || !data || data.length === 0) {
        return this.filterInMemory(filter, page, pageSize);
      }

      const products = data.map((item: any) => {
        const categoryName = (item.category as any)?.name || '기타';
        return new Product({
          id: item.id,
          productCode: item.product_code,
          name: item.name_ko,
          regularPrice: Number(item.regular_price),
          salePrice: Number(item.sale_price),
          stockQuantity: Number(item.stock_quantity),
          safetyStock: Number(item.safety_stock),
          status: item.status,
          category: categoryName,
          imageUrl: item.cover_image_url,
          createdAt: item.created_at ? item.created_at.split('T')[0] : undefined,
        });
      });

      // Merge any pending in-memory created products that are not yet in Supabase
      const supabaseIds = new Set(products.map((p) => p.id));
      const supabaseCodes = new Set(products.map((p) => p.productCode));
      const pendingLocal = inMemoryProducts.filter(
        (p) => !supabaseIds.has(p.id) && !supabaseCodes.has(p.productCode) && !SEED_PRODUCTS.some((s) => s.id === p.id)
      );

      const allMerged = [...pendingLocal, ...products];
      const totalCount = (count ?? products.length) + pendingLocal.length;

      return {
        products: allMerged,
        totalCount,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      };
    } catch {
      return this.filterInMemory(filter, page, pageSize);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.supabase.from('products').delete().eq('id', id);
    } catch {
      // ignore
    }
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
    return true;
  }

  async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    try {
      await this.supabase.from('products').delete().in('id', ids);
    } catch {
      // ignore
    }
    inMemoryProducts = inMemoryProducts.filter((p) => !ids.includes(p.id));
    return true;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          category:categories ( name )
        `)
        .or(`id.eq.${id},product_code.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        const categoryName = (data.category as any)?.name || '기타';
        return new Product({
          id: data.id,
          productCode: data.product_code,
          name: data.name_ko,
          nameEn: data.name_en,
          category: categoryName,
          regularPrice: Number(data.regular_price),
          salePrice: Number(data.sale_price),
          stockQuantity: Number(data.stock_quantity),
          safetyStock: Number(data.safety_stock),
          status: data.status,
          imageUrl: data.cover_image_url,
          additionalImages: data.additional_images,
          description: data.description,
          skuCode: data.sku_code,
          brandName: data.brand_name,
          taxType: data.tax_type,
          maxOrderQuantity: data.max_order_quantity,
          createdAt: data.created_at ? data.created_at.split('T')[0] : undefined,
        });
      }
    } catch {
      // ignore
    }

    const found = inMemoryProducts.find((p) => p.id === id || p.productCode === id);
    return found || null;
  }

  async createProduct(product: Product): Promise<Product> {
    try {
      let categoryId: string | null = null;
      if (product.category) {
        try {
          const { data: cat } = await this.supabase
            .from('categories')
            .select('id')
            .eq('name', product.category)
            .maybeSingle();
          if (cat) categoryId = cat.id;
        } catch {
          // ignore category lookup error
        }
      }

      const { data, error } = await this.supabase
        .from('products')
        .insert({
          product_code: product.productCode,
          name_ko: product.name,
          name_en: product.nameEn,
          category_id: categoryId,
          regular_price: product.regularPrice,
          sale_price: product.salePrice,
          stock_quantity: product.stockQuantity,
          safety_stock: product.safetyStock,
          status: product.status,
          cover_image_url: product.imageUrl,
          additional_images: product.additionalImages,
          description: product.description,
          sku_code: product.skuCode,
          brand_name: product.brandName,
          tax_type: product.taxType,
          max_order_quantity: product.maxOrderQuantity,
        })
        .select(`
          *,
          category:categories ( name )
        `)
        .single();

      if (!error && data) {
        const categoryName = (data.category as any)?.name || product.category || '기타';
        const createdProduct = new Product({
          id: data.id,
          productCode: data.product_code,
          name: data.name_ko,
          nameEn: data.name_en,
          category: categoryName,
          regularPrice: Number(data.regular_price),
          salePrice: Number(data.sale_price),
          stockQuantity: Number(data.stock_quantity),
          safetyStock: Number(data.safety_stock),
          status: data.status,
          imageUrl: data.cover_image_url,
          additionalImages: data.additional_images,
          description: data.description,
          skuCode: data.sku_code,
          brandName: data.brand_name,
          taxType: data.tax_type,
          maxOrderQuantity: data.max_order_quantity,
          createdAt: data.created_at ? data.created_at.split('T')[0] : undefined,
        });
        inMemoryProducts.unshift(createdProduct);
        return createdProduct;
      }

      if (error) {
        console.warn('Supabase createProduct insert error (saved to memory store):', error.message);
      }
    } catch (err) {
      console.warn('Supabase createProduct exception (saved to memory store):', err);
    }

    inMemoryProducts.unshift(product);
    return product;
  }

  private filterInMemory(filter: ProductQueryFilter, page: number, pageSize: number): ProductQueryResult {
    let filtered = [...inMemoryProducts];

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q));
    }

    if (filter.category && filter.category !== '전체') {
      filtered = filtered.filter((p) => p.category === filter.category);
    }

    if (filter.stockStatus && filter.stockStatus !== '전체') {
      if (filter.stockStatus === '정상') {
        filtered = filtered.filter((p) => p.stockStatus === 'NORMAL');
      } else if (filter.stockStatus === '부족') {
        filtered = filtered.filter((p) => p.stockStatus === 'LOW');
      } else if (filter.stockStatus === '품절') {
        filtered = filtered.filter((p) => p.stockStatus === 'OUT_OF_STOCK');
      }
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    return {
      products: paged,
      totalCount,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };
  }
}

