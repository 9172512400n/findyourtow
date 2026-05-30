import { describe, expect, it, vi } from "vitest";
import { saveDriverLocationPing } from "./live-location-service";

function createSupabaseInsertSpy() {
  const insert = vi.fn(() => ({ error: null }));
  const from = vi.fn((table: string) => {
    expect(table).toBe("driver_locations");
    return { insert };
  });
  return { supabase: { from }, from, insert };
}

describe("saveDriverLocationPing", () => {
  it("persists driver GPS pings to Supabase when a server client is supplied", async () => {
    const { supabase, insert } = createSupabaseInsertSpy();

    const ping = await saveDriverLocationPing("driver_123", { lat: 40.72, lng: -73.84 }, { supabase: supabase as never, heading: 180, speedMph: 28 });

    expect(ping.provider).toBe("supabase");
    expect(ping).toMatchObject({ driverId: "driver_123", location: { lat: 40.72, lng: -73.84 }, heading: 180, speedMph: 28 });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      driverId: "driver_123",
      lat: 40.72,
      lng: -73.84,
      heading: 180,
      speedMph: 28,
    }));
  });
});
