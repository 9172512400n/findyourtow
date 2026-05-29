# FindYourTow Guest Supabase Request Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist guest-first tow requests to Supabase while keeping demo fallback and live admin visibility.

**Architecture:** Treat Supabase readiness independently from Stripe/Mapbox. Add a focused Supabase repository for guest customer upsert, request insert, status insert, and recent request listing. Keep the UI emergency-first by collecting name/phone in the confirm sheet and submitting the real API before tracking.

**Tech Stack:** Next.js 16, React 19, Supabase JS, Zustand, Vitest, TypeScript.

---

### Task 1: Backend readiness and mapping tests
**Files:**
- Modify: `src/lib/runtime/backend-mode.ts`
- Test: `src/lib/runtime/backend-mode.test.ts`
- Create/Test: `src/features/tow-requests/supabase-repository.test.ts`
- Create: `src/features/tow-requests/supabase-repository.ts`

- [ ] Add failing tests proving Supabase can be enabled without Stripe/Mapbox and service ids map to DB enum codes.
- [ ] Run targeted tests and verify RED.
- [ ] Implement readiness helper + mapping helpers.
- [ ] Run targeted tests and verify GREEN.

### Task 2: Supabase create/list repository
**Files:**
- Modify: `src/features/tow-requests/supabase-repository.ts`
- Modify: `app/api/tow-requests/route.ts`
- Test: `src/features/tow-requests/supabase-repository.test.ts`

- [ ] Add failing repository tests for guest email/name normalization and saved trip response shape.
- [ ] Implement guest user/customer upsert, service lookup, request insert, initial status insert, and recent request list.
- [ ] Route POST/GET through Supabase when configured, demo otherwise.
- [ ] Run tests.

### Task 3: Database compatibility migration
**Files:**
- Create: `supabase/migrations/20260529230000_extend_service_type_codes.sql`

- [ ] Add missing service enum labels and seed rows/pricing for every app service id.
- [ ] Apply/push migration to connected Supabase.

### Task 4: Guest-first UI submit + admin visibility
**Files:**
- Modify: `src/features/tow-requests/request-flow-store.ts`
- Modify: `src/components/app/FindYourTowAppFlow.tsx`
- Modify: `app/admin/dispatch/page.tsx`

- [ ] Add guest name/phone fields to request state.
- [ ] Remove login gate as a blocker.
- [ ] Confirm reservation posts to `/api/tow-requests`; tracking uses returned trip.
- [ ] Admin dispatch displays recent real requests when Supabase is configured, plus demo fallback.

### Task 5: Verification and deploy
- [ ] Run targeted Vitest.
- [ ] Run full Vitest, lint, build.
- [ ] Commit on `main`, push, deploy Vercel production.
- [ ] Smoke check live request/admin pages.
