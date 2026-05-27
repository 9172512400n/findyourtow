import { NextResponse } from "next/server";
import { createDemoTowRequest } from "@/features/tow-requests/demo-repository";
import { towRequestSchema } from "@/features/tow-requests/schemas";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = towRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tow request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const mode = getBackendMode();
  const supabase = createServerSupabaseClient();

  if (!mode.demoMode && supabase) {
    // Future real backend path:
    // - Insert into tow_requests with vehicle/location/service/quote fields.
    // - Insert initial tow_status_updates rows.
    // - Return the persisted request + quote + current timeline.
    // For now, keep the public app safe by falling through to demo behavior until credentials are intentionally connected.
  }

  return NextResponse.json(await createDemoTowRequest(parsed.data), { status: 201 });
}
