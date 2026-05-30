import { NextResponse } from "next/server";
import { driverApprovalSchema } from "@/features/marketplace/schemas";
import { listMarketplaceDrivers, updateDriverApproval } from "@/features/marketplace/supabase-repository";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", drivers: [] });

  try {
    return NextResponse.json({ backendProvider: "supabase", drivers: await listMarketplaceDrivers(supabase) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not list providers" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = driverApprovalSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid approval update", issues: parsed.error.flatten() }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", driver: parsed.data });

  try {
    return NextResponse.json({ backendProvider: "supabase", driver: await updateDriverApproval(supabase, parsed.data) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update provider" }, { status: 500 });
  }
}
