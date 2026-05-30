// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProviderOnboardingForm } from '../src/components/marketplace/ProviderOnboardingForm';
import { DispatchMarketplacePanel } from '../src/components/marketplace/DispatchMarketplacePanel';
import { DriverJobsPanel } from '../src/components/marketplace/DriverJobsPanel';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('marketplace UI components', () => {
  it('renders a real provider application form with service capabilities', () => {
    render(<ProviderOnboardingForm />);
    expect(screen.getByPlaceholderText('Company name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Dispatch phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Flatbed tow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit provider application/i })).toBeInTheDocument();
  });

  it('renders dispatch assignment controls for real queue data', () => {
    render(
      <DispatchMarketplacePanel
        initialRequests={[{ id: 'tow_1', shortId: 'TOW_1', customer: 'Nir M', phone: '+1917', service: 'Flatbed Tow', status: 'AWAITING_PAYMENT', pickup: '123 Main', dropoff: 'Shop', totalCents: 14740, assignedDriver: null, action: null, createdAt: 'Today' }]}
        initialDrivers={[{ id: 'driver_1', name: 'Sam Driver', email: 'sam@example.com', phone: '+1917', status: 'APPROVED', rating: 5, truck: 'Flatbed 1', services: ['flatbed_tow'], approvedAt: 'Today', createdAt: 'Today' }]}
      />,
    );
    expect(screen.getByText('Real dispatch queue')).toBeInTheDocument();
    expect(screen.getByText('Nir M')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assign sam driver/i })).toBeInTheDocument();
  });

  it('renders driver job status actions', () => {
    render(<DriverJobsPanel initialJobs={[{ id: 'tow_1', shortId: 'TOW_1', customer: 'Nir M', phone: '+1917', service: 'Flatbed Tow', status: 'DRIVER_ASSIGNED', pickup: '123 Main', dropoff: 'Shop', totalCents: 14740, assignedDriver: 'Sam Driver', action: { nextStatus: 'DRIVER_ON_THE_WAY', label: 'Accept / en route' }, createdAt: 'Today' }]} />);
    expect(screen.getByText('Real assigned jobs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept \/ en route/i })).toBeInTheDocument();
  });
});
