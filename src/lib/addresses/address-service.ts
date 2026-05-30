export type AddressSuggestion = {
  id: string;
  label: string;
  address: string;
  lat?: number;
  lng?: number;
  country: "US";
  source: "mapbox" | "demo-offline";
};

type SearchOptions = {
  token?: string;
  fetcher?: typeof fetch;
  limit?: number;
};

type CurrentLocationOptions = {
  token?: string;
  fetcher?: typeof fetch;
  geolocation?: Geolocation;
};

const demoUsAddresses: AddressSuggestion[] = [
  { id: "offline-queens-auto", label: "Offline match · Queens Auto Care", address: "125-10 Queens Blvd, Queens, NY 11375, United States", lat: 40.7214, lng: -73.6242, country: "US", source: "demo-offline" },
  { id: "offline-northern-blvd", label: "Offline match · Northern Blvd Tire & Auto", address: "71-08 Northern Blvd, Jackson Heights, NY 11372, United States", lat: 40.7132, lng: -73.6318, country: "US", source: "demo-offline" },
  { id: "offline-atlantic", label: "Offline match · Brooklyn Tow Yard", address: "1200 Atlantic Ave, Brooklyn, NY 11216, United States", lat: 40.7358, lng: -73.642, country: "US", source: "demo-offline" },
  { id: "offline-jfk", label: "Offline match · JFK Airport Cell Lot", address: "Lefferts Blvd, Queens, NY 11430, United States", lat: 40.7486, lng: -73.6123, country: "US", source: "demo-offline" },
  { id: "offline-garden-city", label: "Offline match · Nassau Roadside Center", address: "400 Old Country Rd, Garden City, NY 11530, United States", lat: 40.6991, lng: -73.6551, country: "US", source: "demo-offline" },
];

function configuredToken(explicit?: string) {
  return explicit || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

export async function searchUsAddresses(query: string, options: SearchOptions = {}): Promise<AddressSuggestion[]> {
  const normalized = query.trim();
  const token = configuredToken(options.token);
  const fetcher = options.fetcher ?? globalThis.fetch;
  if (normalized.length >= 3 && token && fetcher) {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(normalized)}.json`);
    url.searchParams.set("access_token", token);
    url.searchParams.set("country", "US");
    url.searchParams.set("types", "address,poi,place,postcode,locality,neighborhood");
    url.searchParams.set("autocomplete", "true");
    url.searchParams.set("limit", String(options.limit ?? 5));
    const response = await fetcher(url.toString());
    if (response.ok) {
      const body = await response.json() as { features?: Array<{ id: string; place_name: string; center?: [number, number] }> };
      const features = body.features ?? [];
      if (features.length) {
        return features.map((feature) => ({
          id: feature.id,
          label: feature.place_name,
          address: feature.place_name,
          lng: feature.center?.[0],
          lat: feature.center?.[1],
          country: "US" as const,
          source: "mapbox" as const,
        }));
      }
    }
  }

  const haystack = normalized.toLowerCase();
  return demoUsAddresses
    .filter((item) => !haystack || `${item.label} ${item.address}`.toLowerCase().includes(haystack))
    .slice(0, options.limit ?? 5);
}

export async function reverseGeocodeUs(lat: number, lng: number, options: SearchOptions = {}): Promise<AddressSuggestion | null> {
  const token = configuredToken(options.token);
  const fetcher = options.fetcher ?? globalThis.fetch;
  if (!token || !fetcher) {
    return { id: "current-offline", label: "Offline match · Current location", address: "Current location · Queens, NY, United States", lat, lng, country: "US", source: "demo-offline" };
  }
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("country", "US");
  url.searchParams.set("types", "address,poi,place");
  url.searchParams.set("limit", "1");
  const response = await fetcher(url.toString());
  if (!response.ok) return null;
  const body = await response.json() as { features?: Array<{ id: string; place_name: string }> };
  const feature = body.features?.[0];
  if (!feature) return null;
  return { id: feature.id, label: feature.place_name, address: feature.place_name, lat, lng, country: "US", source: "mapbox" };
}

export async function getCurrentPositionAddress(options: CurrentLocationOptions = {}): Promise<{ ok: true; suggestion: AddressSuggestion } | { ok: false; error: string }> {
  const geolocation = options.geolocation ?? (typeof navigator !== "undefined" ? navigator.geolocation : undefined);
  if (!geolocation) return { ok: false, error: "Current phone location is not available on this device." };

  return new Promise((resolve) => {
    geolocation.getCurrentPosition(
      async (position) => {
        const suggestion = await reverseGeocodeUs(position.coords.latitude, position.coords.longitude, options);
        if (suggestion) resolve({ ok: true, suggestion });
        else resolve({ ok: false, error: "We could not find a US address for this location." });
      },
      () => resolve({ ok: false, error: "Location permission was denied or unavailable." }),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 },
    );
  });
}
