import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SlackModal } from '../slack-modal';

describe('SlackModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SlackModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly and submits input url when isOpen is true', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <SlackModal
        isOpen={true}
        initialWebhookUrl="https://hooks.slack.com/services/111"
        onClose={handleClose}
        onSave={handleSave}
      />
    );

    const input = screen.getByLabelText(/수신 웹훅 URL/i);
    expect(input).toHaveValue('https://hooks.slack.com/services/111');

    fireEvent.change(input, { target: { value: 'https://hooks.slack.com/services/222' } });

    const submitBtn = screen.getByRole('button', { name: /연동 저장/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith('https://hooks.slack.com/services/222');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when close or cancel button is clicked', () => {
    const handleClose = vi.fn();

    render(<SlackModal isOpen={true} onClose={handleClose} onSave={vi.fn()} />);

    const cancelBtn = screen.getByRole('button', { name: /취소/i });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

