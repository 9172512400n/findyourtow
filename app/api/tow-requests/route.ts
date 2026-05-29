import { NextResponse } from "next/server";
import { createDemoTowRequest } from "@/features/tow-requests/demo-repository";
import { towRequestSchema } from "@/features/tow-requests/schemas";
import { createSupabaseTowRequest, listRecentSupabaseTowRequests } from "@/features/tow-requests/supabase-repository";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const mode = getBackendMode();
  const supabase = createServerSupabaseClient();

  if (mode.canPersistTowRequests && supabase) {
    try {
      return NextResponse.json({ backendProvider: "supabase", requests: await listRecentSupabaseTowRequests(supabase) });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Could not list tow requests" }, { status: 500 });
    }
  }

  return NextResponse.json({ backendProvider: "demo", requests: [] });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = towRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tow request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const mode = getBackendMode();
  const supabase = createServerSupabaseClient();

  if (mode.canPersistTowRequests && supabase) {
    try {
      return NextResponse.json(await createSupabaseTowRequest(supabase, parsed.data), { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save tow request" }, { status: 500 });
    }
  }

  return NextResponse.json(await createDemoTowRequest(parsed.data), { status: 201 });
}
