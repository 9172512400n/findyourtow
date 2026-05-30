# RoadAssistNow Real Backend Foundation Design

Date: 2026-05-30
Status: Approved direction from Nir; implementation starts with Phase 1.

## Goal

Move RoadAssistNow from an advanced demo/PWA shell into a real marketplace foundation. The first production slice must persist customer tow requests in Supabase, support real customer/provider/admin account records, and preserve the existing mobile-first PWA request flow. This phase intentionally does not add real Stripe charges, automated dispatch offers, or push notifications yet; it creates the durable backend surface those pieces need.

## Scope for Phase 1

1. Keep the public request flow available to guests.
2. Persist real tow requests to Supabase when Supabase env vars are configured.
3. Use the existing demo repository only as a fallback when required backend env vars are missing.
4. Support customer identity linkage through Supabase-compatible user/profile/customer rows.
5. Keep admin/dispatcher surfaces reading real rows where available.
6. Record status timeline rows for request lifecycle visibility.
7. Add tests that prove configured Supabase mode uses real repository paths and demo fallback stays safe.

## Non-Goals for Phase 1

- No live card charging yet. Payment APIs may continue returning demo/simulated intents until Stripe is explicitly connected in Phase 2.
- No automated driver offer/accept timeout loop yet. Manual/admin dispatch and matching seams stay in place.
- No native app rewrite. PWA remains the fastest path.
- No SMS/push notification provider integration yet.

## Architecture

The app keeps the current Next.js app/API architecture. API routes call backend service modules instead of writing directly to demo state. Backend mode detection decides whether Supabase is configured. When configured, server-side Supabase clients use the service role key for trusted API writes. Browser clients use anon key only.

Core boundaries:

- `src/lib/runtime/backend-mode.ts`: source of truth for configured services.
- `src/lib/supabase/server.ts`: trusted server Supabase client factory.
- `src/features/tow-requests/supabase-repository.ts`: real request persistence and reads.
- `src/features/tow-requests/demo-repository.ts`: fallback only.
- `app/api/tow-requests/route.ts`: chooses real repository when available.
- Admin/dispatch API routes: read Supabase data first when configured, otherwise demo data.

## Data Flow

1. Customer submits request from `/request`.
2. Client posts validated payload to `/api/tow-requests`.
3. API validates payload with existing schemas.
4. If Supabase is configured:
   - Normalize phone/email for guest-compatible identity.
   - Upsert user/profile/customer rows.
   - Calculate route estimate and quote.
   - Insert `tow_requests` row with vehicle snapshot, pickup/dropoff coordinates, quote, and status `AWAITING_PAYMENT`.
   - Insert `tow_status_updates` timeline row.
   - Return a normalized `TowTrip` response to the client.
5. If Supabase is not configured, use the existing demo repository fallback.
6. Admin/dispatcher views fetch recent Supabase tow requests when configured.

## Error Handling

- Validation errors return 400 with safe user-facing messages.
- Supabase insertion failures return 500 with sanitized messages and server logs.
- If timeline insertion fails after request insertion, delete the request row to avoid orphaned request state.
- Backend mode label remains visible internally so missing services are obvious.
- Public UX must not mention demo/sandbox wording.

## Testing

Minimum verification for Phase 1:

- Unit tests for backend mode selection.
- Supabase repository tests with mocked Supabase client proving user/profile/customer/request/timeline insert flow.
- API route tests proving configured Supabase mode uses the Supabase repository and unconfigured mode uses demo fallback.
- Existing request flow, pricing, vehicles, auth/admin tests remain passing.
- Gates before commit/deploy: `git diff --check`, `npx vitest run`, `npm run lint`, `npm run build`.

## Implementation Order

1. Audit current API/repository code and tests.
2. Fix any schema drift between Supabase migrations and repository service codes/statuses.
3. Wire API route to Supabase repository when configured.
4. Wire admin/dispatch reads to Supabase recent-request data when configured.
5. Add/adjust tests.
6. Run verification, commit to `main`, push, deploy production, smoke-test live routes.

## Later Phases

- Phase 2: Stripe PaymentIntents + webhook-confirmed payment status.
- Phase 3: Mapbox real geocoding/directions + map rendering.
- Phase 4: Driver GPS persistence and realtime subscriptions.
- Phase 5: Dispatch matching offer/accept/timeout loop.
- Phase 6: customer/provider/admin notifications.
