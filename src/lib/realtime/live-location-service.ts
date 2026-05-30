import type { Coordinate } from "@/features/tow-requests/types";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type DriverLocationPing = {
  driverId: string;
  location: Coordinate;
  heading?: number;
  speedMph?: number;
  sentAt: string;
  provider: "demo" | "supabase";
};

type SaveDriverLocationOptions = {
  supabase?: SupabaseClient | null;
  heading?: number;
  speedMph?: number;
};

export async function saveDriverLocationPing(driverId: string, location: Coordinate, options: SaveDriverLocationOptions = {}): Promise<DriverLocationPing> {
  const sentAt = new Date().toISOString();
  const supabase = options.supabase ?? (getBackendMode().services.supabase ? createServerSupabaseClient() : null);

  if (supabase) {
    const insert = await supabase.from("driver_locations").insert({
      id: crypto.randomUUID(),
      driverId,
      lat: location.lat,
      lng: location.lng,
      heading: options.heading ?? null,
      speedMph: options.speedMph ?? null,
      createdAt: sentAt,
    });
    if (insert.error) throw new Error(`Could not save driver location: ${insert.error.message}`);

    return {
      driverId,
      location,
      heading: options.heading,
      speedMph: options.speedMph,
      sentAt,
      provider: "supabase",
    };
  }

  return {
    driverId,
    location,
    heading: options.heading ?? 42,
    speedMph: options.speedMph ?? 21,
    sentAt,
    provider: "demo",
  };
}
