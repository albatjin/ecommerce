import { describe, it, expect } from 'vitest';
import {
  createDefaultStoreSettings,
  validateStoreSettings,
  StoreSettings,
} from '../store-settings';

describe('StoreSettings Domain Entity', () => {
  it('should create default store settings with valid default values', () => {
    const settings = createDefaultStoreSettings();

    expect(settings.storeName).toBe('CommerceHub 공식스토어');
    expect(settings.currency).toBe('KRW');
    expect(settings.isTaxIncluded).toBe(true);
    expect(settings.lowStockThreshold).toBe(10);
    expect(settings.emailAlertEnabled).toBe(true);
    expect(settings.slackAlertEnabled).toBe(false);
    expect(settings.logoUrl).toBeDefined();
  });

  it('should pass validation for valid store settings', () => {
    const validSettings: StoreSettings = {
      id: 'default',
      storeName: '새로운 쇼핑몰',
      logoUrl: '/logo.png',
      currency: 'KRW',
      isTaxIncluded: false,
      lowStockThreshold: 15,
      emailAlertEnabled: true,
      slackAlertEnabled: true,
      slackWebhookUrl: 'https://hooks.slack.com/services/xxx',
    };

    const result = validateStoreSettings(validSettings);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation if storeName is empty', () => {
    const invalidSettings: StoreSettings = {
      ...createDefaultStoreSettings(),
      storeName: '',
    };

    const result = validateStoreSettings(invalidSettings);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('스토어명은 필수 입력 항목입니다.');
  });

  it('should fail validation if lowStockThreshold is negative', () => {
    const invalidSettings: StoreSettings = {
      ...createDefaultStoreSettings(),
      lowStockThreshold: -5,
    };

    const result = validateStoreSettings(invalidSettings);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('재고 부족 기준은 0 이상의 정수여야 합니다.');
  });

  it('should fail validation if currency is invalid', () => {
    const invalidSettings = {
      ...createDefaultStoreSettings(),
      currency: 'INVALID' as any,
    };

    const result = validateStoreSettings(invalidSettings);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('지원하지 않는 통화 형식입니다.');
  });
});

