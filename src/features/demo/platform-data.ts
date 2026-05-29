import type { AvailableDriver, ServiceTypeId } from '@/features/tow-requests/types';
import type { VehicleType } from '@/features/vehicles/types';

export type DemoPaymentMethod = {
  id: string;
  type: 'card' | 'apple_pay' | 'business' | 'cash_demo';
  label: string;
  holder: string;
  last4: string;
  expiration: string;
  billingZip: string;
  isDefault: boolean;
};

export type DemoRequestSummary = {
  id: string;
  serviceType: ServiceTypeId;
  serviceLabel: string;
  customer: string;
  pickup: string;
  dropoff?: string;
  vehicle: string;
  vehicleSnapshot: { make: string; model: string; year: string; color: string; plate: string; vehicleType: VehicleType | string };
  paymentMethodId: string;
  status: 'matching' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  providerId: string;
  totalCents: number;
  etaMinutes: number;
  createdAt: string;
};

export const completeServiceCatalog: Array<{ id: ServiceTypeId; label: string; routeRequired: boolean; description: string; baseCents: number }> = [
  { id: 'standard_tow', label: 'Standard tow', routeRequired: true, description: 'Local towing for cars, SUVs, and light trucks.', baseCents: 9500 },
  { id: 'flatbed_tow', label: 'Flatbed tow', routeRequired: true, description: 'Protected flatbed transport for luxury or disabled vehicles.', baseCents: 12500 },
  { id: 'accident_tow', label: 'Accident tow', routeRequired: true, description: 'Priority accident recovery with careful vehicle handling.', baseCents: 17500 },
  { id: 'vehicle_transport', label: 'Long-distance transport', routeRequired: true, description: 'Scheduled longer-range vehicle transport.', baseCents: 17500 },
  { id: 'jump_start', label: 'Jump start', routeRequired: false, description: 'Battery boost and basic battery diagnostics.', baseCents: 7500 },
  { id: 'flat_tire', label: 'Flat tire change', routeRequired: false, description: 'Spare install and tire-side roadside support.', baseCents: 8500 },
  { id: 'lockout', label: 'Lockout', routeRequired: false, description: 'Vehicle entry help from verified roadside providers.', baseCents: 8000 },
  { id: 'fuel_delivery', label: 'Fuel delivery', routeRequired: false, description: 'Emergency fuel delivered to the service location.', baseCents: 8000 },
  { id: 'winch_out', label: 'Winch out', routeRequired: false, description: 'Recovery from mud, snow, driveway, ditch, or tight spots.', baseCents: 15000 },
  { id: 'battery_help', label: 'Battery help', routeRequired: false, description: 'Battery support, jump assistance, and replacement coordination.', baseCents: 9500 },
  { id: 'motorcycle_tow', label: 'Motorcycle tow', routeRequired: true, description: 'Motorcycle-safe tow with proper equipment.', baseCents: 11000 },
  { id: 'heavy_duty_tow', label: 'Heavy-duty tow', routeRequired: true, description: 'Heavy vehicle tow demo flow for larger vehicles.', baseCents: 24500 },
  { id: 'box_truck_tow', label: 'Box truck tow', routeRequired: true, description: 'Commercial box-truck tow demo flow.', baseCents: 26500 },
  { id: 'private_property_tow', label: 'Private property tow', routeRequired: true, description: 'Private property dispatch-ready tow workflow.', baseCents: 15500 },
  { id: 'emergency_roadside', label: 'Emergency roadside help', routeRequired: false, description: 'Fast triage for urgent roadside issues.', baseCents: 9900 },
];

export const demoPaymentMethods: DemoPaymentMethod[] = [
  { id: 'pay_card_4242', type: 'card', label: 'Visa ending 4242', holder: 'Demo Customer', last4: '4242', expiration: '08/29', billingZip: '90000', isDefault: true },
  { id: 'pay_apple_demo', type: 'apple_pay', label: 'Apple Pay demo', holder: 'Demo Customer', last4: '0000', expiration: 'Wallet', billingZip: '90000', isDefault: false },
  { id: 'pay_business_demo', type: 'business', label: 'Business account demo', holder: 'FindYourTow Fleet', last4: '1188', expiration: 'Net 15', billingZip: '10001', isDefault: false },
];

