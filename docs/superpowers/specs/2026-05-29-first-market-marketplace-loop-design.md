# First-Market Marketplace Loop Design

## Goal
Turn RoadAssistNow from an advanced demo into an operating first-market slice: real customer requests, real provider onboarding, admin approval/manual dispatch, provider job actions, and customer-visible status tracking backed by Supabase when configured.

## Approach
Use the existing Next.js App Router and Supabase service-role server seam. Keep demo fallbacks public-safe, but when Supabase env vars exist, write operational marketplace records to `users`, `profiles`, `drivers`, `tow_trucks`, `tow_requests`, and `tow_status_updates`.

## Core Flow
1. Customer submits a request through the existing request flow; the request persists to Supabase and starts at `AWAITING_PAYMENT`.
2. Provider submits onboarding details from `/driver/onboarding`; the app creates a `DRIVER` user, profile, pending driver row, and tow truck service capabilities.
3. Admin sees pending/approved drivers and active customer requests in dispatch screens.
4. Admin approves a driver and manually assigns a driver to a request. Assignment moves the request to `DRIVER_ASSIGNED` and records a timeline event.
5. Driver sees assigned jobs and can advance status through accepted/en route, arrived, picked up, in transit, delivered/completed.
6. Customer/admin tracking reads the same persisted status and timeline.

## Boundaries
- `src/features/marketplace/*`: validation, status transition rules, and Supabase repository for provider onboarding/dispatch/job status.
- `app/api/drivers/onboarding`: provider application create/list endpoint.
- `app/api/admin/drivers`: admin approval/list endpoint.
- `app/api/admin/dispatch`: manual assignment endpoint.
- `app/api/driver/jobs`: driver job list/status update endpoint.
- UI pages call these APIs and keep existing demo content as fallback when backend data is unavailable.

## First Version Constraint
Manual dispatch only. No automatic matching, live GPS, payments capture, or Stripe Connect payouts in this slice. Those come after the marketplace loop is verified with real rows.

## Testing
Use TDD: first pure workflow tests for validation/status mapping, then repository/API helper tests, then UI smoke tests for the provider onboarding/admin dispatch surfaces.
