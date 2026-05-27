# FindYourTow Premium Landing Design

**Goal:** Upgrade the default scaffold into a premium app-inspired tow platform landing page that feels like a real modern app.

**Approved direction:** Premium, sleek, fast, trustworthy, mobile-first.

## Design

- Dark premium visual system with black/charcoal surfaces, bright electric safety accent, crisp white typography, and subtle gradients.
- Top navigation with brand, trust signal, and direct request CTA.
- Hero section focused on urgent tow request, fast dispatch, live tracking, and professional network.
- App-style visual panel showing request status, ETA, driver card, route progress, safety checks, and service type chips.
- Supporting cards for customers, drivers, and dispatch/operators.
- Trust/safety section with professional copy and operational metrics.
- Mobile-first layout that stacks cleanly and scales to desktop with polished spacing.

## Files

- `app/(marketing)/page.tsx`: Active App Router landing experience.
- `app/layout.tsx`: Active root layout with professional metadata.
- `app/globals.css`: Active premium base theme, body polish, selection/focus affordances.
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`: Mirrored scaffold files kept premium to avoid future confusion if the project removes the root `app` directory.
- `tailwind.config.ts`: Include `src` paths for Tailwind scanning.

## Verification

- Add a rendering smoke test that confirms premium landing content appears.
- Run the smoke test, lint, and build.
