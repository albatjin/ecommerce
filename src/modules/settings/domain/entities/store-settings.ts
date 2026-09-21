export type Currency = 'KRW' | 'USD' | 'EUR' | 'JPY';

export interface StoreSettings {
  id: string;
  storeName: string;
  logoUrl: string;
  currency: Currency;
  isTaxIncluded: boolean;
  lowStockThreshold: number;
  emailAlertEnabled: boolean;
  slackAlertEnabled: boolean;
  slackWebhookUrl?: string;
  updatedAt?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const ALLOWED_CURRENCIES: Currency[] = ['KRW', 'USD', 'EUR', 'JPY'];

export function createDefaultStoreSettings(): StoreSettings {
  return {
    id: 'default',
    storeName: 'CommerceHub 공식스토어',
    logoUrl: '/store-logo.svg',
    currency: 'KRW',
    isTaxIncluded: true,
    lowStockThreshold: 10,
    emailAlertEnabled: true,
    slackAlertEnabled: false,
    slackWebhookUrl: '',
  };
}

export function validateStoreSettings(settings: Partial<StoreSettings>): ValidationResult {
  const errors: string[] = [];

  if (settings.storeName !== undefined && (!settings.storeName || settings.storeName.trim() === '')) {
    errors.push('스토어명은 필수 입력 항목입니다.');
  }

  if (settings.lowStockThreshold !== undefined) {
    if (!Number.isInteger(settings.lowStockThreshold) || settings.lowStockThreshold < 0) {
      errors.push('재고 부족 기준은 0 이상의 정수여야 합니다.');
    }
  }

  if (settings.currency !== undefined && !ALLOWED_CURRENCIES.includes(settings.currency)) {
    errors.push('지원하지 않는 통화 형식입니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

