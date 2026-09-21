import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InventoryAlertCard } from '../inventory-alert-card';

describe('InventoryAlertCard Component', () => {
  const defaultProps = {
    lowStockThreshold: 10,
    emailAlertEnabled: true,
    slackAlertEnabled: false,
    onThresholdChange: vi.fn(),
    onEmailAlertChange: vi.fn(),
    onSlackAlertChange: vi.fn(),
    onSlackIntegrateClick: vi.fn(),
  };

  it('renders inventory alert settings correctly with default values', () => {
    render(<InventoryAlertCard {...defaultProps} />);

    expect(screen.getByText('재고 알림 설정')).toBeInTheDocument();
    expect(screen.getByLabelText(/재고 부족 기준/i)).toHaveValue(10);
    expect(screen.getByRole('switch', { name: /이메일 알림/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('switch', { name: /슬랙 알림/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('button', { name: /연동하기/i })).toBeInTheDocument();
  });

  it('triggers callbacks when threshold or toggles are updated', () => {
    const handleThresholdChange = vi.fn();
    const handleEmailAlertChange = vi.fn();
    const handleSlackAlertChange = vi.fn();
    const handleSlackIntegrateClick = vi.fn();

    render(
      <InventoryAlertCard
        {...defaultProps}
        onThresholdChange={handleThresholdChange}
        onEmailAlertChange={handleEmailAlertChange}
        onSlackAlertChange={handleSlackAlertChange}
        onSlackIntegrateClick={handleSlackIntegrateClick}
      />
    );

    const thresholdInput = screen.getByLabelText(/재고 부족 기준/i);
    fireEvent.change(thresholdInput, { target: { value: '25' } });
    expect(handleThresholdChange).toHaveBeenCalledWith(25);

    const emailToggle = screen.getByRole('switch', { name: /이메일 알림/i });
    fireEvent.click(emailToggle);
    expect(handleEmailAlertChange).toHaveBeenCalledWith(false);

    const slackToggle = screen.getByRole('switch', { name: /슬랙 알림/i });
    fireEvent.click(slackToggle);
    expect(handleSlackAlertChange).toHaveBeenCalledWith(true);

    const integrateBtn = screen.getByRole('button', { name: /연동하기/i });
    fireEvent.click(integrateBtn);
    expect(handleSlackIntegrateClick).toHaveBeenCalledTimes(1);
  });
});

