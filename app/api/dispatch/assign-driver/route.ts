import { NextResponse } from "next/server";
import { z } from "zod";
import { assignDriverToRequest } from "@/features/marketplace/supabase-repository";
import { assignDemoDriver } from "@/features/tow-requests/demo-repository";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  const supabase = createServerSupabaseClient();
  if (getBackendMode().services.supabase && supabase) {
    try {
      const assignment = await assignDriverToRequest(supabase, parsed.data);
      return NextResponse.json({ ok: true, backendProvider: "supabase", assignment });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Could not assign provider" }, { status: 500 });
    }
  }

  const updated = assignDemoDriver(parsed.data.towRequestId, parsed.data.driverId);
  return NextResponse.json({ ok: true, assignment: updated ?? { towRequestId: parsed.data.towRequestId, driverId: parsed.data.driverId, mode: "demo" } });
}
