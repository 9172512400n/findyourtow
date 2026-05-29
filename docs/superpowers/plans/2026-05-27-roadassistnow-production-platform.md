# RoadAssistNow Production Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build RoadAssistNow into a scalable smart towing platform with customer request/quote/payment flow, driver operations, admin dispatch, live-tracking architecture, and production-ready data boundaries.

**Architecture:** Start as a Next.js app with clean feature modules, API routes that mirror future NestJS controller/service/repository boundaries, and a PostgreSQL/Prisma schema that can be lifted into a dedicated backend. The MVP uses deterministic mock realtime/map data in the UI while preserving typed API contracts for Mapbox, Stripe, Redis/WebSockets, and future NestJS migration.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Zod, React Hook Form, TanStack Query-ready fetch helpers, Zustand-ready client state, Prisma schema for PostgreSQL, Stripe-ready payment models, Mapbox-ready route/location interfaces.

---

## File Structure

- Create `prisma/schema.prisma`: PostgreSQL relational schema for users, roles, drivers, tow requests, pricing, payments, live locations, documents, service areas, notifications, audit logs, earnings.
- Create `src/features/pricing/pricing-engine.ts`: reusable pure pricing calculator.
- Create `src/features/pricing/pricing-engine.test.ts`: Vitest coverage for default fees, after-hours, heavy/rush, minimum tow, and non-tow services.
- Create `src/features/tow-requests/types.ts`: enums and typed API contracts for service types, tow statuses, roles, request payloads, quote responses.
- Create `src/features/tow-requests/schemas.ts`: Zod validation for quote and tow request APIs.
- Create `src/features/tow-requests/mock-data.ts`: deterministic driver/service/request data for production-feeling UI until database/realtime are connected.
- Create `src/features/tow-requests/api.ts`: typed fetch helpers.
- Create `src/components/ui/*`: local shadcn-style primitives needed for the app without depending on generated boilerplate.
- Create `src/components/platform/*`: map shell, status timeline, provider cards, role navigation, dashboard widgets.
- Create `app/api/quotes/route.ts`: REST quote endpoint using Zod + pricing engine.
- Create `app/api/tow-requests/route.ts`: REST tow request creation endpoint with simulated paid/searching status.
- Create `app/request/page.tsx`: customer request flow.
- Create `app/customer/trip/[id]/page.tsx`: live tracking/status page.
- Create `app/driver/page.tsx`: driver onboarding/online/jobs dashboard.
- Create `app/admin/dispatch/page.tsx`: dispatcher/admin live map and operations dashboard.
- Modify `app/(marketing)/page.tsx`: route CTAs into production app pages.
- Modify `app/layout.tsx`: metadata/PWA-ready viewport and app identity.
- Create `public/manifest.json`: PWA manifest.
- Create `docs/production-architecture.md`: deployment, environment variables, and migration path to NestJS.

## Tasks

### Task 1: Pricing engine and typed request contracts

**Files:**
- Create: `src/features/pricing/pricing-engine.ts`
- Create: `src/features/pricing/pricing-engine.test.ts`
- Create: `src/features/tow-requests/types.ts`
- Create: `src/features/tow-requests/schemas.ts`

- [ ] Write failing tests for all pricing rules.
- [ ] Implement the pure pricing calculator with no UI/database dependencies.
- [ ] Add Zod schemas for quote and tow request payloads.
- [ ] Run `npx vitest run src/features/pricing/pricing-engine.test.ts` and confirm PASS.

### Task 2: PostgreSQL/Prisma production schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] Define all requested tables, relationships, enums, and indexes.
- [ ] Add location/status/payment indexes for dispatch performance.
- [ ] Keep schema independent from app runtime until Prisma packages are wired.

### Task 3: API route boundaries

**Files:**
- Create: `app/api/quotes/route.ts`
- Create: `app/api/tow-requests/route.ts`
- Create: `src/features/tow-requests/mock-data.ts`
- Create: `src/features/tow-requests/api.ts`

- [ ] Implement quote endpoint with Zod validation and typed errors.
- [ ] Implement request endpoint that returns a deterministic trip payload.
- [ ] Preserve service/controller/repository separation inside feature modules.

### Task 4: Customer production flow

**Files:**
- Create: `app/request/page.tsx`
- Create/modify: `src/components/ui/*`
- Create: `src/components/platform/MapExperience.tsx`
- Create: `src/components/platform/ServiceSelector.tsx`

- [ ] Build mobile-first multi-step request UI.
- [ ] Show service cards, pickup/dropoff, vehicle details, photo placeholder, instant quote, and payment-ready confirmation.
- [ ] Include loading, empty, and validation states.

### Task 5: Live trip, driver, and dispatch pages

**Files:**
- Create: `app/customer/trip/[id]/page.tsx`
- Create: `app/driver/page.tsx`
- Create: `app/admin/dispatch/page.tsx`
- Create: `src/components/platform/StatusTimeline.tsx`
- Create: `src/components/platform/DriverCard.tsx`
- Create: `src/components/platform/DispatchBoard.tsx`

- [ ] Build premium live tracking screen with route line, truck marker, ETA, driver card, call CTA, timeline.
- [ ] Build driver dashboard with approval docs, online/offline, job offer, status updates, earnings.
- [ ] Build admin dispatch dashboard with active requests, live driver map, matching score, payments/refunds shell.

### Task 6: Production docs and verification

**Files:**
- Create: `docs/production-architecture.md`
- Modify: `README.md`

- [ ] Document env vars for Mapbox, Stripe, database, Redis, file storage.
- [ ] Document Vercel + Railway/Fly/Render + Neon/Supabase + Upstash deployment.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
