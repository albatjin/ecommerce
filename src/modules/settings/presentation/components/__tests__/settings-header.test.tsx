import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsHeader } from '../settings-header';

describe('SettingsHeader Component', () => {
  it('renders title and breadcrumb correctly', () => {
    render(<SettingsHeader onSave={vi.fn()} onReset={vi.fn()} isSaving={false} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('설정');
    expect(screen.getByText(/Console/i)).toBeInTheDocument();
    expect(screen.getByText(/STORE CONFIG/i)).toBeInTheDocument();
  });

  it('triggers onSave and onReset when buttons are clicked', () => {
    const handleSave = vi.fn();
    const handleReset = vi.fn();

    render(<SettingsHeader onSave={handleSave} onReset={handleReset} isSaving={false} />);

    const saveButton = screen.getByRole('button', { name: /변경사항 저장|저장/i });
    const resetButton = screen.getByRole('button', { name: /설정 초기화|초기화/i });

    fireEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

