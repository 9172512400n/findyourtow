# Complete FindYourTow Advanced Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete mobile-first FindYourTow advanced demo covering customer, provider, payment, vehicle, live tracking, and admin flows without requiring Supabase, Stripe, Mapbox, Apple Pay, Twilio, Resend, Redis, or WebSocket keys.

**Architecture:** Keep the app in demo mode with Zustand/localStorage and mock API/data. Add reusable page shells and feature data so every route is clickable and polished, while adding adapter seams that document future wiring points for real services. Keep branding as FindYourTow only.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Zustand, Lucide React, Vitest, Testing Library.

---

## Files

- Create: `src/features/demo/platform-data.ts` — services, providers, requests, admin, driver, settings, support demo data.
- Create: `src/features/demo/demo-platform-store.ts` — persisted demo request/payment/provider/job state.
- Create: `src/features/payments/demo-payment-store.ts` — saved cards, Apple Pay demo, business/cash demo state.
- Create: `src/lib/demo/adapters.ts` — auth/profile/vehicles/payments/apple-pay/stripe/database/maps/geocoding/routing/dispatch/notifications/GPS/uploads placeholders with comments.
- Create: `src/components/app/DemoAppShell.tsx` — premium mobile page shell with app nav.
- Create: `src/components/app/DemoCards.tsx` — reusable cards, rows, quick actions, route CTA components.
- Modify: `src/components/app/AppBottomNav.tsx` — replace text symbols with Lucide icons.
- Modify: existing customer/account/request/driver/admin pages to use complete demo state and clean links.
- Add: missing customer routes under `app/login`, `app/register`, `app/forgot-password`, `app/account/*`, `app/help`, `app/settings`, `app/notifications`, `app/terms`, `app/privacy`.
- Add: missing driver routes under `app/driver/*`.
- Add: missing admin routes under `app/admin/*`.
- Test: `tests/complete-demo-routes.test.tsx` and extend existing tests where useful.

## Task 1: Route coverage red test
- [ ] Add route tests importing required customer, driver, and admin pages.
- [ ] Verify tests fail because missing route modules do not exist.

## Task 2: Demo data, stores, adapters
- [ ] Add platform data, demo platform store, payment store, and adapter placeholders.
- [ ] Add tests proving saved payment methods and adapter demo mode are keyless.

## Task 3: Shared app UI
- [ ] Add reusable page shell/cards.
- [ ] Replace emoji/text navigation icons with Lucide icons while preserving accessible link names.

## Task 4: Customer/account/payment routes
- [ ] Add login/register/forgot/setup/profile/vehicles/add/edit/payments/add/Apple Pay/help/settings/notifications/terms/privacy pages.
- [ ] Ensure all buttons link or update demo state.

## Task 5: Request/tracking completion
- [ ] Extend request flow copy/payment method state/provider matching as needed.
- [ ] Ensure request state persists into tracking and active request details.

## Task 6: Driver/provider routes
- [ ] Add provider login/onboarding/jobs/active/earnings/account/documents/truck/service-area/support pages.
- [ ] Wire online/offline, accept/decline, status update demo actions.

## Task 7: Admin routes
- [ ] Add admin login/drivers/pricing/jobs/customers/payments/refunds/analytics/notifications/settings/service-areas.
- [ ] Show active requests, providers, approvals, pricing, revenue, demo records.

## Task 8: Verification and deployment
- [ ] Run `npm run lint`.
- [ ] Run `npx vitest run`.
- [ ] Run `npm run build`.
- [ ] Deploy production to Vercel.
- [ ] Record completion in `memory/2026-05-28.md`.
