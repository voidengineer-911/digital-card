import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/lib/locale-context';
import { LocaleToggle } from '../LocaleToggle';

describe('LocaleToggle', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir  = 'ltr';
  });

  it('renders EN active when initial=en', () => {
    render(<LocaleProvider initial="en"><LocaleToggle /></LocaleProvider>);
    expect(screen.getByText('EN')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText('AR')).toHaveAttribute('data-active', 'false');
  });
  it('switches to AR on click and updates <html dir/lang>', () => {
    render(<LocaleProvider initial="en"><LocaleToggle /></LocaleProvider>);
    fireEvent.click(screen.getByText('AR'));
    expect(screen.getByText('AR')).toHaveAttribute('data-active', 'true');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
