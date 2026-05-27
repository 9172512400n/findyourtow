export const serviceTypeIds = [
  "standard_tow",
  "flatbed_tow",
  "jump_start",
  "flat_tire",
  "lockout",
  "fuel_delivery",
  "winch_out",
  "accident_tow",
  "vehicle_transport",
] as const;

export type ServiceTypeId = (typeof serviceTypeIds)[number];

export const towStatuses = [
  "quote_created",
  "awaiting_payment",
  "paid",
  "searching_for_driver",
  "driver_assigned",
  "driver_on_the_way",
  "driver_arrived",
  "vehicle_picked_up",
  "in_transit",
  "vehicle_delivered",
  "completed",
  "cancelled",
  "refunded",
] as const;

export type TowStatus = (typeof towStatuses)[number];

export const userRoles = ["customer", "driver", "dispatcher", "admin", "super_admin"] as const;
export type UserRole = (typeof userRoles)[number];

export type QuoteLineItem = {
  code:
    | "base_fee"
    | "distance_fee"
    | "minimum_adjustment"
    | "after_hours_fee"
    | "heavy_vehicle_fee"
    | "rush_fee"
    | "admin_service_fee";
  label: string;
  amountCents: number;
};

export type QuoteRequest = {
  serviceType: ServiceTypeId;
  distanceMiles: number;
  afterHours?: boolean;
  heavyVehicle?: boolean;
  rush?: boolean;
};

export type QuoteResponse = {
  serviceType: ServiceTypeId;
  distanceMiles: number;
  subtotalCents: number;
  adminFeeCents: number;
  totalCents: number;
  currency: "usd";
  lineItems: QuoteLineItem[];
  estimatedEtaMinutes: number;
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type ServiceOption = {
  id: ServiceTypeId;
  label: string;
  description: string;
  basePriceCents: number;
  etaMinutes: number;
  icon: string;
};

export type AvailableDriver = {
  id: string;
  name: string;
  rating: number;
  truckType: string;
  truckNumber: string;
  distanceMiles: number;
  etaMinutes: number;
  location: Coordinate;
  services: ServiceTypeId[];
  status: "available" | "offered" | "assigned" | "busy";
};

export type TowRequestPayload = {
  customerName: string;
  phone: string;
  serviceType: ServiceTypeId;
  pickupAddress: string;
  dropoffAddress?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: string;
  vehicleColor?: string;
  notes?: string;
  heavyVehicle?: boolean;
  rush?: boolean;
};

export type TowTrip = {
  id: string;
  status: TowStatus;
  quote: QuoteResponse;
  pickupAddress: string;
  dropoffAddress?: string;
  driver: AvailableDriver;
  pickup: Coordinate;
  dropoff: Coordinate;
  route: Coordinate[];
  timeline: Array<{ status: TowStatus; label: string; timestamp: string; complete: boolean }>;
};
