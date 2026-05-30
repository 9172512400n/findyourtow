export type BackendEnv = Partial<Record<
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "DATABASE_URL"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  | "NEXT_PUBLIC_MAPBOX_TOKEN",
  string | undefined
>>;

export type BackendMode = {
  demoMode: boolean;
  productionReady: boolean;
  safeForPublicPrototype: boolean;
  canPersistTowRequests: boolean;
  canUseMarketplaceBackend: boolean;
  marketplaceMode: "supabase" | "demo";
  paymentMode: "stripe" | "demo";
  mapsMode: "mapbox" | "demo";
  missingServices: Array<"supabase" | "stripe" | "mapbox">;
  services: {
    supabase: boolean;
    stripe: boolean;
    mapbox: boolean;
  };
};

export function getBackendMode(env: BackendEnv = process.env as BackendEnv): BackendMode {
  const services = {
    supabase: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY && env.DATABASE_URL),
    stripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    mapbox: Boolean(env.NEXT_PUBLIC_MAPBOX_TOKEN),
  };
  const missingServices = (Object.entries(services) as Array<[keyof typeof services, boolean]>)
    .filter(([, configured]) => !configured)
    .map(([service]) => service);
  const productionReady = missingServices.length === 0;

  return {
    // Deprecated compatibility flag: this now means the core marketplace is
    // still local/demo. Missing Stripe should not force request, provider,
    // dispatch, or location flows back into demo once Supabase is configured.
    demoMode: !services.supabase,
    productionReady,
    safeForPublicPrototype: !productionReady,
    canPersistTowRequests: services.supabase,
    canUseMarketplaceBackend: services.supabase,
    marketplaceMode: services.supabase ? "supabase" : "demo",
    paymentMode: services.stripe ? "stripe" : "demo",
    mapsMode: services.mapbox ? "mapbox" : "demo",
    missingServices,
    services,
  };
}

export function getBackendModeLabel(env: BackendEnv = process.env as BackendEnv): string {
  const mode = getBackendMode(env);
  if (mode.productionReady) return "Production backend configured";
  if (mode.canUseMarketplaceBackend) {
    const notes = [mode.paymentMode === "demo" ? "payment pending Stripe" : null, mode.mapsMode === "demo" ? "fallback maps" : null].filter(Boolean).join(" · ");
    return notes ? `Real marketplace backend · ${notes}` : "Real marketplace backend";
  }
  return `Advanced demo mode: missing ${mode.missingServices.join(", ")}`;
}
