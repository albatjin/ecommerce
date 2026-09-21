import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseStoreSettingsRepository } from '@/modules/settings/infrastructure/supabase-store-settings.repository';
import { GetStoreSettingsUseCase } from '@/modules/settings/application/use-cases/get-store-settings.usecase';
import { SettingsView } from '@/modules/settings/presentation/components/settings-view';
import { updateStoreSettingsAction } from '@/modules/settings/application/actions/settings.actions';

export const metadata = {
  title: 'CommerceHub - 설정',
  description: '공식 온라인스토어의 기본 상점 정보, 알림 및 결제 정책을 통합 관리합니다.',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const repository = new SupabaseStoreSettingsRepository(supabase);
  const getStoreSettings = new GetStoreSettingsUseCase(repository);
  const initialSettings = await getStoreSettings.execute();

  return (
    <SettingsView
      initialSettings={initialSettings}
      onSaveAction={updateStoreSettingsAction}
    />
  );
}

