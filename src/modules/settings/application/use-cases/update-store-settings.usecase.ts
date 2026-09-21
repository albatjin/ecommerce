import { IStoreSettingsRepository } from '../../domain/repositories/store-settings.repository';
import { StoreSettings, validateStoreSettings } from '../../domain/entities/store-settings';
import { UpdateStoreSettingsInput } from '../dto/store-settings.dto';

export class UpdateStoreSettingsUseCase {
  constructor(private readonly settingsRepository: IStoreSettingsRepository) {}

  async execute(input: UpdateStoreSettingsInput): Promise<StoreSettings> {
    const validation = validateStoreSettings(input);
    if (!validation.isValid) {
      throw new Error(`설정 유효성 검증 실패: ${validation.errors.join(', ')}`);
    }

    return this.settingsRepository.updateSettings(input);
  }
}

