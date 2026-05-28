# Saved Vehicle Profiles Design

## Goal
Add customer-owned saved vehicles to FindYourTow, let customers manage multiple vehicles from Account, and let the request flow use a saved vehicle or a one-off/manual vehicle without forcing saves.

## Chosen approach
Build a demo-first, production-shaped implementation using the existing Zustand/localStorage demo architecture, Prisma schema, and mobile app UI. The saved vehicle experience ships now in demo mode and mirrors the database model needed for Supabase/Postgres. Address autocomplete/current location will use an address provider abstraction: browser geolocation plus Mapbox geocoding when configured, with safe demo USA suggestions as fallback.

## Alternatives considered
1. **Demo-only local state**: fastest, but hides database/API shape and makes future backend work riskier.
2. **Full backend CRUD now**: most complete, but the current app is mostly demo-mode and auth/backend wiring is not complete enough to justify blocking UI progress.
3. **Recommended hybrid**: add production schema + typed feature modules + demo UI/store now. Keep the UX real and make backend integration straightforward.

## Data model
### New `vehicles` table / Prisma `Vehicle`
Fields:
- `id`
- `customer_id`
- `nickname`
- `make`
- `model`
- `year`
- `color`
- `license_plate`
- `vin` nullable
- `vehicle_type`
- `photo_url` nullable
- `is_default`
- `created_at`
- `updated_at`

Relationships:
- `Customer.vehicles` has many vehicles.
- `Vehicle.customer` belongs to Customer.
- `TowRequest.vehicle` is optional.

Default constraint:
- App logic ensures one default per customer in demo mode and future API mode.
- Database migration adds an index on `(customer_id, is_default)` for lookup.

### `tow_requests` changes
Add:
- `vehicle_id` nullable FK to `vehicles.id` with `ON DELETE SET NULL`
- `vehicle_snapshot` JSONB required/default `{}`

Rationale: every job keeps the original vehicle details even when a saved vehicle is later edited/deleted.

## Vehicle types
Use exactly these customer-facing types:
- Sedan
- SUV
- Pickup truck
- Van
- Motorcycle
- Box truck
- Heavy-duty vehicle

Pricing impact:
- Heavy pricing applies to Pickup truck, Van, Box truck, Heavy-duty vehicle.
- SUV is not automatically heavy unless rules change later.
- The quote UI continues to show a heavy-vehicle fee when applicable.

## Demo data
Seed demo profile vehicles in localStorage:
1. Default: 2021 Toyota Camry, black, Sedan
2. 2023 Ford F-150, white, Pickup truck
3. 2020 Honda Accord, gray, Sedan

## Account page UX
Add a real **My Vehicles** section to `/account`:
- Vehicle cards with nickname, year/make/model, color/type/plate, default badge.
- Add vehicle opens a mobile-style bottom sheet.
- Edit opens the same form populated with the vehicle.
- Delete asks for confirmation.
- Set default moves the vehicle to the top and clears default from the others.
- Multiple vehicles are saved in demo localStorage.

## Request vehicle step UX
Replace the single manual-only vehicle step with two clear modes:

### Use saved vehicle
- Show saved vehicle cards.
- Default vehicle appears first.
- Selecting a card copies vehicle fields into request state and records `vehicleId`.
- Continue becomes enabled immediately after selecting a saved vehicle.

### Service for another vehicle
- Show manual fields: nickname optional for saving, make, model, year, color, license plate, type, VIN optional, photo optional.
- Include checkbox: “Save this vehicle to my account”.
- Do not force saving. Friend/family/rental/company/other vehicles can remain one-off.
- If checked, save to profile before quote/dispatch and use the new saved id.
- Always update request vehicle fields for quote and confirmation.

## Request snapshot behavior
Request state will carry:
- `vehicleId?: string`
- `vehicleSnapshot`
- manual fields already used by quote/confirmation

When moving past vehicle step:
- Build snapshot from selected saved vehicle or manual fields.
- Store it in request state.
- If manual save checkbox is checked, create/update saved vehicle first, then store id and snapshot.

When creating a tow request:
- Payload includes nullable `vehicleId` and required `vehicleSnapshot`.
- Demo repository stores the snapshot.
- Future backend route writes `vehicle_id` and `vehicle_snapshot`.

## Address/current location behavior
Add an address service abstraction:
- `getCurrentPositionAddress()` uses browser `navigator.geolocation` where available.
- Reverse-geocodes with Mapbox when `NEXT_PUBLIC_MAPBOX_TOKEN` exists.
- `searchUsAddresses(query)` uses Mapbox geocoding constrained to US when configured.
- Falls back to deterministic demo USA suggestions if not configured or offline.

UX:
- Address suggestions should look exact and tappable.
- Current location button should request browser permission and show a friendly fallback if denied/unavailable.

## Error handling
- Vehicle form validates required fields before enabling save/continue.
- Deleting default vehicle promotes another vehicle to default when possible.
- Empty saved vehicle list shows “Add your first vehicle” and keeps manual mode available.
- Address failures keep user input and show fallback suggestions.

## Testing
Add/extend tests for:
- Demo vehicle store: seeded vehicles, add/edit/delete/default behavior, default first.
- Pricing: heavy fee for Pickup truck, Van, Box truck, Heavy-duty vehicle; no heavy fee for Sedan/SUV/Motorcycle.
- Account page: My Vehicles section, add/edit/delete/default interactions.
- Request flow: saved vehicle selection auto-fills and enables quote; manual another vehicle does not force saving; save checkbox creates a saved vehicle.
- Tow request demo repository: persists `vehicleId` nullable and `vehicleSnapshot` immutable.
- Address service fallback returns US suggestions without Mapbox.

## Non-goals for this pass
- Real Supabase authenticated CRUD endpoints for vehicles.
- Real file upload storage for vehicle photos.
- Full production geocoding account/key setup if missing.
