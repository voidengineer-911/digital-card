import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QRModal } from '../QRModal';

describe('QRModal', () => {
  it('opens when trigger clicked', () => {
    render(<QRModal url="https://example.com" template="lux" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /qr code/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('closes on Escape', () => {
    render(<QRModal url="https://example.com" template="lux" />);
    fireEvent.click(screen.getByRole('button', { name: /qr code/i }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
