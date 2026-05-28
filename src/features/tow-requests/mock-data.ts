import { calculateQuote } from "../pricing/pricing-engine";
import { demoDrivers } from "@/features/demo/drivers";
import type { AvailableDriver, ServiceOption, TowRequestPayload, TowTrip } from "./types";

export const serviceOptions: ServiceOption[] = [
  { id: "standard_tow", label: "Tow truck", description: "Fast local towing for cars and small SUVs.", basePriceCents: 9500, etaMinutes: 8, icon: "tow" },
  { id: "flatbed_tow", label: "Flatbed tow", description: "Protected towing for luxury, low, or disabled vehicles.", basePriceCents: 12500, etaMinutes: 12, icon: "flatbed" },
  { id: "jump_start", label: "Jump start", description: "Battery boost at your location.", basePriceCents: 7500, etaMinutes: 7, icon: "battery" },
  { id: "flat_tire", label: "Flat tire", description: "Spare install or tire assistance.", basePriceCents: 8500, etaMinutes: 10, icon: "tire" },
  { id: "lockout", label: "Lockout", description: "Get back into your vehicle safely.", basePriceCents: 8000, etaMinutes: 9, icon: "lock" },
  { id: "fuel_delivery", label: "Fuel delivery", description: "Emergency fuel delivered to you.", basePriceCents: 8000, etaMinutes: 14, icon: "fuel" },
  { id: "winch_out", label: "Winch out", description: "Recovery from snow, mud, ditch, or tight spots.", basePriceCents: 15000, etaMinutes: 18, icon: "winch" },
  { id: "accident_tow", label: "Accident tow", description: "Priority accident recovery and transport.", basePriceCents: 17500, etaMinutes: 11, icon: "accident" },
  { id: "motorcycle_tow", label: "Motorcycle tow", description: "Motorcycle-safe transport with proper equipment.", basePriceCents: 11000, etaMinutes: 13, icon: "motorcycle" },
  { id: "battery_help", label: "Battery help", description: "Battery diagnosis, jump support, or replacement help.", basePriceCents: 9500, etaMinutes: 9, icon: "battery-help" },
  { id: "vehicle_transport", label: "Long-distance transport", description: "Scheduled point-to-point vehicle transport.", basePriceCents: 17500, etaMinutes: 22, icon: "route" },
  { id: "heavy_duty_tow", label: "Heavy-duty tow", description: "Larger vehicle towing with heavy-duty equipment.", basePriceCents: 24500, etaMinutes: 28, icon: "heavy" },
  { id: "box_truck_tow", label: "Box truck tow", description: "Commercial box-truck tow and transport support.", basePriceCents: 26500, etaMinutes: 30, icon: "box" },
  { id: "private_property_tow", label: "Private property tow", description: "Private-property dispatch and vehicle removal workflow.", basePriceCents: 15500, etaMinutes: 18, icon: "property" },
  { id: "emergency_roadside", label: "Emergency roadside help", description: "Fast triage for urgent roadside situations.", basePriceCents: 9900, etaMinutes: 8, icon: "emergency" },
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
      { status: "quote_created", label: "Request confirmed", timestamp: now.toISOString(), complete: true },
      { status: "driver_assigned", label: "Provider assigned", timestamp: now.toISOString(), complete: true },
      { status: "driver_on_the_way", label: "Provider on the way", timestamp: new Date(now.getTime() + 120_000).toISOString(), complete: true },
      { status: "driver_arrived", label: "Provider arrived", timestamp: new Date(now.getTime() + 9 * 60_000).toISOString(), complete: false },
      { status: "vehicle_picked_up", label: payload.dropoffAddress ? "Vehicle picked up" : "Service started", timestamp: new Date(now.getTime() + 14 * 60_000).toISOString(), complete: false },
      { status: "completed", label: "Completed", timestamp: new Date(now.getTime() + 45 * 60_000).toISOString(), complete: false },
    ],
  };
}
