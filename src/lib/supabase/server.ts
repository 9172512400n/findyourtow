import { createClient } from "@supabase/supabase-js";
import { getBackendMode } from "@/lib/runtime/backend-mode";

// Server-side Supabase factory for future real writes to tow_requests, payments,
// driver_locations, and audit_logs. Demo mode returns null by design.
export function createServerSupabaseClient() {
  const mode = getBackendMode();
  if (!mode.services.supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
