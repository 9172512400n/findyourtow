# FindYourTow Simple Customer Flow Design

Date: 2026-05-28
Status: Approved by Nir in chat

## Goal

Make the customer experience feel easy, fast, and calming for a stressed roadside customer. The platform can remain marketplace-style underneath, but the customer should not feel like they are managing a complex dispatch workflow.

Target feeling: **“I’m stuck. Tap what happened. Help is coming.”**

## Recommended Approach

Use a mobile-first **3-tap emergency flow**:

1. **What do you need?**
   - Large service buttons for Tow, Flat Tire, Jump Start, Lockout, Fuel, Battery, and Winch.
   - Keep longer/edge-case service types available in secondary surfaces, not the main emergency path.

2. **Where are you?**
   - Default to a large “Use my current location” action.
   - Manual address entry remains available if GPS fails or the customer is requesting help for someone else.
   - For towing, ask only for destination after pickup is clear.

3. **Confirm help**
   - Show ETA, quoted price, selected service, payment authorization language, and one big action.
   - Then open matching and live tracking with driver/provider identity.

## Customer UX Rules

- Use large thumb-friendly buttons.
- Avoid long forms before the customer sees a price/ETA.
- Do not block first-time customers with confusing account setup language.
- Use plain labels: “Tow”, “Flat tire”, “Jump start”, “Help is coming”.
- Keep the support/safety action visible after matching.
- Show payment as authorization first; charge after service completion.
- Preserve live provider tracking, ETA, driver/truck details, and timeline after dispatch.

## Flow Details

### Home

The home screen stays map-first and calm. It should immediately answer:

- What can I request?
- Where am I?
- What button do I press next?

### Request Sheet

The request sheet becomes a simplified emergency sheet instead of a dispatch planner.

- Step label: “Help” / “Location” / “Confirm” / “Track”.
- First visible step after pressing Continue should be service + location, not a complex planner.
- Existing saved vehicles remain supported, but the UI should gently default to the customer’s default vehicle and not make vehicle details feel like a barrier.

### Marketplace Behavior

Under the hood, keep existing marketplace logic:

- Calculate quotes by service type, vehicle type, distance, and rush.
- Authorize payment before dispatch.
- Match closest available verified providers.
- Show provider accepted, ETA, driver/truck details, and live trip progress.

## Implementation Notes

- Reuse existing `FindYourTowAppFlow` architecture and stores.
- Keep demo mode and no new required env vars.
- Avoid public-facing copy that imitates a specific competitor; familiar UX patterns are fine, branding/copy stays FindYourTow-original.
- Add/update tests around the simplified customer path.

## Acceptance Criteria

- Customer can start from home or `/request` and understand the next action immediately.
- Primary flow is understandable as: choose service → confirm location → quote/payment → match/track.
- The UI avoids complex marketplace/admin/driver terminology in the customer flow.
- Existing driver, admin, account, saved vehicle, payment, and tracking demo routes remain functional.
- Lint, tests, and build pass before push/deploy.
