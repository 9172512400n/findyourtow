import { NextResponse } from "next/server";
import { z } from "zod";
import { assignDemoDriver } from "@/features/tow-requests/demo-repository";

const assignDriverSchema = z.object({
  towRequestId: z.string().min(3),
  driverId: z.string().min(3),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = assignDriverSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assignment", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Demo assignment endpoint. Real mode will update tow_requests.driver_id,
  // insert a tow_status_updates row, and publish a realtime job offer.
  const updated = assignDemoDriver(parsed.data.towRequestId, parsed.data.driverId);
  return NextResponse.json({ ok: true, assignment: updated ?? { towRequestId: parsed.data.towRequestId, driverId: parsed.data.driverId, mode: "demo" } });
}
