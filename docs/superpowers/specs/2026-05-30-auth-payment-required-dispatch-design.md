# RoadAssistNow Auth + Payment Required Dispatch Design

## Decision
RoadAssistNow service orders must work like Uber: a customer cannot place a service order unless they are logged in and have a saved/default payment method ready for authorization. Guest service requests are not allowed.

This spec supersedes earlier guest-first/request-flow specs and implementation plans, including `2026-05-29-roadassistnow-guest-supabase-request-flow-design.md` and guest-compatible portions of `2026-05-30-roadassistnow-real-backend-foundation-design.md`. Those documents remain historical context only; this account/payment-required rule wins for all future work.

## Current Problem
The current customer request flow still contains guest-order behavior:

- `/request` can be opened without a real customer session.
- The confirmation step still used guest-checkout copy.
- The request API can create guest-style users from name/phone.
- Payment is shown as authorized in the UI before a real saved payment method gate exists.

That conflicts with the product rule Nir confirmed: account + payment setup are required before ordering service.

## Approved Direction
Use the uploaded `roadassistnow-backend` zip as a backend blueprint, not a direct replacement.

The zip makes sense architecturally because it includes:

- Supabase-authenticated request creation.
- Provider marketplace matching.
- Provider offers.
- Atomic first-provider acceptance.
- Provider status/location heartbeat.
- Request status state machine.
- Cron expiration and rebroadcast of stale offers.

But it should not be dropped in directly because it uses a different schema and status model than the current RoadAssistNow app:

| Area | Current RoadAssistNow | Uploaded backend zip |
| --- | --- | --- |
| Requests | `tow_requests` | `service_requests` |
| Providers | `drivers`, `tow_trucks`, `driver_locations` | `providers` |
| Offers | not fully modeled yet | `job_offers` |
| Statuses | `AWAITING_PAYMENT`, `PAID`, `DRIVER_ASSIGNED`, etc. | `pending_match`, `offered`, `assigned`, etc. |
| Payments | `payments` table + Stripe-oriented status enum | payment is TODO |

Hard guardrail: do not rename or replace existing core tables/enums with the uploaded backend names. Do not create a parallel production flow around `service_requests`/`providers` unless a later migration plan explicitly retires the existing schema. Any migration must preserve and extend the current `tow_requests`, `payments`, `drivers`, `tow_trucks`, `driver_locations`, and `tow_status_updates` model, with review before applying database changes.

## Target Customer Flow

1. Customer taps **Get Help Now** or opens `/request`.
2. App checks for an authenticated customer account.
3. If unauthenticated, route to login/register with return path: `/login?next=/request`.
4. After login, app checks for a saved/default payment method.
5. If no payment method exists, route to wallet setup: `/account/payments/add?next=/request`.
6. Only after account + payment setup can the customer enter the service request flow.
7. Customer selects service, pickup, destination when needed, vehicle, and quote.
8. Customer authorizes the payment hold.
9. Backend creates/updates the request into dispatch/searching status.
10. Provider matching begins only after authorization succeeds.

## Wallet / Saved Payment Model
The current `payments` table is request-level and stores PaymentIntent/payment status for a tow request. It is not a customer wallet by itself.

Add or formalize a customer wallet model before enforcing the payment gate in production. Recommended shape:

- `customers.stripeCustomerId` remains the Stripe Customer link.
- Add `customer_payment_methods` (or equivalent) with `id`, `customerId`, `stripePaymentMethodId`, `brand`, `last4`, `expMonth`, `expYear`, `billingZip`, `isDefault`, `createdAt`, `updatedAt`.
- Exactly one default payment method per customer should be supported.
- Checkout/authorization uses the authenticated customer's default `stripePaymentMethodId` to create a PaymentIntent hold.
- The existing `payments` table continues to store per-request authorization/capture/refund state linked to `tow_requests`.

Demo UI may still show demo wallet cards for presentation, but real persisted request creation must use the authenticated customer's stored Stripe payment method.

## Request Lifecycle Before Authorization
Quotes and UI drafts may exist client-side before authorization, but production dispatch rows must not enter provider search before payment authorization.

Allowed lifecycle:

