'use client';

import React, { useState } from 'react';
import { SettingsHeader } from './settings-header';
import { SettingsTabNav, SettingsTab } from './settings-tab-nav';
import { StoreBasicInfoCard } from './store-basic-info-card';
import { InventoryAlertCard } from './inventory-alert-card';
import { OtherTabsContent } from './other-tabs-content';
import { SlackModal } from './slack-modal';
import { StoreSettings } from '../../domain/entities/store-settings';
import { UpdateStoreSettingsInput } from '../../application/dto/store-settings.dto';
import { Check, Loader2 } from 'lucide-react';

interface SettingsViewProps {
  initialSettings: StoreSettings;
  onSaveAction?: (input: UpdateStoreSettingsInput) => Promise<{ success: boolean; error?: string }>;
}

export function SettingsView({ initialSettings, onSaveAction }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('store_info');
  const [formData, setFormData] = useState<StoreSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSaveAction) {
        const res = await onSaveAction(formData);
        if (res.success) {
          showToast('설정이 성공적으로 저장되었습니다.');
        } else {
          showToast(res.error || '설정 저장에 실패했습니다.');
        }
      } else {
        showToast('설정이 성공적으로 저장되었습니다.');
      }
    } catch {
      showToast('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialSettings);
    showToast('설정이 초기 상태로 되돌려졌습니다.');
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <SettingsHeader onSave={handleSave} onReset={handleReset} isSaving={isSaving} />

      {/* 4 Tabs Menu */}
      <SettingsTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'store_info' ? (
        <div className="space-y-6">
          {/* Card 1: Store Basic Info */}
          <StoreBasicInfoCard
            storeName={formData.storeName}
            logoUrl={formData.logoUrl}
            currency={formData.currency}
            isTaxIncluded={formData.isTaxIncluded}
            onStoreNameChange={(val) => setFormData((prev) => ({ ...prev, storeName: val }))}
            onLogoChange={(val) => setFormData((prev) => ({ ...prev, logoUrl: val }))}
            onCurrencyChange={(val) => setFormData((prev) => ({ ...prev, currency: val }))}
            onTaxIncludedChange={(val) => setFormData((prev) => ({ ...prev, isTaxIncluded: val }))}
          />

          {/* Card 2: Inventory Alert Settings */}
          <InventoryAlertCard
            lowStockThreshold={formData.lowStockThreshold}
            emailAlertEnabled={formData.emailAlertEnabled}
            slackAlertEnabled={formData.slackAlertEnabled}
            onThresholdChange={(val) => setFormData((prev) => ({ ...prev, lowStockThreshold: val }))}
            onEmailAlertChange={(val) => setFormData((prev) => ({ ...prev, emailAlertEnabled: val }))}
            onSlackAlertChange={(val) => setFormData((prev) => ({ ...prev, slackAlertEnabled: val }))}
            onSlackIntegrateClick={() => setIsSlackModalOpen(true)}
          />

          {/* Bottom Right Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              data-testid="bottom-save-button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>저장</span>
            </button>
          </div>
        </div>
      ) : (
        <OtherTabsContent tab={activeTab} />
      )}

      {/* Slack Integration Modal */}
      <SlackModal
        isOpen={isSlackModalOpen}
        initialWebhookUrl={formData.slackWebhookUrl}
        onClose={() => setIsSlackModalOpen(false)}
        onSave={(url) => {
          setFormData((prev) => ({ ...prev, slackWebhookUrl: url, slackAlertEnabled: true }));
          showToast('슬랙 웹훅이 연동되었습니다.');
        }}
      />
    </div>
  );
}

