import { StoreSettings } from '../entities/store-settings';
import { UpdateStoreSettingsInput } from '../../application/dto/store-settings.dto';

export interface IStoreSettingsRepository {
  getSettings(): Promise<StoreSettings>;
  updateSettings(input: UpdateStoreSettingsInput): Promise<StoreSettings>;
}

