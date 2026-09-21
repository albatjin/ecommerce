import { SupabaseClient } from '@supabase/supabase-js';
import { IStoreSettingsRepository } from '../domain/repositories/store-settings.repository';
import {
  StoreSettings,
  createDefaultStoreSettings,
} from '../domain/entities/store-settings';
import { UpdateStoreSettingsInput } from '../application/dto/store-settings.dto';

let fallbackSettings: StoreSettings = createDefaultStoreSettings();

export class SupabaseStoreSettingsRepository implements IStoreSettingsRepository {
  constructor(private readonly supabase?: SupabaseClient) {}

  async getSettings(): Promise<StoreSettings> {
    if (!this.supabase) {
      return { ...fallbackSettings };
    }

    try {
      const { data, error } = await this.supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error || !data) {
        return { ...fallbackSettings };
      }

      return {
        id: data.id || 'default',
        storeName: data.store_name || fallbackSettings.storeName,
        logoUrl: data.logo_header_url || fallbackSettings.logoUrl,
        currency: (data.currency as any) || fallbackSettings.currency,
        isTaxIncluded: data.is_tax_included ?? fallbackSettings.isTaxIncluded,
        lowStockThreshold: data.low_stock_threshold ?? fallbackSettings.lowStockThreshold,
        emailAlertEnabled: data.email_alert_enabled ?? fallbackSettings.emailAlertEnabled,
        slackAlertEnabled: data.slack_alert_enabled ?? fallbackSettings.slackAlertEnabled,
        slackWebhookUrl: data.slack_webhook_url ?? fallbackSettings.slackWebhookUrl,
        updatedAt: data.updated_at,
      };
    } catch {
      return { ...fallbackSettings };
    }
  }

  async updateSettings(input: UpdateStoreSettingsInput): Promise<StoreSettings> {
    fallbackSettings = {
      ...fallbackSettings,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    if (!this.supabase) {
      return { ...fallbackSettings };
    }

    try {
      const dbPayload: Record<string, any> = {};
      if (input.storeName !== undefined) dbPayload.store_name = input.storeName;
      if (input.logoUrl !== undefined) dbPayload.logo_header_url = input.logoUrl;
      if (input.currency !== undefined) dbPayload.currency = input.currency;
      if (input.isTaxIncluded !== undefined) dbPayload.is_tax_included = input.isTaxIncluded;
      if (input.lowStockThreshold !== undefined) dbPayload.low_stock_threshold = input.lowStockThreshold;
      if (input.emailAlertEnabled !== undefined) dbPayload.email_alert_enabled = input.emailAlertEnabled;
      if (input.slackAlertEnabled !== undefined) dbPayload.slack_alert_enabled = input.slackAlertEnabled;
      if (input.slackWebhookUrl !== undefined) dbPayload.slack_webhook_url = input.slackWebhookUrl;

      const { data, error } = await this.supabase
        .from('store_settings')
        .upsert({
          id: 'default',
          ...dbPayload,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !data) {
        return { ...fallbackSettings };
      }

      return {
        id: data.id || 'default',
        storeName: data.store_name || fallbackSettings.storeName,
        logoUrl: data.logo_header_url || fallbackSettings.logoUrl,
        currency: (data.currency as any) || fallbackSettings.currency,
        isTaxIncluded: data.is_tax_included ?? fallbackSettings.isTaxIncluded,
        lowStockThreshold: data.low_stock_threshold ?? fallbackSettings.lowStockThreshold,
        emailAlertEnabled: data.email_alert_enabled ?? fallbackSettings.emailAlertEnabled,
        slackAlertEnabled: data.slack_alert_enabled ?? fallbackSettings.slackAlertEnabled,
        slackWebhookUrl: data.slack_webhook_url ?? fallbackSettings.slackWebhookUrl,
        updatedAt: data.updated_at,
      };
    } catch {
      return { ...fallbackSettings };
    }
  }
}

