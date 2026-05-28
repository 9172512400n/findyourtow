// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LoginPage from '../app/login/page';
import RegisterPage from '../app/register/page';
import AccountSetupPage from '../app/account/setup/page';
import AccountVehiclesPage from '../app/account/vehicles/page';
import AccountPaymentsPage from '../app/account/payments/page';
import ApplePayPage from '../app/account/payments/apple-pay/page';
import DriverJobsPage from '../app/driver/jobs/page';
import DriverActivePage from '../app/driver/active/page';
import DriverEarningsPage from '../app/driver/earnings/page';
import AdminDriversPage from '../app/admin/drivers/page';
import AdminPricingPage from '../app/admin/pricing/page';
import AdminJobsPage from '../app/admin/jobs/page';
import TermsPage from '../app/terms/page';
import PrivacyPage from '../app/privacy/page';
import HelpPage from '../app/help/page';
import SettingsPage from '../app/settings/page';
import NotificationsPage from '../app/notifications/page';
import CustomerDashboardPage from '../app/customer/page';
import DriverPage from '../app/driver/page';
import DispatchPage from '../app/admin/dispatch/page';
import AdminNotificationsPage from '../app/admin/notifications/page';
import AdminRefundsPage from '../app/admin/refunds/page';
import AdminSettingsPage from '../app/admin/settings/page';
import { demoAdapters } from '../src/lib/demo/adapters';

afterEach(() => cleanup());

describe('complete FindYourTow demo routes', () => {
  it('renders customer account and payment pages as finished demo screens', () => {
    const pages = [
      { component: <LoginPage />, heading: /welcome back/i },
      { component: <RegisterPage />, heading: /create your account/i },
      { component: <AccountVehiclesPage />, heading: /my vehicles/i },
      { component: <AccountPaymentsPage />, heading: /payment methods/i },
      { component: <ApplePayPage />, heading: /apple pay demo/i },
      { component: <TermsPage />, heading: /terms/i },
      { component: <PrivacyPage />, heading: /privacy/i },
    ];

    for (const page of pages) {
      const { unmount } = render(page.component);
      expect(screen.getAllByRole('heading', { name: page.heading }).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/FindYourTow/i).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('renders account setup as a premium mobile onboarding flow', () => {
    render(<AccountSetupPage />);

    expect(screen.getByRole('heading', { name: /your account is almost ready/i })).toBeInTheDocument();
    expect(screen.getByText(/80% complete/i)).toBeInTheDocument();
    for (const step of ['Profile', 'Vehicle', 'Payment', 'Ready']) {
      expect(screen.getAllByText(new RegExp(step, 'i')).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(/2021 Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/Black • Sedan/i)).toBeInTheDocument();
    expect(screen.getByText(/Plate: KRF-2048/i)).toBeInTheDocument();
    expect(screen.getByText(/Visa ending in 4242/i)).toBeInTheDocument();
    expect(screen.getByText(/Apple Pay enabled/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start roadside request/i })).toHaveAttribute('href', '/request');
  });

  it('renders provider and admin pages with actionable demo controls', () => {
    const pages = [
      { component: <DriverJobsPage />, heading: /job offers/i },
      { component: <DriverActivePage />, heading: /active job/i },
      { component: <DriverEarningsPage />, heading: /earnings/i },
      { component: <AdminDriversPage />, heading: /provider management/i },
      { component: <AdminPricingPage />, heading: /pricing rules/i },
      { component: <AdminJobsPage />, heading: /job management/i },
    ];

    for (const page of pages) {
      const { unmount } = render(page.component);
      expect(screen.getAllByRole('heading', { name: page.heading }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('keeps backend adapters in keyless demo mode', async () => {
    expect(demoAdapters.auth.mode).toBe('demo');
    expect(await demoAdapters.payments.createIntent({ amountCents: 12500 })).toMatchObject({ provider: 'demo-stripe', status: 'authorized' });
    expect(await demoAdapters.maps.route({ pickup: 'Home', dropoff: 'Repair shop' })).toMatchObject({ provider: 'demo-mapbox' });
    expect(await demoAdapters.notifications.send({ to: '+15555550100', body: 'Driver assigned' })).toMatchObject({ provider: 'demo-notification', delivered: true });
  });

  it('renders customer support, settings, and legal pages as complete product pages', () => {
    const pages = [
      { component: <HelpPage />, heading: /help/i, expected: /active request help/i },
      { component: <SettingsPage />, heading: /settings/i, expected: /location sharing/i },
      { component: <NotificationsPage />, heading: /notifications/i, expected: /provider assigned/i },
      { component: <PrivacyPage />, heading: /privacy/i, expected: /precise location/i },
      { component: <TermsPage />, heading: /terms/i, expected: /marketplace/i },
    ];

    for (const page of pages) {
      const { container, unmount } = render(page.component);
      expect(screen.getAllByRole('heading', { name: page.heading }).length).toBeGreaterThan(0);
      expect(screen.getAllByText(page.expected).length).toBeGreaterThan(0);
      expect(container.textContent).not.toMatch(/placeholder|future/i);
      unmount();
    }
  });

  it('keeps role dashboards polished and reachable from mobile app navigation', () => {
    const pages = [
      { component: <CustomerDashboardPage />, heading: /your tow is active/i, cta: /get support/i },
      { component: <DriverPage />, heading: /earn with premium tow jobs/i, cta: /accept job/i },
      { component: <DispatchPage />, heading: /live dispatch dashboard/i, cta: /assign marcus reed/i },
      { component: <AdminNotificationsPage />, heading: /notifications/i, cta: /driver assigned sms/i },
      { component: <AdminRefundsPage />, heading: /refunds/i, cta: /issue partial refund/i },
      { component: <AdminSettingsPage />, heading: /settings/i, cta: /demo operations/i },
    ];

    for (const page of pages) {
      const { container, unmount } = render(page.component);
      expect(screen.getAllByRole('heading', { name: page.heading }).length).toBeGreaterThan(0);
      expect(screen.getAllByText(page.cta).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('navigation', { name: /main app navigation/i }).length).toBeGreaterThan(0);
      expect(container.textContent).not.toMatch(/placeholder|future/i);
      unmount();
    }
  });
});
