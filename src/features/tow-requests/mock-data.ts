import { calculateQuote } from "../pricing/pricing-engine";
import { demoDrivers } from "@/features/demo/drivers";
import type { AvailableDriver, ServiceOption, TowRequestPayload, TowTrip } from "./types";

export const serviceOptions: ServiceOption[] = [
  { id: "standard_tow", label: "Standard tow", description: "Fast local towing for cars and small SUVs.", basePriceCents: 9500, etaMinutes: 8, icon: "Tow" },
  { id: "flatbed_tow", label: "Flatbed tow", description: "Protected tow for luxury, low, or disabled vehicles.", basePriceCents: 12500, etaMinutes: 12, icon: "Flatbed" },
  { id: "jump_start", label: "Jump start", description: "Battery service at your location.", basePriceCents: 7500, etaMinutes: 7, icon: "Bolt" },
  { id: "flat_tire", label: "Flat tire", description: "Spare install or tire assistance.", basePriceCents: 8500, etaMinutes: 10, icon: "Tire" },
  { id: "lockout", label: "Lockout", description: "Get back into your vehicle safely.", basePriceCents: 8000, etaMinutes: 9, icon: "Key" },
  { id: "fuel_delivery", label: "Fuel delivery", description: "Emergency fuel delivered to you.", basePriceCents: 8000, etaMinutes: 14, icon: "Fuel" },
  { id: "winch_out", label: "Winch out", description: "Recovery from snow, mud, ditch, or tight spots.", basePriceCents: 15000, etaMinutes: 18, icon: "Winch" },
  { id: "accident_tow", label: "Accident tow", description: "Priority accident recovery and transport.", basePriceCents: 17500, etaMinutes: 11, icon: "Alert" },
  { id: "vehicle_transport", label: "Vehicle transport", description: "Scheduled point-to-point vehicle transport.", basePriceCents: 17500, etaMinutes: 22, icon: "Route" },
];

export const availableDrivers: AvailableDriver[] = demoDrivers;

export function buildMockTrip(payload: TowRequestPayload): TowTrip {
  const distanceMiles = payload.dropoffAddress ? 7.8 : 2.4;
  const quote = calculateQuote({ serviceType: payload.serviceType, distanceMiles, heavyVehicle: payload.heavyVehicle, rush: payload.rush });
  const driver = availableDrivers.find((candidate) => candidate.services.includes(payload.serviceType)) ?? availableDrivers[0];
  const now = new Date();

  return {
    id: `tow_${now.getTime()}`,
    status: "searching_for_driver",
    quote,
    pickupAddress: payload.pickupAddress,
    dropoffAddress: payload.dropoffAddress,
    driver: { ...driver, status: "assigned" },
    pickup: { lat: 40.7484, lng: -73.9857 },
    dropoff: { lat: 40.7614, lng: -73.9776 },
    route: [
      { lat: 40.746, lng: -73.985 },
      { lat: 40.7484, lng: -73.9857 },
      { lat: 40.752, lng: -73.982 },
      { lat: 40.757, lng: -73.98 },
      { lat: 40.7614, lng: -73.9776 },
    ],
    timeline: [
      { status: "quote_created", label: "Quote created", timestamp: now.toISOString(), complete: true },
      { status: "paid", label: "Payment authorized", timestamp: now.toISOString(), complete: true },
      { status: "searching_for_driver", label: "Matching nearby truck", timestamp: now.toISOString(), complete: true },
      { status: "driver_assigned", label: `${driver.name} assigned`, timestamp: new Date(now.getTime() + 60_000).toISOString(), complete: false },
      { status: "driver_on_the_way", label: "Driver en route", timestamp: new Date(now.getTime() + 120_000).toISOString(), complete: false },
      { status: "completed", label: "Tow completed", timestamp: new Date(now.getTime() + 45 * 60_000).toISOString(), complete: false },
    ],
  };
}
