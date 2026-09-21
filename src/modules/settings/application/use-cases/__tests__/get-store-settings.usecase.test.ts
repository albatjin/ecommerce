import { describe, it, expect, vi } from 'vitest';
import { GetStoreSettingsUseCase } from '../get-store-settings.usecase';
import { IStoreSettingsRepository } from '../../../domain/repositories/store-settings.repository';
import { StoreSettings } from '../../../domain/entities/store-settings';

describe('GetStoreSettingsUseCase', () => {
  it('should return store settings from repository', async () => {
    const mockSettings: StoreSettings = {
      id: 'default',
      storeName: '테스트 스토어',
      logoUrl: '/logo.png',
      currency: 'KRW',
      isTaxIncluded: true,
      lowStockThreshold: 10,
      emailAlertEnabled: true,
      slackAlertEnabled: false,
    };

    const mockRepo: IStoreSettingsRepository = {
      getSettings: vi.fn().mockResolvedValue(mockSettings),
      updateSettings: vi.fn(),
    };

    const useCase = new GetStoreSettingsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(mockRepo.getSettings).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockSettings);
  });
});

