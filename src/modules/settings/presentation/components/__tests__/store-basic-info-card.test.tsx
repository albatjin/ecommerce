import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StoreBasicInfoCard } from '../store-basic-info-card';

describe('StoreBasicInfoCard Component', () => {
  const defaultProps = {
    storeName: 'CommerceHub 공식스토어',
    logoUrl: '/store-logo.svg',
    currency: 'KRW' as const,
    isTaxIncluded: true,
    onStoreNameChange: vi.fn(),
    onLogoChange: vi.fn(),
    onCurrencyChange: vi.fn(),
    onTaxIncludedChange: vi.fn(),
  };

  it('renders store basic info fields correctly', () => {
    render(<StoreBasicInfoCard {...defaultProps} />);

    expect(screen.getByText('스토어 기본 정보')).toBeInTheDocument();
    expect(screen.getByLabelText(/스토어명/i)).toHaveValue('CommerceHub 공식스토어');
    expect(screen.getByLabelText(/통화/i)).toHaveValue('KRW');
    expect(screen.getByText(/세금 포함 가격/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /변경/i })).toBeInTheDocument();
  });

  it('handles input changes and toggles', () => {
    const handleStoreNameChange = vi.fn();
    const handleCurrencyChange = vi.fn();
    const handleTaxIncludedChange = vi.fn();

    render(
      <StoreBasicInfoCard
        {...defaultProps}
        onStoreNameChange={handleStoreNameChange}
        onCurrencyChange={handleCurrencyChange}
        onTaxIncludedChange={handleTaxIncludedChange}
      />
    );

    const nameInput = screen.getByLabelText(/스토어명/i);
    fireEvent.change(nameInput, { target: { value: '테스트 스토어' } });
    expect(handleStoreNameChange).toHaveBeenCalledWith('테스트 스토어');

    const currencySelect = screen.getByLabelText(/통화/i);
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    expect(handleCurrencyChange).toHaveBeenCalledWith('USD');

    const taxToggle = screen.getByRole('switch', { name: /세금 포함 가격/i });
    fireEvent.click(taxToggle);
    expect(handleTaxIncludedChange).toHaveBeenCalledWith(false);
  });

  it('handles logo file input change', () => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-url');
    const handleLogoChange = vi.fn();

    const { container } = render(
      <StoreBasicInfoCard
        {...defaultProps}
        logoUrl=""
        onLogoChange={handleLogoChange}
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'logo.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(handleLogoChange).toHaveBeenCalledWith('blob:http://localhost/mock-url');

    const changeBtn = screen.getByRole('button', { name: /변경/i });
    fireEvent.click(changeBtn);
  });
});

