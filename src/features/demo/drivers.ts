import type { AvailableDriver } from "@/features/tow-requests/types";

// Investor-safe driver data. Real driver records will come from Supabase `drivers`,
// `tow_trucks`, `driver_documents`, and live `driver_locations` rows.
export const demoDrivers: AvailableDriver[] = [
  { id: "drv_204", name: "Marcus Reed", rating: 4.98, truckType: "Flatbed", truckNumber: "Truck 204", distanceMiles: 1.4, etaMinutes: 8, location: { lat: 40.746, lng: -73.985 }, services: ["standard_tow", "flatbed_tow", "accident_tow", "vehicle_transport"], status: "available" },
  { id: "drv_118", name: "Elena Torres", rating: 4.95, truckType: "Wheel-lift", truckNumber: "Truck 118", distanceMiles: 2.1, etaMinutes: 11, location: { lat: 40.755, lng: -73.971 }, services: ["standard_tow", "jump_start", "flat_tire", "lockout", "fuel_delivery"], status: "available" },
  { id: "drv_317", name: "Andre Mills", rating: 4.91, truckType: "Recovery", truckNumber: "Truck 317", distanceMiles: 3.2, etaMinutes: 14, location: { lat: 40.735, lng: -73.991 }, services: ["winch_out", "accident_tow", "flatbed_tow"], status: "offered" },
  { id: "drv_422", name: "Samir Cohen", rating: 4.93, truckType: "Medium-duty", truckNumber: "Truck 422", distanceMiles: 4.8, etaMinutes: 19, location: { lat: 40.72, lng: -73.998 }, services: ["standard_tow", "winch_out", "vehicle_transport"], status: "busy" },
];
