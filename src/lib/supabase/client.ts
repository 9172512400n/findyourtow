import { createClient } from "@supabase/supabase-js";

// Browser-safe Supabase factory. Auth only needs the public Supabase URL and anon
// key, so it must keep working even while Stripe/Mapbox remain demo-mode.
export function createBrowserSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
