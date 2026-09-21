import { IStoreSettingsRepository } from '../../domain/repositories/store-settings.repository';
import { StoreSettings } from '../../domain/entities/store-settings';

export class GetStoreSettingsUseCase {
  constructor(private readonly settingsRepository: IStoreSettingsRepository) {}

  async execute(): Promise<StoreSettings> {
    return this.settingsRepository.getSettings();
  }
}

