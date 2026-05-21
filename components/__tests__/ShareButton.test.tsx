import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButton } from '../ShareButton';

describe('ShareButton', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true, writable: true });
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });
  it('calls navigator.share when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    render(<ShareButton url="https://card.example/ahmad" title="Ahmad Sharaf" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await Promise.resolve();
    expect(share).toHaveBeenCalledWith({ url: 'https://card.example/ahmad', title: 'Ahmad Sharaf' });
  });
  it('falls back to clipboard when share unavailable', async () => {
    render(<ShareButton url="https://card.example/ahmad" title="Ahmad Sharaf" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await Promise.resolve();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://card.example/ahmad');
  });
});