- Client can compute/display a quote through `/api/quotes` with server-side pricing.
- If the backend creates a pre-auth row, it must be tied to the authenticated customer and remain `AWAITING_PAYMENT` only.
- `AWAITING_PAYMENT` rows are drafts/checkout records, not dispatchable jobs.
- After Stripe authorization succeeds, the request may move to `PAID`, then `SEARCHING_FOR_DRIVER`.
- Matching/offers/provider broadcast can only start from `PAID` or `SEARCHING_FOR_DRIVER` after a valid payment authorization record exists.
- No provider-facing offer may be created for an unpaid or guest request.

## Backend Enforcement
The UI gate is not enough. Server-side APIs must enforce the same rule:

- Validate the Supabase session/JWT before any service-role write.
- Unauthenticated request creation returns `401 UNAUTHORIZED`.
- Authenticated user must resolve to a `CUSTOMER` user/customer profile. Provider, dispatcher, admin, or unknown-role accounts cannot create customer service orders unless a later spec explicitly allows account switching.
- Authenticated user without customer profile/payment method returns `402 PAYMENT_METHOD_REQUIRED` or equivalent app error.
- API must derive `customerId` from the authenticated user/customer record, not from request body name/phone.
- API must ignore/reject forged customer identity fields. Customer name/phone can update the authenticated user's own profile/contact data only; it cannot select or create another customer.
- API must derive pricing server-side, not trust client totals.
- Dispatch/matching cannot run unless payment authorization has succeeded and the `payments` row for that request is in an authorized/succeeded state.
- Service-role Supabase clients may be used only after auth/role/payment checks pass.

## Implementation Strategy

### Phase 1 — Correct the product rule immediately
- Remove guest request language from the customer flow.
- Add auth-required gating to `/request` and request submission.
- Add payment-method-required gating before payment authorization/dispatch.
- Remove guest user creation from real persisted request creation.
- Replace any guest-compatible repository behavior in production paths with authenticated customer lookup.
- Keep demo fallback only for isolated demo mode, not real app behavior.

### Phase 2 — Adapt marketplace matching carefully
Use the uploaded backend as reference and adapt its concepts into the existing schema:

- Add an offer model compatible with current `drivers`/`tow_trucks` tables.
- Add nearest-driver matching using the current driver/location data model.
- Add atomic accept behavior, either via SQL function or transaction-safe API.
- Add provider status/location endpoints compatible with the current provider app.
- Add expiration/rebroadcast cron.

### Phase 3 — Payments and dispatch integration
- Create Stripe PaymentIntent authorization before matching.
- Store authorization in `payments`.
- Move request from `AWAITING_PAYMENT` to `PAID`/`SEARCHING_FOR_DRIVER` only after auth succeeds.
- Capture payment only after service completion.
- Keep refund/cancel hooks aligned with request state.

## Success Criteria
- A logged-out user cannot start a real service order.
- `/request` deep links redirect logged-out users to `/login?next=/request` or equivalent return-path behavior.
- A logged-in user without a saved/default payment method cannot place a service order and is routed to wallet setup.
- The UI no longer presents the request as guest checkout.
- Real request APIs reject unauthenticated requests with `401`.
- Real request APIs reject authenticated customer requests without a default payment method with `402 PAYMENT_METHOD_REQUIRED` or equivalent.
- Forged `customerName`, `phone`, `customerId`, or similar body fields cannot create/select another customer.
- Request creation derives customer identity from the authenticated session.
- Dispatch/matching endpoints reject unpaid `AWAITING_PAYMENT` requests.
- Provider matching starts only after payment authorization.
- Existing RoadAssistNow schema is preserved and extended instead of overwritten.

## Required Tests / Verification
- Unit/API test: logged-out `POST /api/tow-requests` returns `401` in real backend mode.
- Unit/API test: authenticated customer with no default payment method receives payment-required response.
- Unit/API test: forged identity fields do not affect `customerId` used for the request.
- Unit/API test: matching/dispatch cannot run for `AWAITING_PAYMENT` or missing-payment requests.
- UI/navigation test or direct inspection: `/request` logged-out deep link routes to login with `next=/request`.
- UI inspection: confirmation/payment copy reflects account + payment required, not guest checkout.

## Risks / Notes
- The uploaded backend is useful but incomplete for payments.
- Direct schema replacement would be risky and could break current pages/APIs.
- Prior guest-first specs are obsolete for production behavior after this decision.
- The safest path is incremental: auth/payment gate first, marketplace matching second.
