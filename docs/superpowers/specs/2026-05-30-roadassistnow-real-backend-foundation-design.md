# RoadAssistNow Real Backend Foundation Design

Date: 2026-05-30
Status: Approved direction from Nir; implementation starts with Phase 1.

## Goal

Move RoadAssistNow from an advanced demo/PWA shell into a real marketplace foundation. Nir clarified the target: make everything real now except Stripe/payment, which remains demo/simulated until Stripe is connected. The first production slice must persist customer tow requests in Supabase, support real customer/provider/admin account records, expose real admin/dispatch data, and preserve the existing mobile-first PWA request flow. Payment UI and PaymentIntent/webhook behavior may stay simulated behind a clear internal adapter until Stripe keys are set.

## Scope for Phase 1

1. Keep the public request flow available to guests.
2. Persist real tow requests to Supabase when Supabase env vars are configured.
3. Use the existing demo repository only as a fallback when required backend env vars are missing.
4. Support customer identity linkage through Supabase-compatible user/profile/customer rows.
5. Keep admin/dispatcher surfaces reading real rows where available.
6. Persist real provider/driver records, provider service areas, jobs/assignments, and driver location updates where the current UI/API already exposes those concepts.
7. Record status timeline rows for request lifecycle visibility.
8. Keep only the payment area demo/simulated until Stripe is explicitly connected.
9. Add tests that prove configured Supabase mode uses real repository paths and demo fallback stays safe.

## Non-Goals for Phase 1

- No live card charging yet. Payment APIs may continue returning demo/simulated intents until Stripe is explicitly connected in the final Stripe phase.
- No native app rewrite. PWA remains the fastest path.
- No paid external SMS/push notification provider integration yet unless free/local hooks already exist.

## Architecture

The app keeps the current Next.js app/API architecture. API routes call backend service modules instead of writing directly to demo state. Backend mode detection decides whether Supabase is configured. When configured, server-side Supabase clients use the service role key for trusted API writes. Browser clients use anon key only.

Core boundaries:

- `src/lib/runtime/backend-mode.ts`: source of truth for configured services.
- `src/lib/supabase/server.ts`: trusted server Supabase client factory.
- `src/features/tow-requests/supabase-repository.ts`: real request persistence and reads.
- `src/features/tow-requests/demo-repository.ts`: fallback only.
- `app/api/tow-requests/route.ts`: chooses real repository when available.
- Admin/dispatch API routes: read Supabase data first when configured, otherwise demo data.
- Provider/driver API routes: persist provider accounts, availability, service areas, assignment state, and GPS updates in Supabase when configured.
- Payment adapter: remains simulated/demo until Stripe keys are set, but all non-payment state around the request is real.

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
7. Provider/driver actions write real assignment and location rows when configured.
8. Payment screens can show simulated authorization/confirmation, but must update real request status around that simulated payment milestone so the rest of the lifecycle is durable.

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
- Provider/driver repository tests proving service area, assignment, and GPS update persistence.
- API route tests proving configured Supabase mode uses Supabase repositories and unconfigured mode uses demo fallback.
- Payment adapter tests proving payment remains simulated when Stripe is absent while real request lifecycle state is still persisted.
- Existing request flow, pricing, vehicles, auth/admin tests remain passing.
- Gates before commit/deploy: `git diff --check`, `npx vitest run`, `npm run lint`, `npm run build`.

## Implementation Order

1. Audit current API/repository code and tests.
2. Fix any schema drift between Supabase migrations and repository service codes/statuses.
3. Wire request API route to Supabase repository when configured.
4. Wire admin/dispatch reads and status updates to Supabase when configured.
5. Wire provider/driver service area, assignment, and GPS endpoints to Supabase when configured.
6. Keep payment adapter demo/simulated, but connect it to real request lifecycle updates.
7. Add/adjust tests.
8. Run verification, commit to `main`, push, deploy production, smoke-test live routes.

## Later Phase

- Final Stripe phase: real Stripe PaymentIntents + webhook-confirmed payment status once Stripe account/keys are ready.
