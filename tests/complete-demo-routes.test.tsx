// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LoginPage from '../app/login/page';
import RegisterPage from '../app/register/page';
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

  it('keeps future backend adapters in keyless demo mode', async () => {
    expect(demoAdapters.auth.mode).toBe('demo');
    expect(await demoAdapters.payments.createIntent({ amountCents: 12500 })).toMatchObject({ provider: 'demo-stripe', status: 'authorized' });
    expect(await demoAdapters.maps.route({ pickup: 'Home', dropoff: 'Repair shop' })).toMatchObject({ provider: 'demo-mapbox' });
    expect(await demoAdapters.notifications.send({ to: '+15555550100', body: 'Driver assigned' })).toMatchObject({ provider: 'demo-notification', delivered: true });
  });
});
