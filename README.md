# Uniroost

A student housing marketplace — students find verified PG/flat listings near their
college; owners list and manage properties; admins verify owners and curate reference
data. Built with Next.js 16 (App Router), Prisma 7, PostgreSQL, and NextAuth.

**Live:** [uniroost.vercel.app](https://uniroost.vercel.app)

## Highlights

- Role-based access control (student / owner / admin) enforced at both the middleware
  and API layer
- Zod-validated REST API with a consistent success/error response envelope and
  centralized error handling
- Rate-limited auth endpoints, bcrypt password hashing, signed Cloudinary uploads
- Paginated, filterable, indexed property search (`GET /api/properties`)
- Postgres schema with proper indexing for the actual query patterns the app runs
- Dockerized for local dev (`docker-compose.yml`) and CI (GitHub Actions: lint,
  typecheck, test, build against a real Postgres service container)
- 26 unit tests covering validation logic and rate limiting, including a regression
  test for a fixed privilege-escalation vulnerability

See [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md) for the full architecture write-up,
data model, security model, and roadmap.

## Tech stack

**Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
**Backend:** Next.js Route Handlers, NextAuth (JWT), Prisma 7 + `pg` driver adapter
**Database:** PostgreSQL
**Storage:** Cloudinary (signed uploads)
**Testing:** Vitest
**Infra:** Docker, GitHub Actions

## Getting started

```bash
cp .env.example .env          # fill in DATABASE_URL, NEXTAUTH_SECRET, Cloudinary keys
docker compose up -d postgres
npm install
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Or run the whole stack containerized: `docker compose up --build`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite |
| `npx prisma studio` | Browse the database |
| `npx prisma migrate dev` | Create/apply a migration in development |

## API

- `GET /api/properties` — paginated property search (`city`, `type`, `gender`,
  `minRent`, `maxRent`, `collegeId`, `page`, `pageSize`, `sort`)
- `GET /api/health` — liveness + database connectivity check
- `POST /api/auth/signup` — create a student or owner account
- `POST /api/owner/properties`, `PUT`/`DELETE /api/owner/properties/[id]` — owner
  listing management (auth required)
- `POST /api/owner/upload` — signed image upload
- `POST /api/admin/verify-owner`, `POST /api/admin/reject-owner` — owner verification
  (admin only)
- `GET`/`POST`/`DELETE /api/admin/amenities`, `/api/admin/colleges` — reference data
  management (admin only)

Full details in [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md).
