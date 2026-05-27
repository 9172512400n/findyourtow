# FindYourTow Production Architecture

FindYourTow is structured as a scalable marketplace, not a brochure site. The current MVP keeps the backend inside Next.js API routes while preserving clean boundaries so the API can move into NestJS without changing the domain contracts.

## Current Stack

- Next.js App Router + TypeScript
- Tailwind CSS with local shadcn-style primitives
- React Hook Form for customer request capture
- Zod validation on API boundaries
- Pure pricing engine with Vitest coverage
- Prisma PostgreSQL schema in `prisma/schema.prisma`
- Mapbox-ready coordinate/route contracts with premium simulated map UI
- Stripe-ready payment/tow request schema

## Future Production Services

- **Web:** Vercel
- **API:** NestJS on Railway, Fly.io, Render, or AWS ECS
- **Database:** Neon, Supabase Postgres, or AWS RDS
- **Realtime:** Redis + Socket.io, or Supabase Realtime for MVP
- **Redis:** Upstash or Redis Cloud
- **Storage:** S3-compatible bucket for licenses, insurance, truck photos, vehicle photos
- **Payments:** Stripe Payment Intents and Stripe Connect for driver payouts
- **Maps:** Mapbox geocoding, autocomplete, directions, distance, ETA, and live markers

## Required Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
REDIS_URL=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

## Migration Path to NestJS

1. Move `src/features/*/types.ts`, schemas, and pricing engine into a shared package.
2. Implement NestJS modules that mirror the current route boundaries:
   - `QuotesModule`
   - `TowRequestsModule`
   - `DriversModule`
   - `DispatchModule`
   - `PaymentsModule`
   - `RealtimeModule`
3. Replace Next.js API route internals with calls to the NestJS REST API.
4. Add Redis-backed Socket.io rooms:
   - `customer:{towRequestId}`
   - `driver:{driverId}`
   - `dispatch:live`
5. Add Stripe webhooks for `payment_intent.succeeded`, refunds, disputes, and Connect payouts.
6. Add role-based route guards for customer, driver, dispatcher, admin, and super admin.

## Security Notes

- Never expose Stripe secret keys or database URLs to the browser.
- Validate every API request with Zod or DTO validation.
- Protect Stripe webhooks with signature verification.
- Store admin actions in `audit_logs`.
- Require admin approval before drivers can go online.
- Use signed upload URLs for documents and vehicle photos.
