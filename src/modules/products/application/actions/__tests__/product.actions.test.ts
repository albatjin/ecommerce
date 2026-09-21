import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductAction } from '../product.actions';

vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Fallback') }),
    }),
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('product.actions (Unit Test)', () => {
  it('상품 등록 액션 호출 시 성공 응답을 반환한다', async () => {
    const result = await createProductAction({
      name: '새로운 액션 테스트 상품',
      category: '전자제품',
      regularPrice: 200000,
      stockQuantity: 10,
    });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('새로운 액션 테스트 상품');
  });

  it('필수값(상품명) 누락 시 실패 에러 응답을 반환한다', async () => {
    const result = await createProductAction({
      name: '',
      category: '전자제품',
      regularPrice: 200000,
      stockQuantity: 10,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('상품명은 필수 입력 항목입니다.');
  });
});