export const demoProviders: AvailableDriver[] = [
  { id: 'drv_marcus', name: 'Marcus Reed', rating: 4.98, truckType: 'Flatbed', truckNumber: 'Truck 204', distanceMiles: 1.4, etaMinutes: 6, location: { lat: 40.751, lng: -73.982 }, services: ['standard_tow', 'flatbed_tow', 'vehicle_transport', 'motorcycle_tow', 'heavy_duty_tow', 'box_truck_tow'], status: 'available' },
  { id: 'drv_elena', name: 'Elena Torres', rating: 4.96, truckType: 'Roadside service', truckNumber: 'Unit 18', distanceMiles: 2.1, etaMinutes: 8, location: { lat: 40.744, lng: -73.99 }, services: ['jump_start', 'flat_tire', 'lockout', 'fuel_delivery', 'battery_help'], status: 'available' },
  { id: 'drv_andre', name: 'Andre Mills', rating: 4.93, truckType: 'Recovery', truckNumber: 'Winch 7', distanceMiles: 3.2, etaMinutes: 13, location: { lat: 40.741, lng: -73.973 }, services: ['winch_out', 'accident_tow', 'standard_tow', 'private_property_tow'], status: 'available' },
  { id: 'drv_samir', name: 'Samir Cohen', rating: 4.91, truckType: 'Medium-duty', truckNumber: 'MD 41', distanceMiles: 4.8, etaMinutes: 17, location: { lat: 40.761, lng: -73.99 }, services: ['flatbed_tow', 'vehicle_transport', 'accident_tow'], status: 'available' },
  { id: 'drv_jules', name: 'Jules Carter', rating: 4.89, truckType: 'Roadside rescue', truckNumber: 'Unit 12', distanceMiles: 5.4, etaMinutes: 19, location: { lat: 40.732, lng: -73.984 }, services: ['fuel_delivery', 'lockout', 'jump_start', 'battery_help', 'emergency_roadside'], status: 'available' },
];

export const demoRequests: DemoRequestSummary[] = [
  { id: 'FYT-9284', serviceType: 'flatbed_tow', serviceLabel: 'Flatbed tow', customer: 'Demo Rider A', pickup: 'Pixel Pkwy service lane', dropoff: 'Mockingbird Repair Center', vehicle: '2022 BMW X5', vehicleSnapshot: { make: 'BMW', model: 'X5', year: '2022', color: 'Black', plate: 'NYX502', vehicleType: 'SUV' }, paymentMethodId: 'pay_card_4242', status: 'assigned', providerId: 'drv_marcus', totalCents: 22440, etaMinutes: 6, createdAt: 'Today 1:18 PM' },
  { id: 'FYT-9271', serviceType: 'jump_start', serviceLabel: 'Jump start', customer: 'Demo Rider B', pickup: 'Sandbox Plaza', vehicle: '2020 Toyota Camry', vehicleSnapshot: { make: 'Toyota', model: 'Camry', year: '2020', color: 'Silver', plate: 'JMP220', vehicleType: 'Sedan' }, paymentMethodId: 'pay_apple_demo', status: 'en_route', providerId: 'drv_elena', totalCents: 9350, etaMinutes: 8, createdAt: 'Today 12:42 PM' },
  { id: 'FYT-9218', serviceType: 'lockout', serviceLabel: 'Lockout', customer: 'Demo Rider C', pickup: 'Placeholder Ave', vehicle: '2021 Honda Accord', vehicleSnapshot: { make: 'Honda', model: 'Accord', year: '2021', color: 'Gray', plate: 'LCK441', vehicleType: 'Sedan' }, paymentMethodId: 'pay_business_demo', status: 'completed', providerId: 'drv_jules', totalCents: 8800, etaMinutes: 0, createdAt: 'Yesterday' },
  { id: 'FYT-9202', serviceType: 'winch_out', serviceLabel: 'Winch out', customer: 'Demo Rider D', pickup: 'Widget Road driveway', vehicle: '2023 Ford F-150', vehicleSnapshot: { make: 'Ford', model: 'F-150', year: '2023', color: 'White', plate: 'RCV150', vehicleType: 'Pickup truck' }, paymentMethodId: 'pay_card_4242', status: 'completed', providerId: 'drv_andre', totalCents: 18150, etaMinutes: 0, createdAt: 'May 25' },
  { id: 'FYT-9180', serviceType: 'fuel_delivery', serviceLabel: 'Fuel delivery', customer: 'Demo Rider E', pickup: 'Test Auto Lane shoulder', vehicle: '2019 Nissan Rogue', vehicleSnapshot: { make: 'Nissan', model: 'Rogue', year: '2019', color: 'Blue', plate: 'FUEL19', vehicleType: 'SUV' }, paymentMethodId: 'pay_apple_demo', status: 'completed', providerId: 'drv_elena', totalCents: 9800, etaMinutes: 0, createdAt: 'May 21' },
];

export const demoDriverEarnings = [
  { id: 'earn_1', label: 'Flatbed tow', area: 'South Demo Zone', amountCents: 14800, date: 'Today' },
  { id: 'earn_2', label: 'Jump start', area: 'West Demo Zone', amountCents: 6200, date: 'Today' },
  { id: 'earn_3', label: 'Lockout', area: 'Central Demo Zone', amountCents: 7400, date: 'Yesterday' },
  { id: 'earn_4', label: 'Winch out', area: 'North Demo Zone', amountCents: 13200, date: 'May 25' },
];

export const demoServiceAreas = ['South Demo Zone', 'West Demo Zone', 'Central Demo Zone', 'North Demo Zone', 'Pixel Parkway Zone'];
