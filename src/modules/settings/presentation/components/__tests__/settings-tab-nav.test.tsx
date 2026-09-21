import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsTabNav, SettingsTab } from '../settings-tab-nav';

describe('SettingsTabNav Component', () => {
  it('renders all 4 tabs correctly', () => {
    render(<SettingsTabNav activeTab="store_info" onTabChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /스토어 정보/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /알림 설정/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /팀 관리/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /결제/i })).toBeInTheDocument();
  });

  it('calls onTabChange when clicking another tab', () => {
    const handleTabChange = vi.fn();
    render(<SettingsTabNav activeTab="store_info" onTabChange={handleTabChange} />);

    fireEvent.click(screen.getByRole('button', { name: /알림 설정/i }));
    expect(handleTabChange).toHaveBeenCalledWith('notifications');

    fireEvent.click(screen.getByRole('button', { name: /결제/i }));
    expect(handleTabChange).toHaveBeenCalledWith('payments');
  });
});

