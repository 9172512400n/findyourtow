// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';

describe('FindYourTow app-first home', () => {
  it('starts as a mobile roadside app with service selection first', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /what rescue do you need/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /findyourtow logo/i })).toHaveAttribute(
      'src',
      '/brand/findyourtow-logo-transparent.png',
    );

    for (const service of [
      'Tow truck',
      'Flatbed tow',
      'Jump start',
      'Flat tire',
      'Lockout',
      'Fuel delivery',
      'Winch out',
      'Accident tow',
      'Motorcycle tow',
      'Battery help',
      'Vehicle transport',
    ]) {
      expect(screen.getByText(service)).toBeInTheDocument();
    }

    expect(screen.getAllByRole('link', { name: /home/i }).some((link) => link.getAttribute('href') === '/')).toBe(true);
    expect(screen.getAllByRole('link', { name: /request/i }).some((link) => link.getAttribute('href') === '/request')).toBe(true);
    expect(screen.getByRole('link', { name: /track/i })).toHaveAttribute('href', '/customer/trip/demo');
    expect(screen.getByRole('link', { name: /account/i })).toHaveAttribute('href', '/customer');
  });
});
