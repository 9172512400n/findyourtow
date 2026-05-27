// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';

describe('premium landing page', () => {
  it('presents FindYourTow as an investor-ready smart towing platform', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /smart towing platform for real roadside operators/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /findyourtow logo/i })).toHaveAttribute(
      'src',
      '/brand/findyourtow-logo.jpg',
    );
    expect(screen.getByRole('link', { name: /try customer app/i })).toHaveAttribute('href', '/request');
    expect(screen.getByRole('link', { name: /view dispatch demo/i })).toHaveAttribute('href', '/admin/dispatch');

    expect(screen.getAllByText(/payment is authorized before dispatch/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /customer app/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /driver app/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dispatch command/i })).toBeInTheDocument();
    expect(screen.getByText(/pricing transparency/i)).toBeInTheDocument();
  });
});
