# RoadAssistNow Real App Design

Date: 2026-05-30
Status: Draft for reviewed implementation
Owner: Nir / Emily

## Decision

Preserve the current investor presentation as a frozen demo link and build the real application from the same concept on a separate real-app link.

- Investor demo, keep stable: `https://roadassistnow-investor-demo.vercel.app`
- Real app work link: `https://roadassistnow-real-app.vercel.app`

The real app should keep the same brand, flow, and investor story, but replace demo-only behavior with durable customer, provider, dispatch, payment, and tracking systems.

## Product Goal

Build RoadAssistNow as a full roadside-assistance marketplace for an initial real service area, then expand. The first production milestone is not a brochure or prototype; it is a working loop:

1. Customer requests roadside help.
2. App captures location, vehicle, service type, destination when needed, and contact info.
3. App quotes and authorizes payment.
4. Backend saves the request, payment state, timeline, and customer profile.
5. Approved providers/drivers see jobs, accept or are assigned, and update status.
6. Customer and admin can track the job through completion.
7. Admin can approve providers, monitor jobs, support customers, and handle refunds/issues.

## Scope: First Real Market

Default first market: New York / Queens–Long Island corridor, unless Nir chooses a different launch area before implementation starts.

The system must be built so additional markets can be added later through service-area configuration, not hardcoded page rewrites.

## Architecture

Keep the current Next.js app as the production web app and API surface for MVP speed. Use existing boundaries so a future NestJS/backend extraction remains possible.

Core layers:

- **Frontend app:** Next.js App Router, mobile-first customer, driver, provider, and admin routes.
- **Backend API:** Next.js API routes for requests, dispatch, provider onboarding, driver jobs/location, payments, auth/admin support.
- **Database/auth:** Supabase Postgres + Supabase Auth, service-role server writes only where appropriate, RLS for user-owned reads/writes.
- **Payments:** Stripe-ready payment service. If Stripe live keys are absent, test/demo authorization must update real request/payment/timeline rows without customer-facing fake language.
- **Maps/location:** Mapbox/browser GPS for addresses, routes, distance, ETA, and eventually live driver position.
- **Realtime:** Start with persisted polling/reload-safe state. Prepare event/timeline model for Supabase Realtime or WebSocket upgrades.

## Data Model Contracts

Create one canonical contract for Supabase tables, route DTOs, and app types. Resolve current camelCase/snake_case and enum drift before UI expansion.

Minimum durable records:

- users/profiles with roles: customer, provider, driver, dispatcher, admin, super admin
- customer profiles and saved vehicles
- service types and pricing rules
- service areas / market coverage
- tow/service requests
- request timeline events
- provider companies/applications
- driver profiles, documents, trucks, availability
- job assignments/offers and accept/decline state
- driver location pings
- payments, refunds, and payment events
- admin audit logs

## Customer App Design

The customer side should feel like the current demo concept, but every step must produce real state.

Required flows:

- landing → request help CTA
- service type selection
- pickup location via GPS or address autocomplete
- destination step only when the selected service requires it
- vehicle selection/manual vehicle entry
- quote with line items and ETA language that is honest
- payment authorization/confirmation
- live request status page with timeline
- account/profile/vehicles/payment methods/history
- forgot password/login/register
- help/support and legal links

Production copy must avoid “demo,” “mock,” “sandbox,” and fake-provider language on public/customer surfaces.

## Provider and Driver App Design

Provider side must support the operational loop, not just a form.

Required flows:

- provider applies with business info, contact, truck/service capabilities, license/insurance placeholders/uploads where supported
- admin reviews and approves/rejects
- approved provider/driver can go online/offline
- driver sees eligible job offers/jobs
- driver accepts/declines jobs
- driver updates status: accepted, en route, arrived, towing/servicing, completed, cancelled/problem
- driver location endpoint persists latest pings
- earnings/job history page shows completed work and payout-ready data, even if Stripe Connect payouts come later

## Admin / Dispatch Design

Admin must be the control tower for the first market.

Required capabilities:

- secure admin login
- live/persisted dispatch board
- view new/active/completed/cancelled requests
- approve provider applications
- assign/reassign jobs to drivers
- see driver availability and latest location
- inspect request timeline and payment state
- customer/provider support actions, including password reset where already implemented
- pricing/service-area management path
- audit logs for sensitive actions

## Payment Design

Do not connect real live Stripe before request/payment state is reliable.

Payment phases:

1. **Real-state authorization mode:** save payment intent/authorization records in Supabase and advance request/timeline state. No customer-facing “demo payment” wording.
2. **Stripe test mode:** use Stripe Payment Intents with test keys and webhook verification.
3. **Stripe live mode:** only after end-to-end request, dispatch, refund, and support flows pass.

The payment service must keep test/demo/live behavior behind one adapter boundary so UI and dispatch do not branch all over the app.

## Error Handling and Safety

- Missing external env vars must not crash the app.
- Supabase configured mode must fail loudly in server logs/tests if schema writes drift.
- Customer sees simple recovery: retry, contact support, or continue saved request.
- Never expose service role keys, Stripe secrets, or internal stack traces to the browser.
- Legal/public copy must avoid trade-dress/copycat risk and use original RoadAssistNow language.
- Demo investor link remains untouched unless explicitly refreshed.

## Testing and Verification

Before each meaningful deploy:

- `git diff --check`
- repository/unit tests for Supabase request, marketplace, payment, pricing, auth, location
- `npm run lint`
- `npm run build`
- production/real-app smoke checks for key routes
- grep/curl checks to ensure no customer-facing demo/mock language leaks into real-app pages

Acceptance for “full app” milestone:

- New customer request persists in Supabase.
- Request has payment state and timeline rows.
- Admin can see and assign the request.
- Approved driver can accept and update status.
- Customer tracking reflects persisted status reload-safe.
- Provider/admin/customer core routes are production-safe and mobile usable.
- Investor demo alias still points to the preserved demo deployment.

## Implementation Sequence

1. Freeze/verify investor demo alias and document it.
2. Stabilize Supabase schema and contracts.
3. Make customer request persistence canonical.
4. Wire payment state to persisted request timeline.
5. Wire provider application, approval, availability, job assignment, and driver status updates.
6. Polish customer/provider/admin UX to remove demo feel while keeping the concept.
7. Add regression tests, smoke checks, and deploy real-app alias.
