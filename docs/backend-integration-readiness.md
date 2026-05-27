# Backend Integration Readiness

FindYourTow now runs as a complete advanced demo prototype while keeping clean seams for Supabase, Stripe, Mapbox, Redis/WebSockets, and future NestJS services.

## Current Mode

The live app intentionally stays in **advanced demo mode** unless all required env vars are present. Missing keys will not break the production build or public prototype.

Demo mode includes:

- Simulated customer/driver/admin data
- Simulated tow requests saved in safe server memory during the request lifecycle
- Simulated Stripe PaymentIntent responses
- Simulated Mapbox route, mileage, ETA, markers, and route line
- Simulated driver GPS endpoint and browser location request
- Backend readiness badge on app routes

## Future Env Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Realtime / future backend
REDIS_URL=
```

## Backend Seams

- `src/lib/runtime/backend-mode.ts` decides whether the app runs demo or configured mode.
- `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` return `null` in demo mode and real clients after envs are set.
- `src/lib/stripe/payment-service.ts` creates demo payment intents now and real Stripe intents later.
- `src/lib/mapbox/mapbox-service.ts` returns demo route estimates now and is the future Mapbox geocoding/directions adapter.
- `src/lib/realtime/live-location-service.ts` accepts driver GPS pings now and is the future Redis/WebSocket broadcast point.
- `src/features/tow-requests/demo-repository.ts` simulates tow request persistence, payment status, matching, and timeline state.

## Migrations

- Prisma/Postgres schema: `prisma/schema.prisma`
- Prisma SQL migration scaffold: `prisma/migrations/20260527152000_findyourtow_backend_ready/migration.sql`
- Supabase RLS scaffold: `supabase/migrations/20260527152500_findyourtow_rls_policies.sql`

## Future Connection Phases

### Phase 1: Supabase Auth + Database

1. Create Supabase project.
2. Apply `prisma/migrations/20260527152000_findyourtow_backend_ready/migration.sql` or use Prisma migrations.
3. Apply `supabase/migrations/20260527152500_findyourtow_rls_policies.sql`.
4. Add auth role claims for `customer`, `driver`, `dispatcher`, `admin`.
5. Replace demo repository writes in `app/api/tow-requests/route.ts` with Supabase inserts.

### Phase 2: Stripe Test Payments

1. Add Stripe test keys and webhook secret.
2. Connect `/api/payments/create-intent` to real tow request rows.
3. Verify webhook signatures in `/api/stripe/webhook`.
4. Update `payments.status` and `tow_requests.status` to `PAID` before dispatch.

### Phase 3: Mapbox Real Routing

1. Add `NEXT_PUBLIC_MAPBOX_TOKEN`.
2. Replace demo route in `src/lib/mapbox/mapbox-service.ts` with Geocoding + Directions API.
3. Use returned miles/duration for pricing engine.
4. Render real Mapbox GL map in `MapExperience`.

### Phase 4: Driver Live GPS

1. Persist `/api/driver/location` pings to `driver_locations`.
2. Broadcast updates through Redis/Socket.io or Supabase Realtime.
3. Subscribe customer tracking and admin dispatch map to location channels.

### Phase 5: Dispatch Logic

1. Use indexed `driver_locations`, driver status, and supported services for closest-driver matching.
2. Write job offers and accept/decline records.
3. Offer to next closest driver after decline/timeout.
4. Allow admin manual assignment and audit every admin action.
