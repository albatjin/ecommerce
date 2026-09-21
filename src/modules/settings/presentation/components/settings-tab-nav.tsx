'use client';

import React from 'react';
import { Store, Bell, Users, CreditCard } from 'lucide-react';

export type SettingsTab = 'store_info' | 'notifications' | 'team' | 'payments';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'store_info', label: '스토어 정보', icon: Store },
  { id: 'notifications', label: '알림 설정', icon: Bell },
  { id: 'team', label: '팀 관리', icon: Users },
  { id: 'payments', label: '결제', icon: CreditCard },
];

interface SettingsTabNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabNav({ activeTab, onTabChange }: SettingsTabNavProps) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex space-x-1 sm:space-x-4" aria-label="Tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

