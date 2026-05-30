import { describe, expect, it, vi } from "vitest";
import { estimateRoute } from "./mapbox-service";

describe("estimateRoute", () => {
  it("uses real Mapbox geocoding and directions when a token is supplied even if Stripe is absent", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.includes("geocoding") && url.includes("Pickup")) {
        return { ok: true, json: async () => ({ features: [{ center: [-73.85, 40.72] }] }) };
      }
      if (url.includes("geocoding") && url.includes("Dropoff")) {
        return { ok: true, json: async () => ({ features: [{ center: [-73.91, 40.76] }] }) };
      }
      if (url.includes("directions")) {
        return { ok: true, json: async () => ({ routes: [{ distance: 16093.4, duration: 1800, geometry: { coordinates: [[-73.85, 40.72], [-73.91, 40.76]] } }] }) };
      }
      throw new Error(`Unexpected URL ${url}`);
    }) as unknown as typeof fetch;

    const route = await estimateRoute("Pickup", "Dropoff", { token: "pk.mapbox", fetcher });

    expect(route.provider).toBe("mapbox");
    expect(route.distanceMiles).toBeCloseTo(10, 1);
    expect(route.etaMinutes).toBe(30);
    expect(route.pickup).toEqual({ lat: 40.72, lng: -73.85 });
    expect(route.dropoff).toEqual({ lat: 40.76, lng: -73.91 });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
