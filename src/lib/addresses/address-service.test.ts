import { describe, expect, it, vi } from "vitest";
import { searchUsAddresses, getCurrentPositionAddress } from "./address-service";

describe("address service", () => {
  it("returns clearly labeled demo/offline USA suggestions when Mapbox is unavailable", async () => {
    const results = await searchUsAddresses("sample");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].country).toBe("US");
    expect(results[0].source).toBe("demo-offline");
    expect(results[0].label).toMatch(/demo/i);
  });

  it("keeps offline demo suggestions free of the owner's real address samples", async () => {
    const results = await searchUsAddresses("", { limit: 10 });
    const rendered = results.map((result) => `${result.label} ${result.address}`).join(" ");

    expect(rendered).not.toMatch(/piermont|hewlett|oceanside|reina|lincoln|healy|waverly|far rockaway/i);
  });

  it("uses a US constrained Mapbox geocoding request when a token is supplied", async () => {
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        features: [{ id: "addr.1", place_name: "7148 Pixel Pkwy, Demo Springs, CA 90000, United States", center: [-73.6318, 40.7132] }],
      }),
    })) as unknown as typeof fetch;

    const results = await searchUsAddresses("7148 Pixel Pkwy", { token: "pk.test", fetcher });

    expect(String(fetcher.mock.calls[0][0])).toContain("country=US");
    expect(results[0]).toMatchObject({ source: "mapbox", address: "7148 Pixel Pkwy, Demo Springs, CA 90000, United States" });
  });

  it("reports unavailable current phone location without throwing", async () => {
    const result = await getCurrentPositionAddress({ geolocation: undefined });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not available/i);
  });
});
