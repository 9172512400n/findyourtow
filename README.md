# FindYourTow

FindYourTow is a premium real-time roadside dispatch platform for customers, drivers, dispatchers, admins, and super admins.

## Production Slice Built

- Premium marketing homepage
- Customer request flow at `/request`
- Instant pricing engine with tests
- REST quote API at `/api/quotes`
- REST tow request API at `/api/tow-requests`
- Customer dashboard at `/customer`
- Live trip tracking UI at `/customer/trip/demo`
- Driver dashboard at `/driver`
- Admin dispatch dashboard at `/admin/dispatch`
- PostgreSQL/Prisma production schema at `prisma/schema.prisma`
- PWA manifest at `public/manifest.json`
- Production architecture notes at `docs/production-architecture.md`
- Backend integration readiness guide at `docs/backend-integration-readiness.md`
- Demo-safe Supabase, Stripe, Mapbox, and realtime adapter seams

## Development

```bash
npm run dev
npm run lint
npm run build
npx vitest run
```

## Architecture

The MVP uses Next.js API routes but keeps service contracts, schemas, and pricing logic in feature modules so the backend can migrate cleanly to NestJS later.

See `docs/production-architecture.md` for deployment, environment variables, realtime, payments, storage, and NestJS migration path.

See `docs/backend-integration-readiness.md` for the exact safe-demo-to-real-backend phases. The live app does not require Supabase, Stripe, Mapbox, Redis, or WebSocket keys yet.
