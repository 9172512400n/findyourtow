import { describe, expect, it, vi } from "vitest";
import { searchUsAddresses, getCurrentPositionAddress } from "./address-service";

describe("address service", () => {
  it("returns clearly labeled demo/offline USA suggestions when Mapbox is unavailable", async () => {
    const results = await searchUsAddresses("healy");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].country).toBe("US");
    expect(results[0].source).toBe("demo-offline");
    expect(results[0].label).toMatch(/demo/i);
  });

  it("uses a US constrained Mapbox geocoding request when a token is supplied", async () => {
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        features: [{ id: "addr.1", place_name: "350 5th Ave, New York, NY 10118, United States", center: [-73.9857, 40.7484] }],
      }),
    })) as unknown as typeof fetch;

    const results = await searchUsAddresses("350 5th", { token: "pk.test", fetcher });

    expect(String(fetcher.mock.calls[0][0])).toContain("country=US");
    expect(results[0]).toMatchObject({ source: "mapbox", address: "350 5th Ave, New York, NY 10118, United States" });
  });

  it("reports unavailable current phone location without throwing", async () => {
    const result = await getCurrentPositionAddress({ geolocation: undefined });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not available/i);
  });
});
