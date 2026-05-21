import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionButton } from '../ActionButton';

describe('ActionButton', () => {
  it('renders label text', () => {
    render(<ActionButton variant="primary" template="lux" label="SAVE TO CONTACTS" href="#" />);
    expect(screen.getByText('SAVE TO CONTACTS')).toBeInTheDocument();
  });
  it('renders as <a> when href provided', () => {
    render(<ActionButton variant="secondary" template="lux" label="Call" href="tel:+96541169141" />);
    const link = screen.getByRole('link', { name: /call/i });
    expect(link).toHaveAttribute('href', 'tel:+96541169141');
  });
  it('renders as <button> when onClick provided', () => {
    render(<ActionButton variant="secondary" template="lux" label="Share" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });
  it('has rounded-pill class', () => {
    const { container } = render(<ActionButton variant="primary" template="lux" label="X" href="#" />);
    expect(container.firstChild).toHaveClass('rounded-pill');
  });
});
