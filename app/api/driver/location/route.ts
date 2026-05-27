import { NextResponse } from "next/server";
import { z } from "zod";
import { saveDriverLocationPing } from "@/lib/realtime/live-location-service";

const locationPingSchema = z.object({
  driverId: z.string().min(3),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = locationPingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid driver location", issues: parsed.error.flatten() }, { status: 400 });
  }

  const ping = await saveDriverLocationPing(parsed.data.driverId, { lat: parsed.data.lat, lng: parsed.data.lng });
  return NextResponse.json(ping);
}
