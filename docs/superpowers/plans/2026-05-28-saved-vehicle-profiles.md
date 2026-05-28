# Saved Vehicle Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add saved vehicle profile management, request-flow saved/manual vehicle selection, pricing impact by vehicle type, schema support, and USA address/current-location lookup fallback.

**Architecture:** Use a production-shaped hybrid: Prisma/migration schema first, demo Zustand/localStorage vehicle profile store for the current app, focused vehicle UI components reused by Account and Request, and an address-service abstraction that uses browser GPS/Mapbox when possible with deterministic USA fallback suggestions. Tow requests always carry a `vehicleSnapshot` independent of saved vehicle mutations.

**Tech Stack:** Next.js App Router, React client components, Zustand persist, Prisma/Postgres/Supabase SQL migrations, Vitest + Testing Library, Mapbox geocoding when configured.

---

## Files
- Create: `src/features/vehicles/types.ts` — shared vehicle type, snapshot, vehicle type constants, helpers.
- Create: `src/features/vehicles/demo-vehicle-store.ts` — persisted demo vehicle CRUD/default store.
- Create: `src/features/vehicles/demo-vehicle-store.test.ts` — store behavior tests.
- Create: `src/components/app/VehicleProfileManager.tsx` — Account My Vehicles section, cards, add/edit sheet.
- Create: `src/components/app/VehicleRequestStep.tsx` — saved/manual vehicle request step.
- Create: `src/lib/addresses/address-service.ts` — current location + US address search with Mapbox/fallback.
- Create: `src/lib/addresses/address-service.test.ts` — fallback/provider behavior tests.
- Modify: `src/features/tow-requests/request-flow-store.ts` — add `vehicleId`, `vehicleSnapshot`, `saveVehicleToProfile`, normalized vehicle type default.
- Modify: `src/features/tow-requests/types.ts` — add vehicle id/snapshot fields in request payload types.
- Modify: `src/features/tow-requests/schemas.ts` — validate nullable vehicle id + snapshot.
- Modify: `src/features/tow-requests/demo-repository.ts` — persist vehicle id + immutable snapshot.
- Modify: `src/features/tow-requests/demo-repository.test.ts` — cover snapshot/id.
- Modify: `src/features/pricing/pricing-engine.ts` — accept vehicle type and derive heavy fee.
- Modify: `src/features/pricing/pricing-engine.test.ts` — cover new types.
- Modify: `src/components/app/FindYourTowAppFlow.tsx` — wire address service and vehicle request step.
- Modify: `app/account/page.tsx` — render My Vehicles manager.
- Modify: `prisma/schema.prisma` — add Vehicle model + TowRequest vehicle relation/snapshot.
- Create: `prisma/migrations/20260528220000_saved_vehicle_profiles/migration.sql` — vehicles table and tow_requests columns.
- Modify: `supabase/migrations/20260527152500_findyourtow_rls_policies.sql` or create new RLS migration if needed — add vehicle policies.
- Modify: `tests/premium-landing.test.tsx` — integration coverage for account/request UI.
- Modify: `.gitignore` — ignore `.superpowers/` visual companion artifacts.

## Task 1: Vehicle domain and demo store
- [ ] Write failing tests for seeded vehicles, add/edit/delete, set default, and default-first ordering in `src/features/vehicles/demo-vehicle-store.test.ts`.
- [ ] Implement `src/features/vehicles/types.ts` with `VehicleType`, `vehicleTypes`, `heavyVehicleTypes`, `VehicleProfile`, `VehicleSnapshot`, `vehicleToSnapshot`, and `sortVehiclesDefaultFirst`.
- [ ] Implement `src/features/vehicles/demo-vehicle-store.ts` with seeded demo vehicles: 2021 black Toyota Camry default, 2023 white Ford F-150, 2020 gray Honda Accord.
- [ ] Run `npx vitest run src/features/vehicles/demo-vehicle-store.test.ts`; expect pass.

## Task 2: Pricing and request data
- [ ] Add failing tests for heavy fee by vehicle type in `src/features/pricing/pricing-engine.test.ts`.
- [ ] Modify `calculateQuote` to accept `vehicleType` and derive heavy-vehicle fee internally while preserving existing `heavyVehicle` compatibility.
- [ ] Extend request-flow data with `vehicleId`, `vehicleSnapshot`, and `saveVehicleToProfile`.
- [ ] Run `npx vitest run src/features/pricing/pricing-engine.test.ts`; expect pass.

