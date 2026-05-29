// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AppBottomNav } from '../src/components/app/AppBottomNav';

afterEach(() => cleanup());

describe('AppBottomNav', () => {
  it('keeps every tab in a fixed stationary cell while only the inner active pill changes', () => {
    render(<AppBottomNav activeTab="Track" />);

    const nav = screen.getByRole('navigation', { name: /main app navigation/i });
    expect(nav).toHaveClass('fixed', 'bottom-0');

    const trackLink = within(nav).getByRole('link', { name: /track/i });
    expect(trackLink).toHaveClass('h-14', 'w-full', 'px-0');
    expect(trackLink).toHaveAttribute('aria-current', 'page');

    const activePill = trackLink.querySelector('[data-testid="active-tab-pill"]');
    expect(activePill).toBeInTheDocument();
    expect(activePill).toHaveClass('absolute', 'inset-0', 'rounded-2xl');

    for (const label of ['Home', 'Request', 'Services', 'Account']) {
      const link = within(nav).getByRole('link', { name: new RegExp(label, 'i') });
      expect(link).toHaveClass('h-14', 'w-full', 'px-0');
    }
  });
});
