# Uniroost — System Design

Uniroost is a marketplace connecting students with verified PG/flat listings near their
college. Three roles share one system: **students** browse and contact owners, **owners**
list and manage properties, **admins** verify owners and curate reference data (colleges,
amenities).

This document describes the backend architecture, the data model, the security model, and
a prioritized roadmap of what's implemented vs. what's next. It's written to be read
alongside the code — it explains *why*, the code shows *how*.

---

## 1. Architecture overview

```
Browser / mobile client
        │
        ▼
┌─────────────────────────────────────────────┐
│  API layer — Next.js Route Handlers          │
│  ┌───────────┐ ┌──────────────┐ ┌──────────┐ │
│  │ Zod        │ │ Rate limiter │ │ Auth/RBAC│ │
│  │ validation │ │ (per-IP)     │ │ (NextAuth│ │
│  │            │ │              │ │  JWT)    │ │
│  └───────────┘ └──────────────┘ └──────────┘ │
└───────────────────────┬───────────────────────┘
                         ▼
              ┌─────────────────────┐
              │   Service layer      │  (property/auth/admin logic)
              └──────────┬───────────┘
                 ┌────────┴────────┐
                 ▼                 ▼
         ┌───────────────┐  ┌──────────────┐
         │ Redis cache    │  │ Prisma client │
         │ (planned)      │  │ (singleton,   │
         │ hot searches   │  │  indexed)     │
         └───────────────┘  └──────┬────────┘
                                    ▼
                            ┌──────────────┐
                            │  PostgreSQL   │
                            └──────────────┘

External service: Cloudinary (signed uploads for property photos / owner ID proofs)
```

Next.js App Router route handlers act as the API layer — this is a legitimate,
production-grade pattern (Vercel, Linear, and many others run this way), not a toy
setup. The important part for a resume/interview conversation is what happens *inside*
each route: validation, auth, and consistent error handling, all of which were missing
before this pass and are now standardized (see §4).

---

## 2. Data model

Core entities: `User` (STUDENT / OWNER / ADMIN), `Property`, `College`, `Amenity`, plus
join tables `PropertyCollege` (property ↔ nearby colleges with distance) and
`PropertyAmenity` (many-to-many). Full schema lives in `prisma/schema.prisma`.

Key relationships:
- A `Property` belongs to one `User` (the owner).
- A `Property` can be near many `College`s, each with its own `distanceKm`.
- A `Property` has many `Amenity`s and many `PropertyImage`s.

Indexes added in this pass (`prisma/migrations/20260810120000_add_search_indexes/`):
`Property(city, isAvailable)`, `Property(type)`, `Property(gender)`, `Property(rent)`,
`Property(ownerId)`, `Property(createdAt)`, `User(role, isVerified)` — these back every
filter the search page and admin dashboard actually run. Without them, `findMany` degrades
to a sequential scan as the table grows past a few hundred rows.

---

## 3. Security model

| Concern | How it's handled |
|---|---|
| Password storage | bcrypt, cost factor 10 |
| Session | NextAuth JWT strategy; role + verification status embedded in the token, refreshed on `session.update()` so admin actions propagate without forcing re-login |
| Route protection | `proxy.ts` middleware gates `/admin/*` and `/owner/*` by role; every API route additionally re-checks `session.user.role` server-side (defense in depth — middleware alone is not sufficient, since route handlers are directly reachable) |
| Role assignment | **Fixed in this pass.** Signup previously trusted a client-supplied `role` field, allowing self-assignment of `ADMIN`. Now validated against a closed enum (`STUDENT` \| `OWNER`) — `ADMIN` can only be granted by direct DB/admin action, never through a public endpoint |
| Input validation | Zod schemas at every mutating endpoint (`lib/validations/`) — previously request bodies were destructured and passed to Prisma unchecked |
| Rate limiting | Per-IP on signup, per-email+IP on login (`lib/rate-limit.ts`) — mitigates brute-force and signup spam. Currently in-memory (single-instance); documented upgrade path to Upstash Redis for multi-instance deployments |
| File upload | Type allowlist (JPEG/PNG/WebP/GIF) and 10MB size cap before the signed Cloudinary upload; signature computed server-side so the API secret never reaches the client |

---

