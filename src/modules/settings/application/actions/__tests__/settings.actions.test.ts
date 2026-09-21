import { describe, it, expect, vi } from 'vitest';
import { updateStoreSettingsAction } from '../settings.actions';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(undefined),
}));

describe('updateStoreSettingsAction', () => {
  it('successfully updates store settings and returns data', async () => {
    const result = await updateStoreSettingsAction({
      storeName: '액션 테스트 스토어',
      currency: 'KRW',
      lowStockThreshold: 15,
      isTaxIncluded: true,
      emailAlertEnabled: true,
      slackAlertEnabled: false,
    });

    expect(result.success).toBe(true);
    expect(result.data?.storeName).toBe('액션 테스트 스토어');
  });

  it('returns failure result when validation error occurs', async () => {
    const result = await updateStoreSettingsAction({
      storeName: '',
      currency: 'KRW',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

