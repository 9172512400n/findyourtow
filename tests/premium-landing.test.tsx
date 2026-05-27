// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';

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
});
