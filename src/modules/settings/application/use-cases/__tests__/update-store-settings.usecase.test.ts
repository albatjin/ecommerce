import { describe, it, expect, vi } from 'vitest';
import { UpdateStoreSettingsUseCase } from '../update-store-settings.usecase';
import { IStoreSettingsRepository } from '../../../domain/repositories/store-settings.repository';
import { StoreSettings } from '../../../domain/entities/store-settings';
import { UpdateStoreSettingsInput } from '../../dto/store-settings.dto';

describe('UpdateStoreSettingsUseCase', () => {
  it('should update store settings when input is valid', async () => {
    const initialSettings: StoreSettings = {
      id: 'default',
      storeName: '기존 스토어',
      logoUrl: '/logo.png',
      currency: 'KRW',
      isTaxIncluded: true,
      lowStockThreshold: 10,
      emailAlertEnabled: true,
      slackAlertEnabled: false,
    };

    const updateInput: UpdateStoreSettingsInput = {
      storeName: '수정된 스토어',
      logoUrl: '/new-logo.png',
      currency: 'USD',
      isTaxIncluded: false,
      lowStockThreshold: 5,
      emailAlertEnabled: true,
      slackAlertEnabled: true,
      slackWebhookUrl: 'https://hooks.slack.com/services/xxx',
    };

    const updatedSettings: StoreSettings = {
      ...initialSettings,
      ...updateInput,
    };

    const mockRepo: IStoreSettingsRepository = {
      getSettings: vi.fn().mockResolvedValue(initialSettings),
      updateSettings: vi.fn().mockResolvedValue(updatedSettings),
    };

    const useCase = new UpdateStoreSettingsUseCase(mockRepo);
    const result = await useCase.execute(updateInput);

    expect(mockRepo.updateSettings).toHaveBeenCalledWith(updateInput);
    expect(result.storeName).toBe('수정된 스토어');
    expect(result.currency).toBe('USD');
  });

  it('should throw an error when validation fails', async () => {
    const invalidInput: UpdateStoreSettingsInput = {
      storeName: '',
      currency: 'KRW',
      isTaxIncluded: true,
      lowStockThreshold: -1,
      emailAlertEnabled: true,
      slackAlertEnabled: false,
    };

    const mockRepo: IStoreSettingsRepository = {
      getSettings: vi.fn(),
      updateSettings: vi.fn(),
    };

    const useCase = new UpdateStoreSettingsUseCase(mockRepo);

    await expect(useCase.execute(invalidInput)).rejects.toThrow();
    expect(mockRepo.updateSettings).not.toHaveBeenCalled();
  });
});
