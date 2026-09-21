import { Currency, StoreSettings } from '../../domain/entities/store-settings';

export interface UpdateStoreSettingsInput {
  storeName?: string;
  logoUrl?: string;
  currency?: Currency;
  isTaxIncluded?: boolean;
  lowStockThreshold?: number;
  emailAlertEnabled?: boolean;
  slackAlertEnabled?: boolean;
  slackWebhookUrl?: string;
}

export type StoreSettingsDTO = StoreSettings;

