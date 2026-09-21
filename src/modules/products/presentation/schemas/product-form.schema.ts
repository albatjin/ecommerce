import { z } from 'zod';

export const productFormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: '상품명을 입력해주세요 (필수 입력 항목입니다).',
    })
    .refine((val) => val.length <= 100, {
      message: '상품명은 100자 이하로 입력해주세요.',
    }),
  nameEn: z.string().max(150, '영문 상품명은 150자 이하로 입력해주세요.').optional().default(''),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  subCategory: z.string().optional().default(''),
  detailCategory: z.string().optional().default(''),
  productCode: z.string().optional().default(''),
  skuCode: z.string().optional().default(''),
  brandName: z.string().optional().default(''),
  regularPrice: z
    .number()
    .min(1, '정상 판매가를 입력해주세요 (1원 이상).'),
  discountRate: z
    .number()
    .min(0, '할인율은 0%에서 99% 사이여야 합니다.')
    .max(99, '할인율은 0%에서 99% 사이여야 합니다.'),
  taxType: z.enum(['TAXABLE', 'TAX_EXEMPT']),
  maxOrderQuantity: z
    .number()
    .min(1, '1회 최대 주문 한도는 1개 이상이어야 합니다.'),
  stockQuantity: z
    .number()
    .min(0, '재고 수량은 0개 이상이어야 합니다.'),
  description: z.string().optional().default(''),
  imageUrl: z.string().optional(),
  additionalImages: z.array(z.string()).optional().default([]),
  seoTags: z.array(z.string()).optional().default([]),
  status: z.enum(['ACTIVE', 'OUT_OF_STOCK', 'HIDDEN', 'DRAFT']).optional().default('ACTIVE'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
