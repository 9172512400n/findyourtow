# RoadAssistNow Auth + Payment Required Dispatch Design

## Decision
RoadAssistNow service orders must work like Uber: a customer cannot place a service order unless they are logged in and have a saved/default payment method ready for authorization. Guest service requests are not allowed.

## Current Problem
The current customer request flow still contains guest-order behavior:

- `/request` can be opened without a real customer session.
- The confirmation step says "No account required."
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

## Backend Enforcement
The UI gate is not enough. Server-side APIs must enforce the same rule:

- Unauthenticated request creation returns `401 UNAUTHORIZED`.
- Authenticated user without customer profile/payment method returns `402 PAYMENT_METHOD_REQUIRED` or equivalent app error.
- API must derive customer identity from the session/JWT, not from request body name/phone.
- API must derive pricing server-side, not trust client totals.
- Dispatch/matching cannot run unless payment authorization has succeeded.

## Implementation Strategy

### Phase 1 — Correct the product rule immediately
- Remove guest request language from the customer flow.
- Add auth-required gating to `/request` and request submission.
- Add payment-method-required gating before payment authorization/dispatch.
- Remove guest user creation from real persisted request creation.
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
- A logged-in user without a saved payment method cannot place a service order.
- The UI no longer says "No account required."
- Real request APIs reject unauthenticated or unpaid dispatch attempts.
- Provider matching starts only after payment authorization.
- Existing RoadAssistNow schema is preserved and extended instead of overwritten.

## Risks / Notes
- The uploaded backend is useful but incomplete for payments.
- Direct schema replacement would be risky and could break current pages/APIs.
- The safest path is incremental: auth/payment gate first, marketplace matching second.
