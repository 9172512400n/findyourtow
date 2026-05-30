// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomePage from '../app/(marketing)/page';
import AccountPage from '../app/account/page';
import CustomerAccountPage from '../app/account/customer/page';
import RequestServicePage from '../app/request-service/page';
import ProviderAccountPage from '../app/account/provider/page';
import ProviderApplyPage from '../app/provider/apply/page';
import ProviderDashboardPage from '../app/provider/dashboard/page';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RoadAssistNow improvement plan', () => {
  it('upgrades the homepage structure without leaving the existing design system', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: /roadside assistance in minutes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get help now/i })).toHaveAttribute('href', '/request-service');
    expect(screen.getByRole('link', { name: /become a provider/i })).toHaveAttribute('href', '/provider/apply');
    expect(screen.getByText(/24\/7/i)).toBeInTheDocument();
    expect(screen.getByText(/upfront pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/live tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/verified providers/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /call now/i })).toHaveAttribute('href', expect.stringMatching(/^tel:/));
    expect(screen.getByRole('button', { name: /share my location/i })).toBeInTheDocument();
  });

  it('makes account a three-card gateway for customer, provider, and tracking access', () => {
    render(<AccountPage />);

    expect(screen.getByRole('link', { name: /customer account/i })).toHaveAttribute('href', '/account/customer');
    expect(screen.getByRole('link', { name: /provider account/i })).toHaveAttribute('href', '/account/provider');
    expect(screen.getByRole('link', { name: /track request/i })).toHaveAttribute('href', '/track');
  });

  it('adds the customer account and request-service flow pages', () => {
    render(<CustomerAccountPage />);
    expect(screen.getByRole('heading', { name: /customer account/i })).toBeInTheDocument();
    expect(screen.getByText(/save user profile/i)).toBeInTheDocument();
    expect(screen.getByText(/save vehicle details/i)).toBeInTheDocument();
    cleanup();

    render(<RequestServicePage />);
    expect(screen.getAllByText(/price estimate before confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /roadside assistance in minutes/i })).toBeInTheDocument();
  });

  it('adds provider account, application, and dashboard pages', () => {
    render(<ProviderAccountPage />);
    expect(screen.getByRole('heading', { name: /provider account/i })).toBeInTheDocument();
    expect(screen.getAllByText(/apply to join/i).length).toBeGreaterThan(0);
    cleanup();

    render(<ProviderApplyPage />);
    expect(screen.getByRole('heading', { name: /provider application/i })).toBeInTheDocument();
    expect(screen.getByText(/license\/insurance upload placeholder/i)).toBeInTheDocument();
    expect(screen.getByText(/status: pending review/i)).toBeInTheDocument();
    cleanup();

    render(<ProviderDashboardPage />);
    expect(screen.getByRole('heading', { name: /provider dashboard/i })).toBeInTheDocument();
    expect(screen.getAllByText(/online\/offline/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/incoming job placeholder/i)).toBeInTheDocument();
    expect(screen.getAllByText(/earnings placeholder/i).length).toBeGreaterThan(0);
  });
});
