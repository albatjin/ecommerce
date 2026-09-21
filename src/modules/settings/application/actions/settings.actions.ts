'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseStoreSettingsRepository } from '../../infrastructure/supabase-store-settings.repository';
import { UpdateStoreSettingsUseCase } from '../use-cases/update-store-settings.usecase';
import { UpdateStoreSettingsInput } from '../dto/store-settings.dto';

export async function updateStoreSettingsAction(input: UpdateStoreSettingsInput) {
  try {
    const supabase = await createClient();
    const repository = new SupabaseStoreSettingsRepository(supabase);
    const useCase = new UpdateStoreSettingsUseCase(repository);

    const updated = await useCase.execute(input);
    revalidatePath('/settings');
    return { success: true, data: updated };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '설정 저장 중 오류가 발생했습니다.',
    };
  }
}

