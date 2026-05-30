import { NextResponse } from "next/server";
import { driverJobStatusSchema } from "@/features/marketplace/schemas";
import { listDriverJobs, updateDriverJobStatus } from "@/features/marketplace/supabase-repository";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", jobs: [] });

  const driverId = new URL(request.url).searchParams.get("driverId") ?? undefined;
  try {
    return NextResponse.json({ backendProvider: "supabase", jobs: await listDriverJobs(supabase, driverId) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load driver jobs" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = driverJobStatusSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid job status update", issues: parsed.error.flatten() }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!getBackendMode().services.supabase || !supabase) return NextResponse.json({ backendProvider: "demo", job: parsed.data });

  try {
    return NextResponse.json({ backendProvider: "supabase", job: await updateDriverJobStatus(supabase, parsed.data) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update job" }, { status: 500 });
  }
}
