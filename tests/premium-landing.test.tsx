// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';

afterEach(cleanup);

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
    expect(screen.getAllByRole('link', { name: /account/i }).some((link) => link.getAttribute('href') === '/customer')).toBe(true);
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
    expect(within(bottomNav).getByRole('link', { name: /track/i })).toHaveAttribute('href', '/customer/trip/demo');
    expect(within(bottomNav).getByRole('link', { name: /services/i })).toHaveAttribute('href', '#services');
    expect(within(bottomNav).getByRole('link', { name: /account/i })).toHaveAttribute('href', '/customer');

    expect(screen.getByLabelText(/request flow sheet area/i)).toHaveClass('pb-[calc(5.75rem+env(safe-area-inset-bottom))]');
  });
});
