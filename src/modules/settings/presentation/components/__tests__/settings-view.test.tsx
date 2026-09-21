import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsView } from '../settings-view';
import { StoreSettings } from '../../../domain/entities/store-settings';

const initialSettings: StoreSettings = {
  id: 'default',
  storeName: 'CommerceHub 공식스토어',
  logoUrl: '/store-logo.svg',
  currency: 'KRW',
  isTaxIncluded: true,
  lowStockThreshold: 10,
  emailAlertEnabled: true,
  slackAlertEnabled: false,
};

describe('SettingsView Component', () => {
  it('renders settings view with header, tabs, and store info cards by default', () => {
    render(<SettingsView initialSettings={initialSettings} onSaveAction={vi.fn().mockResolvedValue({ success: true })} />);

    expect(screen.getByRole('heading', { level: 1, name: '설정' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /스토어 정보/i })).toBeInTheDocument();
    expect(screen.getByText('스토어 기본 정보')).toBeInTheDocument();
    expect(screen.getByText('재고 알림 설정')).toBeInTheDocument();

    // Check bottom right save button
    const bottomSaveBtn = screen.getByTestId('bottom-save-button');
    expect(bottomSaveBtn).toBeInTheDocument();
    expect(bottomSaveBtn).toHaveTextContent('저장');
  });

  it('switches tabs when tab button is clicked', () => {
    render(<SettingsView initialSettings={initialSettings} onSaveAction={vi.fn().mockResolvedValue({ success: true })} />);

    fireEvent.click(screen.getByRole('button', { name: /알림 설정/i }));
    expect(screen.getByText(/알림 채널 및 발송 설정/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /결제/i }));
    expect(screen.getByText(/PG 연동 및 결제 수단 관리/i)).toBeInTheDocument();
  });

  it('calls onSaveAction and shows success message when bottom save button is clicked', async () => {
    const mockSaveAction = vi.fn().mockResolvedValue({ success: true });
    render(<SettingsView initialSettings={initialSettings} onSaveAction={mockSaveAction} />);

    const storeNameInput = screen.getByLabelText(/스토어명/i);
    fireEvent.change(storeNameInput, { target: { value: '업데이트된 마켓' } });

    const bottomSaveBtn = screen.getByTestId('bottom-save-button');
    fireEvent.click(bottomSaveBtn);

    await waitFor(() => {
      expect(mockSaveAction).toHaveBeenCalledWith(
        expect.objectContaining({
          storeName: '업데이트된 마켓',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/설정이 성공적으로 저장되었습니다/i)).toBeInTheDocument();
    });
  });

  it('handles reset button to restore initial values', () => {
    render(<SettingsView initialSettings={initialSettings} onSaveAction={vi.fn().mockResolvedValue({ success: true })} />);

    const storeNameInput = screen.getByLabelText(/스토어명/i);
    fireEvent.change(storeNameInput, { target: { value: '임시 이름' } });
    expect(storeNameInput).toHaveValue('임시 이름');

    const resetBtn = screen.getByRole('button', { name: /설정 초기화/i });
    fireEvent.click(resetBtn);

    expect(storeNameInput).toHaveValue('CommerceHub 공식스토어');
    expect(screen.getByText(/설정이 초기 상태로 되돌려졌습니다/i)).toBeInTheDocument();
  });

  it('displays error toast when onSaveAction returns an error', async () => {
    const mockSaveAction = vi.fn().mockResolvedValue({ success: false, error: '저장 실패 에러' });
    render(<SettingsView initialSettings={initialSettings} onSaveAction={mockSaveAction} />);

    const bottomSaveBtn = screen.getByTestId('bottom-save-button');
    fireEvent.click(bottomSaveBtn);

    await waitFor(() => {
      expect(screen.getByText('저장 실패 에러')).toBeInTheDocument();
    });
  });

  it('opens and submits Slack integration modal', async () => {
    render(<SettingsView initialSettings={initialSettings} onSaveAction={vi.fn().mockResolvedValue({ success: true })} />);

    const integrateBtn = screen.getByRole('button', { name: /연동하기/i });
    fireEvent.click(integrateBtn);

    expect(screen.getByText('슬랙(Slack) 연동 설정')).toBeInTheDocument();

    const webhookInput = screen.getByLabelText(/수신 웹훅 URL/i);
    fireEvent.change(webhookInput, { target: { value: 'https://hooks.slack.com/services/test' } });

    const submitBtn = screen.getByRole('button', { name: /연동 저장/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('슬랙 웹훅이 연동되었습니다.')).toBeInTheDocument();
    });
  });

  it('renders team management tab when team tab is selected', () => {
    render(<SettingsView initialSettings={initialSettings} onSaveAction={vi.fn().mockResolvedValue({ success: true })} />);

    fireEvent.click(screen.getByRole('button', { name: /팀 관리/i }));
    expect(screen.getByText('팀원 및 관리자 권한')).toBeInTheDocument();
    expect(screen.getByText('팀원 초대')).toBeInTheDocument();
  });
});

