import { getBackendMode } from "@/lib/runtime/backend-mode";
import type { Coordinate } from "@/features/tow-requests/types";

export type RouteEstimate = {
  pickup: Coordinate;
  dropoff: Coordinate;
  distanceMiles: number;
  etaMinutes: number;
  route: Coordinate[];
  provider: "demo" | "mapbox";
};

export async function estimateRoute(pickupAddress: string, dropoffAddress?: string): Promise<RouteEstimate> {
  const mode = getBackendMode();
  if (mode.demoMode || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);
  }

  // Future Mapbox connection point:
  // 1. Geocode pickup/dropoff addresses.
  // 2. Call Directions API.
  // 3. Use returned distance/duration for pricing and tracking route line.
  return buildDemoRoute(Boolean(dropoffAddress), pickupAddress, "mapbox");
}

function buildDemoRoute(hasDropoff: boolean, _pickupAddress: string, provider: "demo" | "mapbox" = "demo"): RouteEstimate {
  const distanceMiles = hasDropoff ? 7.8 : 2.4;
  return {
    pickup: { lat: 40.7484, lng: -73.9857 },
    dropoff: { lat: 40.7614, lng: -73.9776 },
    distanceMiles,
    etaMinutes: hasDropoff ? 18 : 9,
    provider,
    route: [
      { lat: 40.746, lng: -73.985 },
      { lat: 40.7484, lng: -73.9857 },
      { lat: 40.752, lng: -73.982 },
      { lat: 40.757, lng: -73.98 },
      { lat: 40.7614, lng: -73.9776 },
    ],
  };
}
