import { NextResponse } from "next/server";
import { providerApplicationSchema } from "@/features/marketplace/schemas";
import { createProviderApplication, listMarketplaceDrivers } from "@/features/marketplace/supabase-repository";
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

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = providerApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid provider application", issues: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) {
    return NextResponse.json({ backendProvider: "demo", driver: { ...parsed.data, id: crypto.randomUUID(), status: "PENDING_APPROVAL" } }, { status: 201 });
  }

  try {
    return NextResponse.json({ backendProvider: "supabase", driver: await createProviderApplication(supabase, parsed.data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not submit provider application" }, { status: 500 });
  }
}
