import { NextResponse } from "next/server";
import { dispatchAssignmentSchema } from "@/features/marketplace/schemas";
import { assignDriverToRequest, listDispatchRequests, listMarketplaceDrivers } from "@/features/marketplace/supabase-repository";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", requests: [], drivers: [] });

  try {
    const [requests, drivers] = await Promise.all([listDispatchRequests(supabase), listMarketplaceDrivers(supabase)]);
    return NextResponse.json({ backendProvider: "supabase", requests, drivers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load dispatch data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = dispatchAssignmentSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid dispatch assignment", issues: parsed.error.flatten() }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", request: { ...parsed.data, status: "DRIVER_ASSIGNED" } });

  try {
    return NextResponse.json({ backendProvider: "supabase", request: await assignDriverToRequest(supabase, parsed.data) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not assign provider" }, { status: 500 });
  }
}
