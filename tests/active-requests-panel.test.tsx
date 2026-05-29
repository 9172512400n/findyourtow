// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActiveRequestsPanel } from '../src/components/platform/ActiveRequestsPanel';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ requests: [] }) }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ActiveRequestsPanel', () => {
  it('renders stacked mobile request cards so long values do not overlap on phones', () => {
    const { container } = render(
      <ActiveRequestsPanel
        fallbackRequests={[
          {
            id: '5DF7DEF9',
            customer: 'Verification Smoke 2',
            service: 'Tow truck',
            status: 'Awaiting Payment',
            total: 14740,
          },
        ]}
      />,
    );

    expect(container.querySelector('[data-testid="active-requests-mobile-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="active-requests-desktop-table"]')).toHaveClass('hidden', 'sm:block');
    expect(screen.getAllByText('Customer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Verification Smoke 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Awaiting Payment').length).toBeGreaterThan(0);
  });
});
