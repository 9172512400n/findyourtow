import type { Coordinate } from "@/features/tow-requests/types";

export type DriverLocationPing = {
  driverId: string;
  location: Coordinate;
  heading?: number;
  speedMph?: number;
  sentAt: string;
  provider: "demo" | "websocket";
};

// In demo mode this returns the payload that would be persisted to Supabase and
// broadcast over Redis/WebSockets. Real implementation will insert driver_locations
// and publish to rooms: customer:{towRequestId}, driver:{driverId}, dispatch:live.
export async function saveDriverLocationPing(driverId: string, location: Coordinate): Promise<DriverLocationPing> {
  return {
    driverId,
    location,
    heading: 42,
    speedMph: 21,
    sentAt: new Date().toISOString(),
    provider: "demo",
  };
}
