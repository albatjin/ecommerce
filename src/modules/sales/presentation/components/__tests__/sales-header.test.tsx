import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SalesHeader } from '../sales-header';

describe('SalesHeader Component', () => {
  it('should render title "매출 분석", period dropdown/buttons, and export button', () => {
    const handlePeriodChange = vi.fn();
    const handleExport = vi.fn();

    render(
      <SalesHeader
        currentPeriod="this_month"
        onPeriodChange={handlePeriodChange}
        onExport={handleExport}
      />
    );

    // Title
    expect(screen.getByRole('heading', { level: 1, name: /매출 분석/i })).toBeInTheDocument();

    // Period options
    expect(screen.getByText('이번 주')).toBeInTheDocument();
    expect(screen.getByText('이번 달')).toBeInTheDocument();
    expect(screen.getByText('이번 분기')).toBeInTheDocument();

    // Export button
    const exportButton = screen.getByRole('button', { name: /내보내기/i });
    expect(exportButton).toBeInTheDocument();

    // Click actions
    fireEvent.click(screen.getByText('이번 주'));
    expect(handlePeriodChange).toHaveBeenCalledWith('this_week');

    fireEvent.click(exportButton);
    expect(handleExport).toHaveBeenCalled();
  });
});

