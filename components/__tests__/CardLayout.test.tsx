import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CardLayout } from '../CardLayout';
import { ahmad } from '@/data/cards/ahmad';
import { ahmadFm } from '@/data/cards/ahmad-fm';

describe('CardLayout', () => {
  it('renders Luxury layout for template=lux (white background)', () => {
    const { container } = render(<CardLayout card={ahmad} url="https://x/ahmad" />);
    expect(container.querySelector('.bg-white')).toBeTruthy();
  });
  it('renders Force layout for template=force (wine background)', () => {
    const { container } = render(<CardLayout card={ahmadFm} url="https://x/ahmad-fm" />);
    expect(container.querySelector('.bg-wine')).toBeTruthy();
  });
});