## Task 3: Database schema and tow request snapshot
- [ ] Modify Prisma schema: add `Vehicle`, `Customer.vehicles`, `TowRequest.vehicleId`, `TowRequest.vehicleSnapshot Json`, and relation.
- [ ] Add SQL migration creating `vehicles` with the requested fields: `id`, `customer_id`, `nickname`, `make`, `model`, `year`, `color`, `license_plate`, nullable `vin`, `vehicle_type`, nullable `photo_url`, `is_default`, `created_at`, `updated_at`.
- [ ] Add SQL defaults/nullability: id generated/string-compatible, required text fields non-null, `vin` and `photo_url` nullable, `is_default` default false, timestamps default now/update timestamp.
- [ ] Add a partial unique index enforcing one default vehicle per customer: unique `customer_id` where `is_default = true`.
- [ ] Add nullable `tow_requests.vehicle_id` FK and required/default `tow_requests.vehicle_snapshot jsonb`.
- [ ] Extend request schemas/types and demo repository to include nullable `vehicleId` and required `vehicleSnapshot`.
- [ ] Add tests proving tow request keeps original snapshot even if caller mutates saved vehicle object later, and that both saved/manual requests persist `vehicleSnapshot` while manual one-off requests keep `vehicleId` null.
- [ ] Run `npx vitest run src/features/tow-requests/demo-repository.test.ts`; expect pass.

## Task 4: Account My Vehicles UI
- [ ] Add failing Testing Library coverage in `tests/premium-landing.test.tsx` for `/account` showing My Vehicles, seeded cards, Add/Edit/Delete/Set default controls.
- [ ] Implement `VehicleProfileManager` with mobile acceptance criteria: no tables, large tappable cards/buttons, bottom-sheet add/edit form, default badge, smooth actions, and comfortable small-screen spacing.
- [ ] Wire `/account` to render the manager and update summary counts.
- [ ] Run `npx vitest run tests/premium-landing.test.tsx`; expect pass.

## Task 5: Request-flow vehicle step
- [ ] Add failing tests for request step showing saved/manual modes, default first, saved card auto-fill, manual no-save path, manual save checkbox path.
- [ ] Add explicit tests that continuing with a saved vehicle stores a `vehicleSnapshot` and `vehicleId`, while continuing with another/manual vehicle stores `vehicleSnapshot` and leaves `vehicleId` null unless the save checkbox is checked.
- [ ] Implement `VehicleRequestStep` and replace the inline `VehicleStep` in `FindYourTowAppFlow` with mobile acceptance criteria: segmented saved/manual toggle, large cards, sticky continue CTA, bottom-sheet feeling, and no desktop tables.
- [ ] On continue, build `vehicleSnapshot`; if manual save checkbox is true, add vehicle to profile and use returned id.
- [ ] Update quote/confirm UI to use snapshot fields.
- [ ] Run `npx vitest run tests/premium-landing.test.tsx`; expect pass.

## Task 6: USA address/current location service
- [ ] Write tests for `searchUsAddresses`, Mapbox URL construction, fallback labeling, and current-location error handling.
- [ ] Implement `src/lib/addresses/address-service.ts` with Mapbox geocoding when token exists for exact US addresses, browser geolocation + reverse geocode for current phone location, and clearly labeled demo/offline fallback suggestions only when the real provider is unavailable.
- [ ] Wire current-location and address suggestions in request/location UI without blocking manual typing.
- [ ] Run address tests and integration tests; expect pass.

## Task 7: Verification, commit, deploy
- [ ] Run `npx vitest run`; expect all tests pass.
- [ ] Run `npm run lint`; expect no errors, only known `<img>` warnings if still present.
- [ ] Run `npm run build`; expect successful Next.js build.
- [ ] Browser-verify `/account` My Vehicles and `/request` vehicle step on production after deploy.
- [ ] Commit on `main`, push origin main, deploy production with Vercel, and record notes in `memory/2026-05-28.md`.
