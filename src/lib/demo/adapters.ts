type DemoMode = 'demo';

type AdapterResult<T extends object> = T & { mode: DemoMode };

/**
 * Keyless backend-ready adapter seams.
 * Replace each demo implementation later with Supabase Auth/Postgres/Storage,
 * Stripe + Apple Pay, Mapbox, Twilio, Resend, and Redis/WebSockets.
 * These adapters must never require env vars while the public demo is live.
 */
export const demoAdapters = {
  auth: {
    mode: 'demo' as const,
    async signIn(email: string): Promise<AdapterResult<{ userId: string; email: string }>> {
      return { mode: 'demo', userId: 'demo_user_nir', email };
    },
  },
  profile: {
    mode: 'demo' as const,
    async saveProfile(profile: Record<string, string>): Promise<AdapterResult<{ profile: Record<string, string> }>> {
      return { mode: 'demo', profile };
    },
  },
  vehicles: {
    mode: 'demo' as const,
    async uploadPhoto(fileName: string): Promise<AdapterResult<{ url: string }>> {
      return { mode: 'demo', url: `/demo-uploads/${fileName}` };
    },
  },
  payments: {
    mode: 'demo' as const,
    async createIntent(input: { amountCents: number }): Promise<AdapterResult<{ provider: 'demo-stripe'; id: string; status: 'authorized'; clientSecret: string; amountCents: number }>> {
      return { mode: 'demo', provider: 'demo-stripe', id: `pi_demo_${Date.now()}`, status: 'authorized', clientSecret: 'demo_client_secret_keyless', amountCents: input.amountCents };
    },
  },
  applePay: {
    mode: 'demo' as const,
    async prepareSession(): Promise<AdapterResult<{ provider: 'demo-apple-pay'; ready: true }>> {
      return { mode: 'demo', provider: 'demo-apple-pay', ready: true };
    },
  },
  database: {
    mode: 'demo' as const,
    async save(table: string, record: Record<string, unknown>): Promise<AdapterResult<{ table: string; record: Record<string, unknown> }>> {
      return { mode: 'demo', table, record };
    },
  },
  maps: {
    mode: 'demo' as const,
    async route(input: { pickup: string; dropoff?: string }): Promise<AdapterResult<{ provider: 'demo-mapbox'; miles: number; etaMinutes: number; polyline: string; pickup: string; dropoff?: string }>> {
      return { mode: 'demo', provider: 'demo-mapbox', miles: input.dropoff ? 7.8 : 2.4, etaMinutes: input.dropoff ? 24 : 11, polyline: 'demo-route-polyline', ...input };
    },
  },
  geocoding: {
    mode: 'demo' as const,
    async search(query: string): Promise<AdapterResult<{ provider: 'demo-geocoder'; results: string[] }>> {
      return { mode: 'demo', provider: 'demo-geocoder', results: [`${query} · Queens, NY`, `${query} · Nassau County, NY`, `${query} · Brooklyn, NY`] };
    },
  },
  dispatch: {
    mode: 'demo' as const,
    async match(requestId: string): Promise<AdapterResult<{ providerId: string; requestId: string; etaMinutes: number }>> {
      return { mode: 'demo', requestId, providerId: 'drv_marcus', etaMinutes: 6 };
    },
  },
  notifications: {
    mode: 'demo' as const,
    async send(input: { to: string; body: string }): Promise<AdapterResult<{ provider: 'demo-notification'; delivered: true; to: string; body: string }>> {
      return { mode: 'demo', provider: 'demo-notification', delivered: true, ...input };
    },
  },
  driverGps: {
    mode: 'demo' as const,
    async ping(driverId: string, location: { lat: number; lng: number }): Promise<AdapterResult<{ driverId: string; location: { lat: number; lng: number } }>> {
      return { mode: 'demo', driverId, location };
    },
  },
  uploads: {
    mode: 'demo' as const,
    async signedUrl(path: string): Promise<AdapterResult<{ uploadUrl: string; publicUrl: string }>> {
      return { mode: 'demo', uploadUrl: `/demo-upload/${path}`, publicUrl: `/demo-uploaded/${path}` };
    },
  },
} as const;
