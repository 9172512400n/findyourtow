import { createClient } from "@supabase/supabase-js";
import { getBackendMode } from "@/lib/runtime/backend-mode";

// Browser-safe Supabase factory. It intentionally returns null in demo mode so the
// live prototype never breaks when Supabase env keys are missing.
export function createBrowserSupabaseClient() {
  const mode = getBackendMode();
  if (mode.demoMode || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
