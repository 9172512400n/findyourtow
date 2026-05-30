import type { Coordinate } from "@/features/tow-requests/types";

export type RouteEstimate = {
  pickup: Coordinate;
  dropoff: Coordinate;
  distanceMiles: number;
  etaMinutes: number;
  route: Coordinate[];
  provider: "demo" | "mapbox";
};

type EstimateRouteOptions = {
  token?: string;
  fetcher?: typeof fetch;
};

const metersPerMile = 1609.344;

function configuredToken(explicit?: string) {
  return explicit || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

export async function estimateRoute(pickupAddress: string, dropoffAddress?: string, options: EstimateRouteOptions = {}): Promise<RouteEstimate> {
  const token = configuredToken(options.token);
  const fetcher = options.fetcher ?? globalThis.fetch;
  if (!token || !fetcher) {
    return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);
  }

  try {
    const pickup = await geocodeAddress(pickupAddress, token, fetcher);
    const dropoff = dropoffAddress ? await geocodeAddress(dropoffAddress, token, fetcher) : pickup;
    if (!pickup || !dropoff) return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);

    const directionsUrl = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}`);
    directionsUrl.searchParams.set("access_token", token);
    directionsUrl.searchParams.set("geometries", "geojson");
    directionsUrl.searchParams.set("overview", "full");
    const response = await fetcher(directionsUrl.toString());
    if (!response.ok) return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);
    const body = await response.json() as { routes?: Array<{ distance?: number; duration?: number; geometry?: { coordinates?: Array<[number, number]> } }> };
    const route = body.routes?.[0];
    if (!route?.distance || !route?.duration) return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);

    return {
      pickup,
      dropoff,
      distanceMiles: Number((route.distance / metersPerMile).toFixed(2)),
      etaMinutes: Math.max(1, Math.round(route.duration / 60)),
      provider: "mapbox",
      route: (route.geometry?.coordinates ?? [[pickup.lng, pickup.lat], [dropoff.lng, dropoff.lat]]).map(([lng, lat]) => ({ lat, lng })),
    };
  } catch {
    return buildDemoRoute(Boolean(dropoffAddress), pickupAddress);
  }
}

async function geocodeAddress(address: string, token: string, fetcher: typeof fetch): Promise<Coordinate | null> {
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("country", "US");
  url.searchParams.set("types", "address,poi,place,postcode,locality,neighborhood");
  url.searchParams.set("limit", "1");
  const response = await fetcher(url.toString());
  if (!response.ok) return null;
  const body = await response.json() as { features?: Array<{ center?: [number, number] }> };
  const center = body.features?.[0]?.center;
  return center ? { lat: center[1], lng: center[0] } : null;
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
