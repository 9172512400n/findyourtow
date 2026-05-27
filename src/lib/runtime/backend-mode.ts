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
  safeForPublicPrototype: boolean;
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

  return {
    demoMode: missingServices.length > 0,
    safeForPublicPrototype: missingServices.length > 0,
    missingServices,
    services,
  };
}

export function getBackendModeLabel(env: BackendEnv = process.env as BackendEnv): string {
  const mode = getBackendMode(env);
  return mode.demoMode ? `Advanced demo mode: missing ${mode.missingServices.join(", ")}` : "Production backend configured";
}
