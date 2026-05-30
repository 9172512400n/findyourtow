import { describe, expect, it } from "vitest";
import { getBackendMode } from "./backend-mode";

describe("getBackendMode", () => {
  it("keeps RoadAssistNow in demo mode when production keys are missing", () => {
    const mode = getBackendMode({});

    expect(mode.demoMode).toBe(true);
    expect(mode.missingServices).toEqual(["supabase", "stripe", "mapbox"]);
    expect(mode.safeForPublicPrototype).toBe(true);
  });

  it("reports real backend readiness only when every required public/private service is configured", () => {
    const mode = getBackendMode({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service",
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_123",
      NEXT_PUBLIC_MAPBOX_TOKEN: "pk.mapbox",
      DATABASE_URL: "postgres://example",
    });

    expect(mode.demoMode).toBe(false);
    expect(mode.missingServices).toEqual([]);
  });

  it("runs the marketplace on Supabase even before Stripe and Mapbox are connected", () => {
    const mode = getBackendMode({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service",
      DATABASE_URL: "postgres://example",
    });

    expect(mode.services.supabase).toBe(true);
    expect(mode.canPersistTowRequests).toBe(true);
    expect(mode.canUseMarketplaceBackend).toBe(true);
    expect(mode.marketplaceMode).toBe("supabase");
    expect(mode.paymentMode).toBe("demo");
    expect(mode.demoMode).toBe(false);
    expect(mode.missingServices).toEqual(["stripe", "mapbox"]);
  });

});