## 4. API conventions

Every route now returns one of two shapes via `lib/api-response.ts`:

```ts
{ success: true,  data: T }
{ success: false, error: string, details?: unknown }
```

`withErrorHandling()` wraps route handlers so a thrown `ZodError` becomes a 422 with field
details, a Prisma `P2002`/`P2025` becomes a 409/404 with a human-readable message, and
anything unexpected becomes a logged 500 — instead of an unhandled exception leaking a
stack trace to the client (the previous behavior on most routes).

### Public REST endpoints (new)
- `GET /api/properties` — paginated, filterable (`city`, `type`, `gender`, `minRent`,
  `maxRent`, `collegeId`), sortable (`newest` \| `rent_asc` \| `rent_desc`) property
  search. This exists as a standalone, documented endpoint so a future mobile app or
  external client doesn't have to duplicate the query logic that lives in the `/search`
  server component.
- `GET /api/health` — checks the app process *and* a live DB round-trip
  (`SELECT 1`), for uptime monitors and container orchestrators.

---

## 5. What changed in this pass (summary)

1. Fixed privilege-escalation vulnerability in signup (role whitelist)
2. Added Zod validation on every mutating endpoint
3. Fixed Prisma client to be a true singleton (was leaking connections on every HMR reload)
4. Added rate limiting to signup and login
5. Fixed stale JWT verification status after admin approval
6. Added missing DB indexes + migration
7. Added pagination to `/search` and built `GET /api/properties`
8. Standardized API error handling and response shape
9. Added `/api/health`
10. Added env var validation (`lib/env.ts`)
11. Added Docker + docker-compose for reproducible local dev
12. Added GitHub Actions CI (lint, typecheck, test, build against a real Postgres service)
13. Added Vitest + 26 unit tests covering validation schemas and the rate limiter,
    including a regression test that locks in the privilege-escalation fix

---

## 6. Roadmap — prioritized for resume/interview value

These are scoped but not implemented, in the order I'd tackle them:

**High value, moderate effort**
- **Inquiry/lead system.** Today "contact owner" is just a `tel:` link with zero
  tracking. Add an `Inquiry` model (student → property, message, status) so owners get a
  dashboard of leads and students get a "my inquiries" page. This is the single highest-value
  addition — it turns a listing site into a marketplace with a funnel.
- **Redis-backed caching** for the hottest search queries (city + filters as cache key,
  short TTL, invalidated on property create/update). Talk-track: cache-aside pattern,
  TTL vs. explicit invalidation trade-offs.
- **Geo-distance search.** `latitude`/`longitude` are stored but `distanceKm` to a college
  is manually entered by the owner. Compute it server-side via the Haversine formula (or
  PostGIS `ST_DistanceSphere` if you want to go further) and support "sort by distance."
- **Move rate limiting to Upstash Redis** so it works correctly across multiple serverless
  instances (the current in-memory version is correct for one instance only — documented
  in `lib/rate-limit.ts`).

**Good for depth, lower urgency**
- Soft-delete on `Property` (an `deletedAt` column) instead of hard delete, so owners
  don't lose listing history/analytics.
- Audit log for admin actions (verify/reject owner, amenity/college CRUD) — an
  `AdminAction` table with actor, action, target, timestamp.
- Structured logging (pino) + error tracking (Sentry) instead of `console.error`.
- OpenAPI spec for the `/api/*` routes, generated from the Zod schemas (`zod-to-openapi`).
- Full-text search on `Property.title`/`description` via Postgres `tsvector`, or swap in
  Meilisearch/Typesense if you want a resume line about search infra specifically.

**Nice to have**
- Email notifications (signup confirmation, owner verified/rejected, new inquiry) via
  Resend or similar.
- Favorites/wishlist for students.
- Image optimization pipeline check (Cloudinary transformations for responsive `srcset`).

---

## 7. Local development

```bash
cp .env.example .env        # fill in DATABASE_URL, NEXTAUTH_SECRET, Cloudinary keys
docker compose up -d postgres
npx prisma migrate deploy
npm install
npm run dev
```

Or run the whole stack in containers: `docker compose up --build`.

Run tests: `npm test`. Run typecheck: `npx tsc --noEmit`. Run lint: `npm run lint`.
