import { describe, it, expect, vi } from 'vitest';
import { SupabaseStoreSettingsRepository } from '../supabase-store-settings.repository';

describe('SupabaseStoreSettingsRepository', () => {
  it('should return default settings when no supabase client is provided or table is empty', async () => {
    const repository = new SupabaseStoreSettingsRepository();
    const settings = await repository.getSettings();

    expect(settings).toBeDefined();
    expect(settings.storeName).toBe('CommerceHub 공식스토어');
    expect(settings.currency).toBe('KRW');
    expect(settings.lowStockThreshold).toBe(10);
    expect(settings.emailAlertEnabled).toBe(true);
    expect(settings.slackAlertEnabled).toBe(false);
  });

  it('should update settings successfully in fallback mode', async () => {
    const repository = new SupabaseStoreSettingsRepository();
    const updated = await repository.updateSettings({
      storeName: '새로운 샵',
      currency: 'USD',
      lowStockThreshold: 20,
      emailAlertEnabled: false,
      slackAlertEnabled: true,
      slackWebhookUrl: 'https://hooks.slack.com/xxx',
    });

    expect(updated.storeName).toBe('새로운 샵');
    expect(updated.currency).toBe('USD');
    expect(updated.lowStockThreshold).toBe(20);
    expect(updated.emailAlertEnabled).toBe(false);
    expect(updated.slackAlertEnabled).toBe(true);
    expect(updated.slackWebhookUrl).toBe('https://hooks.slack.com/xxx');

    // Subsequent getSettings should reflect the update
    const reloaded = await repository.getSettings();
    expect(reloaded.storeName).toBe('새로운 샵');
    expect(reloaded.currency).toBe('USD');
  });

  it('should interact with supabase client when provided', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: 'default',
            store_name: 'DB 스토어',
            logo_header_url: '/db-logo.png',
            currency: 'KRW',
            is_tax_included: true,
            low_stock_threshold: 12,
            email_alert_enabled: true,
            slack_alert_enabled: false,
          },
          error: null,
        }),
      }),
    });

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: mockSelect,
      }),
    };

    const repository = new SupabaseStoreSettingsRepository(mockSupabase as any);
    const settings = await repository.getSettings();

    expect(mockSupabase.from).toHaveBeenCalledWith('store_settings');
    expect(settings.storeName).toBe('DB 스토어');
    expect(settings.lowStockThreshold).toBe(12);
  });

  it('should update settings with supabase client', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'default',
            store_name: '클라이언트 갱신 스토어',
            currency: 'EUR',
            low_stock_threshold: 8,
            email_alert_enabled: false,
            slack_alert_enabled: true,
          },
          error: null,
        }),
      }),
    });

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        upsert: mockUpsert,
      }),
    };

    const repository = new SupabaseStoreSettingsRepository(mockSupabase as any);
    const updated = await repository.updateSettings({
      storeName: '클라이언트 갱신 스토어',
      currency: 'EUR',
      lowStockThreshold: 8,
      emailAlertEnabled: false,
      slackAlertEnabled: true,
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('store_settings');
    expect(updated.storeName).toBe('클라이언트 갱신 스토어');
    expect(updated.currency).toBe('EUR');
  });

  it('should fallback gracefully when supabase returns an error', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => {
        throw new Error('DB Connection Error');
      }),
    };

    const repository = new SupabaseStoreSettingsRepository(mockSupabase as any);
    const settings = await repository.getSettings();
    expect(settings).toBeDefined();

    const updated = await repository.updateSettings({ storeName: 'Fallback Test' });
    expect(updated.storeName).toBe('Fallback Test');
  });
});

