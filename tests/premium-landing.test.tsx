// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';
import AccountPage from '../app/account/page';
import RequestTowPage from '../app/request/page';
import ServicesPage from '../app/services/page';
import TrackPage from '../app/track/page';
import { useRequestFlowStore } from '../src/features/tow-requests/request-flow-store';

afterEach(() => {
  useRequestFlowStore.getState().reset();
  cleanup();
});

describe('FindYourTow premium mobile homepage', () => {
  it('opens with a calm consumer app homepage instead of stacked pricing cards', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /roadside help in minutes/i })).toBeInTheDocument();
    expect(screen.getByText(/towing, lockouts, jump starts, tire help, fuel delivery, and more/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /findyourtow logo mark/i })).toHaveAttribute(
      'src',
      '/brand/findyourtow-logo-transparent.png',
    );
    expect(screen.getByText('FindYourTow')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /account/i }).some((link) => link.getAttribute('href') === '/account')).toBe(true);
    expect(screen.queryByRole('link', { name: /^start$/i })).not.toBeInTheDocument();

    const helpCard = screen.getByLabelText(/where do you need help/i);
    expect(within(helpCard).getByRole('button', { name: /use current location/i })).toBeInTheDocument();
    expect(within(helpCard).getByPlaceholderText(/enter address or landmark/i)).toBeInTheDocument();
    expect(within(helpCard).getByRole('button', { name: /service tow/i })).toBeInTheDocument();

    const services = screen.getByLabelText(/quick service selector/i);
    for (const service of ['Tow', 'Flatbed', 'Jump', 'Flat Tire', 'Lockout', 'Fuel', 'Winch', 'Battery']) {
      expect(within(services).getByRole('button', { name: new RegExp(service, 'i') })).toBeInTheDocument();
    }

    expect(screen.queryByText(/choose the roadside rescue you need/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fast local towing for cars and small suvs/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$95\.00\+/i)).not.toBeInTheDocument();
  });

  it('keeps the mobile bottom menu stationary and usable while the request sheet is open', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getAllByRole('button', { name: /continue/i })[0]);

    const bottomNav = screen.getByRole('navigation', { name: /main app navigation/i });
    expect(bottomNav).toHaveClass('fixed', 'bottom-0', 'z-[70]');
    expect(within(bottomNav).getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(within(bottomNav).getByRole('link', { name: /request/i })).toHaveAttribute('href', '/request');
    expect(within(bottomNav).getByRole('link', { name: /track/i })).toHaveAttribute('href', '/track');
    expect(within(bottomNav).getByRole('link', { name: /services/i })).toHaveAttribute('href', '/services');
    expect(within(bottomNav).getByRole('link', { name: /account/i })).toHaveAttribute('href', '/account');

    expect(screen.getByLabelText(/request flow sheet area/i)).toHaveClass('pb-[calc(5.75rem+env(safe-area-inset-bottom))]');
  });

  it('opens the request tab directly into the interactive request flow instead of duplicating the home screen', () => {
    render(<RequestTowPage />);

    expect(screen.getByLabelText(/request flow sheet area/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose service/i })).toBeInTheDocument();
    const bottomNav = screen.getByRole('navigation', { name: /main app navigation/i });
    expect(within(bottomNav).getByRole('link', { name: /request/i })).toHaveAttribute('aria-current', 'page');
    expect(within(bottomNav).getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current');
  });

  it('keeps a sticky back control inside the request flow so users cannot get trapped', async () => {
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    await user.click(within(flow).getByRole('button', { name: /flatbed tow/i }));
    await screen.findByRole('heading', { name: /set pickup/i });
    await user.click(within(screen.getByLabelText(/request flow sheet area/i)).getByRole('button', { name: /use current/i }));
    await user.click(within(screen.getByLabelText(/request flow sheet area/i)).getByRole('button', { name: /^continue$/i }));

    expect(await screen.findByRole('heading', { name: /add destination/i })).toBeInTheDocument();
    const flowHeader = screen.getByLabelText(/request step controls/i);
    expect(flowHeader).toHaveClass('sticky', 'top-0', 'z-20');
    expect(within(flowHeader).getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(within(flowHeader).getByRole('link', { name: /close/i })).toBeInTheDocument();

    await user.click(within(flowHeader).getByRole('button', { name: /back/i }));

    expect(screen.getByRole('heading', { name: /set pickup/i })).toBeInTheDocument();
  });

  it('uses separate pages for every bottom navigation tab and keeps the bar fixed on each page', () => {
    const pages = [
      { component: <Home />, active: /home/i, heading: /roadside help in minutes/i },
      { component: <RequestTowPage />, active: /request/i, heading: /choose service/i },
      { component: <TrackPage />, active: /track/i, heading: /track your tow/i },
      { component: <ServicesPage />, active: /services/i, heading: /services/i },
      { component: <AccountPage />, active: /account/i, heading: /account/i },
    ];

    for (const page of pages) {
      const { unmount } = render(page.component);

      expect(screen.getByRole('heading', { name: page.heading })).toBeInTheDocument();
      const bottomNav = screen.getByRole('navigation', { name: /main app navigation/i });
      expect(bottomNav).toHaveClass('fixed', 'bottom-0', 'z-[70]');
      expect(within(bottomNav).getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(within(bottomNav).getByRole('link', { name: /request/i })).toHaveAttribute('href', '/request');
      expect(within(bottomNav).getByRole('link', { name: /track/i })).toHaveAttribute('href', '/track');
      expect(within(bottomNav).getByRole('link', { name: /services/i })).toHaveAttribute('href', '/services');
      expect(within(bottomNav).getByRole('link', { name: /account/i })).toHaveAttribute('href', '/account');
      expect(within(bottomNav).getByRole('link', { name: page.active })).toHaveAttribute('aria-current', 'page');

      unmount();
    }
  });
});
