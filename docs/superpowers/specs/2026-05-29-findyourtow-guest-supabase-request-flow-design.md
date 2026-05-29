# FindYourTow Guest Supabase Request Flow Design

## Goal
Turn FindYourTow’s tow-request submission from demo-only behavior into a real Supabase-backed flow while preserving the emergency-friendly guest experience. Customers should be able to request help with only name, phone, pickup/dropoff, service, and vehicle details. Login remains optional.

## UX Decision
Use a guest-first flow. Requiring login before emergency towing creates friction at the worst moment. The app will accept name + phone, create or reuse a guest customer profile server-side, save the tow request, create an initial timeline/status record, and return the same response shape the UI already expects.

## Architecture
Add a real repository path behind `app/api/tow-requests/route.ts` when Supabase is configured. Keep demo fallback when Supabase is unavailable. Avoid requiring Stripe/Mapbox for the first real persistence milestone; Supabase readiness alone is enough for real request saving.

Key units:
- `backend-mode`: distinguish per-service readiness instead of blocking Supabase because Stripe/Mapbox are missing.
- `supabase tow request repository`: validates service mapping, computes route/quote with existing services, upserts guest user/customer records, inserts `tow_requests`, inserts `tow_status_updates`, and returns a `TowTrip`.
- `tow-requests API route`: route to Supabase repository when Supabase is configured, otherwise demo repository.

## Data Flow
1. Client posts existing `TowRequestInput`.
2. Server validates with `towRequestSchema`.
3. Route estimate comes from current `estimateRoute` adapter. It can still return demo distance until real Mapbox is connected.
4. Quote comes from existing pricing engine/API rules.
5. Server finds active `service_types` row matching the requested service code.
6. Server creates/reuses a guest `users` row by normalized phone/email surrogate and a matching `customers` row.
7. Server inserts `tow_requests` with vehicle snapshot, addresses, coordinates, quote totals, and status.
8. Server inserts an initial `tow_status_updates` row.
9. Server returns the saved trip with request ID and timeline.

## Error Handling
- Invalid payload: 400 with validation issues.
- Supabase configured but insert fails: 500 with safe error text, no secrets.
- Unknown service type: 400/500 depending on whether seed data is missing.
- Demo mode remains available for local/public prototype without env vars.

## Testing
Add unit tests for backend-mode service readiness and the API/repository seam where practical. Verify with targeted tests, full Vitest, lint, build, and a production deploy smoke check.
