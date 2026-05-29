import { afterEach, describe, expect, it } from 'vitest';
import { createBrowserSupabaseClient } from './client';

const originalEnv = { ...process.env };

describe('createBrowserSupabaseClient', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('creates a browser auth client when Supabase env is present even if Stripe or Mapbox are still demo-mode', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    process.env.DATABASE_URL = 'postgresql://example';
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    expect(createBrowserSupabaseClient()).not.toBeNull();
  });
});
