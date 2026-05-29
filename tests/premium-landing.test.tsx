// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Home from '../app/(marketing)/page';
import AccountPage from '../app/account/page';
import RequestTowPage from '../app/request/page';
import ServicesPage from '../app/services/page';
import TrackPage from '../app/track/page';
import { useDemoAuthStore } from '../src/features/auth/demo-auth-store';
import { useRequestFlowStore } from '../src/features/tow-requests/request-flow-store';
import { useDemoVehicleStore } from '../src/features/vehicles/demo-vehicle-store';

afterEach(() => {
  useDemoAuthStore.getState().reset();
  useRequestFlowStore.getState().reset();
  useDemoVehicleStore.getState().resetDemoVehicles();
  cleanup();
});

describe('FindYourTow premium mobile homepage', () => {
  it('opens with a calm consumer app homepage instead of stacked pricing cards', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /roadside help in minutes/i })).toBeInTheDocument();
    expect(screen.getByText(/towing, lockouts, jump starts, tire help, fuel delivery, and more/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /findyourtow brand lockup/i })).toHaveAttribute(
      'src',
      '/brand/findyourtow-header-lockup.png',
    );

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /account/i }).some((link) => link.getAttribute('href') === '/account')).toBe(true);
    expect(screen.queryByRole('link', { name: /^start$/i })).not.toBeInTheDocument();

    const services = screen.getByLabelText(/quick service selector/i);
    const helpCard = screen.getByLabelText(/where do you need help/i);
    expect(within(services).getByRole('heading', { name: /choose the service you need/i })).toBeInTheDocument();
    expect(within(services).getByText(/tap what happened/i)).toBeInTheDocument();
    expect(Boolean(services.compareDocumentPosition(helpCard) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    for (const service of ['Tow', 'Jump', 'Flat Tire', 'Lockout', 'Fuel', 'Winch', 'Battery']) {
      expect(within(services).getByRole('button', { name: new RegExp(service, 'i') })).toBeInTheDocument();
    }
    expect(within(services).queryByRole('button', { name: /flatbed/i })).not.toBeInTheDocument();

    expect(within(helpCard).getByRole('button', { name: /use current location/i })).toBeInTheDocument();
    expect(within(helpCard).getByPlaceholderText(/enter address or landmark/i)).toBeInTheDocument();
    expect(within(helpCard).getByRole('button', { name: /service tow/i })).toBeInTheDocument();

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

  it('allows guest customers to request service without login', () => {
    render(<RequestTowPage />);

    expect(screen.getByRole('heading', { name: /request roadside help/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /sign in to request service/i })).not.toBeInTheDocument();
  });

  it('opens the request tab as a FindYourTow-branded roadside planner after login', () => {
    useDemoAuthStore.getState().signInDemo();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    expect(flow).toBeInTheDocument();
    expect(flow.firstElementChild).toHaveClass('bg-[#07111d]/95', 'text-white');
    expect(screen.getByRole('heading', { name: /request roadside help/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /plan your ride/i })).not.toBeInTheDocument();
    expect(within(flow).queryByRole('button', { name: /pickup now/i })).not.toBeInTheDocument();
    expect(within(flow).queryByRole('button', { name: /for me/i })).not.toBeInTheDocument();
    expect(within(flow).getByText(/tow details/i)).toBeInTheDocument();
    expect(within(flow).getByDisplayValue(/home/i)).toBeInTheDocument();
    expect(within(flow).getByPlaceholderText(/tow destination/i)).toBeInTheDocument();
    expect(within(flow).getByText(/random auto center/i)).toBeInTheDocument();
    expect(within(flow).queryByText(/piermont|hewlett|oceanside|reina|lincoln|healy|waverly|far rockaway/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /choose service/i })).not.toBeInTheDocument();
    const bottomNav = screen.getByRole('navigation', { name: /main app navigation/i });
    expect(within(bottomNav).getByRole('link', { name: /request/i })).toHaveAttribute('aria-current', 'page');
    expect(within(bottomNav).getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current');
  });

  it('defaults request page to towing and lets customers change the needed service from a dropdown', async () => {
    useDemoAuthStore.getState().signInDemo();
    useRequestFlowStore.getState().patch({ serviceType: 'fuel_delivery', dropoffAddress: '' });
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    const serviceSelect = within(flow).getByRole('combobox', { name: /roadside service needed/i });
    expect(serviceSelect).toHaveValue('standard_tow');
    expect(within(serviceSelect).getByRole('option', { name: /flatbed tow/i })).toBeInTheDocument();
    expect(within(flow).getByPlaceholderText(/tow destination/i)).toBeInTheDocument();

    await user.selectOptions(serviceSelect, 'fuel_delivery');

    expect(serviceSelect).toHaveValue('fuel_delivery');
    expect(within(flow).getByPlaceholderText(/where are you/i)).toBeInTheDocument();
    expect(within(flow).getByText(/fuel delivery: add your location, get the price, authorize payment/i)).toBeInTheDocument();
    expect(within(flow).queryByRole('button', { name: /add stop/i })).not.toBeInTheDocument();
  });

  it('keeps a sticky back control inside the request flow so users cannot get trapped', async () => {
    useDemoAuthStore.getState().signInDemo();
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    expect(flow.firstElementChild).toHaveClass('overflow-hidden');
    expect(screen.getByRole('heading', { name: /request roadside help/i })).toBeInTheDocument();

    await user.type(within(flow).getByPlaceholderText(/tow destination/i), 'Random Auto Center');
    await user.click(within(flow).getByRole('button', { name: /random auto center/i }));

    expect(await screen.findByRole('heading', { name: /vehicle details/i })).toBeInTheDocument();
    const flowHeader = screen.getByLabelText(/request step controls/i);
    expect(flowHeader).toHaveClass('sticky', 'top-0', 'z-20');
    expect(within(flowHeader).getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(within(flowHeader).getByRole('link', { name: /close/i })).toBeInTheDocument();

    await user.click(within(flowHeader).getByRole('button', { name: /back/i }));

    expect(screen.getByRole('heading', { name: /request roadside help/i })).toBeInTheDocument();
  });

  it('shows an obvious continue button for a typed custom tow destination', async () => {
    useDemoAuthStore.getState().signInDemo();
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    await user.type(within(flow).getByPlaceholderText(/tow destination/i), 'Exotic');

    expect(within(flow).getByRole('button', { name: /continue booking demo/i })).toBeInTheDocument();
    expect(within(flow).getByText(/use exotic as the drop-off/i)).toBeInTheDocument();

    await user.click(within(flow).getByRole('button', { name: /continue booking demo/i }));

    expect(await screen.findByRole('heading', { name: /vehicle details/i })).toBeInTheDocument();
  });

  it('adds booking-progress clarity and stronger payment authorization guidance without changing the app shell', async () => {
    useDemoAuthStore.getState().signInDemo();
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    const progress = screen.getByLabelText(/booking progress/i);
    expect(within(progress).getByText(/details/i)).toBeInTheDocument();
    expect(within(progress).getByText(/vehicle/i)).toBeInTheDocument();
    expect(within(progress).getByText(/quote/i)).toBeInTheDocument();
    expect(within(progress).getByText(/payment/i)).toBeInTheDocument();
    expect(within(progress).getByText(/track/i)).toBeInTheDocument();
    expect(within(progress).getByText(/step 1 of 5/i)).toBeInTheDocument();

    await user.type(within(flow).getByPlaceholderText(/tow destination/i), 'Random Auto Center');
    await user.click(within(flow).getByRole('button', { name: /random auto center/i }));
    await user.click(await within(flow).findByRole('button', { name: /get instant quote/i }));

    expect(screen.getByRole('heading', { name: /live quote/i })).toBeInTheDocument();
    expect(screen.getByText(/payment is authorized now and charged only after service is completed/i)).toBeInTheDocument();
    expect(within(screen.getByLabelText(/booking progress/i)).getByText(/step 3 of 5/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue to payment/i }));

    expect(screen.getByRole('heading', { name: /authorize payment/i })).toBeInTheDocument();
    expect(screen.getByText(/stripe authorization/i)).toBeInTheDocument();
    expect(screen.getByText(/charged only after service is completed/i)).toBeInTheDocument();
    expect(within(screen.getByLabelText(/booking progress/i)).getByText(/step 4 of 5/i)).toBeInTheDocument();
  });

  it('lets customers manage saved vehicles from the account page', async () => {
    const user = userEvent.setup();
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /my vehicles/i })).toBeInTheDocument();
    expect(screen.getByText(/2021 toyota camry/i)).toBeInTheDocument();
    expect(screen.getByText(/2023 ford f-150/i)).toBeInTheDocument();
    expect(screen.getByText(/2020 honda accord/i)).toBeInTheDocument();
    expect(screen.getByText(/default/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add vehicle/i }));
    expect(screen.getByRole('dialog', { name: /add vehicle/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/vehicle nickname/i), 'Rental');
    await user.type(screen.getByLabelText(/^make$/i), 'Nissan');
    await user.type(screen.getByLabelText(/^model$/i), 'Altima');
    await user.type(screen.getByLabelText(/^year$/i), '2022');
    await user.type(screen.getByLabelText(/^color$/i), 'Silver');
    await user.type(screen.getByLabelText(/license plate/i), 'RENT22');
    await user.click(screen.getByRole('button', { name: /save vehicle/i }));

    expect(screen.getByText(/2022 nissan altima/i)).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /set default/i })[0]);
    const firstCard = screen.getAllByLabelText(/saved vehicle card/i)[0];
    expect(within(firstCard).getByText(/default/i)).toBeInTheDocument();
  });

  it('uses saved vehicles or another manual vehicle during request without forcing a save', async () => {
    useDemoAuthStore.getState().signInDemo();
    const user = userEvent.setup();
    render(<RequestTowPage />);

    const flow = screen.getByLabelText(/request flow sheet area/i);
    await user.type(within(flow).getByPlaceholderText(/tow destination/i), 'Random Auto Center');
    await user.click(within(flow).getByRole('button', { name: /random auto center/i }));

    expect(await screen.findByRole('heading', { name: /vehicle details/i })).toBeInTheDocument();
    expect(within(flow).getByRole('button', { name: /use saved vehicle/i })).toBeInTheDocument();
    expect(within(flow).getByText(/2021 toyota camry/i)).toBeInTheDocument();

    await user.click(within(flow).getByText(/2023 ford f-150/i));
    await user.click(within(flow).getByRole('button', { name: /get instant quote/i }));

    expect(useRequestFlowStore.getState().data.vehicleId).toMatch(/ford/i);
    expect(useRequestFlowStore.getState().data.vehicleSnapshot).toMatchObject({ make: 'Ford', model: 'F-150', vehicleType: 'Pickup truck' });
    expect(screen.getByRole('heading', { name: /live quote/i })).toBeInTheDocument();
    expect(screen.getByText(/heavy vehicle fee/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    await user.click(within(flow).getByRole('button', { name: /service for another vehicle/i }));
    await user.clear(within(flow).getByLabelText(/^make$/i));
    await user.type(within(flow).getByLabelText(/^make$/i), 'Honda');
    await user.clear(within(flow).getByLabelText(/^model$/i));
    await user.type(within(flow).getByLabelText(/^model$/i), 'Civic');
    await user.clear(within(flow).getByLabelText(/^year$/i));
    await user.type(within(flow).getByLabelText(/^year$/i), '2018');
    await user.clear(within(flow).getByLabelText(/^color$/i));
    await user.type(within(flow).getByLabelText(/^color$/i), 'Blue');
    await user.click(within(flow).getByRole('button', { name: /get instant quote/i }));

    expect(useRequestFlowStore.getState().data.vehicleId).toBeNull();
    expect(useRequestFlowStore.getState().data.vehicleSnapshot).toMatchObject({ make: 'Honda', model: 'Civic', color: 'Blue' });
  });

  it('uses separate pages for every bottom navigation tab and keeps the bar fixed on each page', () => {
    const pages = [
      { component: <Home />, active: /home/i, heading: /roadside help in minutes/i },
      { component: <RequestTowPage />, active: /request/i, heading: /request roadside help/i },
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
