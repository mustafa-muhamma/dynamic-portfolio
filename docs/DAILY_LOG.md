# DAILY LOG

> **Purpose:** Track everything that happened during development.
> **Rule:** Never rewrite history. Always append.

---

## Session 1 — 2026-08-03

- **Session Duration:** Initial setup session.
- **Session Number:** 1
- **Phase:** 1 — Foundations

### Completed Work

- Established the documentation hierarchy under `docs/`.
- Wrote `PROJECT_VISION.md` (why the product exists).
- Wrote `PRODUCT_REQUIREMENTS.md` (what we are building — the PRD).
- Wrote `MASTER_PLAN.md` (how we are building — source of truth).
- Wrote `DAILY_LOG.md` (this log).
- Defined the project success criteria explicitly (content never lives in source code).

### Architecture Decisions

- AD-01: Monorepo layout — `client/` (public frontend) + `server/` (API + dashboard). Matches existing empty directories.
- AD-02: Content is data, not code; frontend consumes an API.
- AD-03: Public API is read-only; writes are authenticated and dashboard-only.
- AD-04 (open): Technology stack, database, hosting — to be decided before scaffolding.

### Problems Found

- No commits yet in the repository (`main` branch, empty).
- `client/` and `server/` directories exist but are empty — no stack chosen.

### Solutions

- Established the documentation hierarchy first, before any implementation, so every future decision is anchored to documented vision and requirements.

### Lessons Learned

- Start every project with the four-document hierarchy; it forces clarity on why/what/how before code.
- Writing acceptance criteria early (PRD §9) makes later verification objective.

### Commits Created

- None yet (initial commit planned at end of this session).

### Files Added

- `docs/PROJECT_VISION.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/MASTER_PLAN.md`
- `docs/DAILY_LOG.md`

### Files Modified

- None.

### Remaining Tasks

- Resolve PRD §17 open questions (stack, database, hosting).
- Finalize AD-04.
- M0 remaining: repo scaffolding + README.
- M1: server foundations (data model, API, auth).

### Tomorrow's Goal

- Complete M0: decide the stack, scaffold `client/` and `server/`, add a README, and produce a clean commit.

---

## Session 2 — 2026-08-03

- **Session Duration:** Short documentation session.
- **Session Number:** 2
- **Phase:** 1 — Foundations

### Completed Work

- Recorded the approved technology stack (PRD §13).
- Updated architecture decisions: AD-04 (stack), AD-05 (repo layout), AD-06 (deployment).
- Resolved PRD §17 open questions for stack, database, hosting, and image uploads.
- Recorded the dependency approval process in MASTER_PLAN.
- Updated vision principles (technical + new technology principles), PRD constraints, master plan, and daily log.

### Architecture Decisions

- AD-04: Approved stack — Next.js/React/TS/Tailwind/shadcn/ui/RHF/Zod/TanStack Query (client); Node/Express/TS/JWT/Multer/Cloudinary (server); MongoDB + Mongoose; REST; Zod validation.
- AD-05: Repository layout — dashboard lives inside `client/` as admin routes (user-approved: "Admin inside client/").
- AD-06: Deployment — Vercel (frontend), Railway/Render TBD (backend), MongoDB Atlas, Cloudinary.

### Problems Found

- None.

### Solutions

- n/a

### Lessons Learned

- One frontend deployable can host both the public portfolio and the admin dashboard while preserving a headless content architecture.

### Commits Created

- None yet (awaiting explicit request).

### Files Added

- None.

### Files Modified

- `docs/PROJECT_VISION.md` (technical + technology principles)
- `docs/PRODUCT_REQUIREMENTS.md` (executive summary, §13–14, §17)
- `docs/MASTER_PLAN.md` (AD-04..06, milestones, dependency approval process, backlog, next session)
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Scaffold `server/` and `client/`.
- Add README with setup instructions.
- Begin M1 (server foundations).

### Tomorrow's Goal

- Complete M0: scaffold both apps, add a README, and produce a clean commit.

---

## Session 3 — 2026-08-04

- **Session Duration:** Scaffolding session.
- **Session Number:** 3
- **Phase:** 1 — Foundations

### Completed Work

- Scaffolded `server/` — Express 5 + TypeScript (ESM, NodeNext), Zod-validated env config, `/api/v1/health` endpoint, Mongoose connect (graceful when DB is down), CORS, ESLint (flat config + typescript-eslint), Prettier.
- Scaffolded `client/` — Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, shadcn/ui (Base UI "Nova" preset + `button` component), TanStack Query provider, React Hook Form + Zod installed, env-driven API URL config, minimal placeholder home page.
- Added monorepo root tooling: Husky + lint-staged + Prettier (git hooks live at the repo root since `.git` is there).
- Added README with setup instructions for both apps.
- Verified: server typecheck/lint/build pass and health endpoint returns 200; client lint/build pass clean.
- Completed M0; exit criterion met (a new contributor can run the full stack locally).

### Problems Found

- Husky run from `server/` couldn't find `.git` (it lives at the repo root) and misconfigured `core.hooksPath`. Fixed by moving git hooks to a root `package.json` + root `.husky/`.
- `create-next-app`'s default formatting (single quotes) clashed with the repo Prettier style; normalized with `prettier --write`.
- Next.js 16 warned about multiple lockfiles in the monorepo; fixed with `turbopack.root` in `next.config.ts`.
- `shadcn init` prompts interactively for base library/preset; resolved by passing `-b base -p nova` explicitly.

### Architecture Decisions

- AD-07: Git hooks (Husky/lint-staged) live at the monorepo root, not per app, because the git root is the repo root.
- AD-08: Server emits ESM with NodeNext resolution and `.js` import extensions.

### Commits Created

- `feat(server): scaffold Express + TypeScript API with root git hooks`
- `feat(client): scaffold Next.js app with approved frontend stack`
- Pending: `docs(foundations): add setup README and close out M0`

### Files Added

- `README.md`
- `package.json`, `package-lock.json`, `.prettierrc.json`, `.gitignore`, `.husky/pre-commit` (root)
- `server/` — package, tsconfig, eslint config, prettier config, gitignore, `.env.example`, `src/index.ts`, `src/app.ts`, `src/config/env.ts`, `src/routes/health.ts`
- `client/` — Next.js 16 app, shadcn/ui setup (`components.json`, `src/components/ui/button.tsx`), TanStack Query provider, config, `.env.example`

### Files Modified

- `docs/MASTER_PLAN.md` (M0 complete, progress ~15%, Day 3, next session plan)
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Begin M1: Mongoose schemas for the full Content Model.
- Public read-only REST endpoints.
- JWT auth + write endpoints.
- Multer + Cloudinary media handling.
- Seed data.

### Tomorrow's Goal

- Complete M1: full content model, read-only public API, authenticated writes, and tests.

---

## Session 4 — 2026-08-04

- **Session Duration:** M1 implementation (multiple sub-sessions).
- **Session Number:** 4
- **Phase:** 1 — Foundations (M1 — Server Foundations)

### Completed Work

- Added Mongoose models for the full Content Model (16 models) with a shared `models/index.ts`; fixed Mongoose 9 ESM imports (`default import` + destructure `Schema`/`model`/`models`).
- Added read-only public REST endpoints for the recruiter set (profile, resume, skills, experience, education, projects, social links) and the client set (services, pricing, process, testimonials, contact settings, site settings) via a controllers layer (`src/controllers/public.controller.ts`).
- Added `POST /api/v1/inquiries` with Zod validation (201/400) and a 403 when the contact form is disabled.
- Added JWT auth: login/me endpoints, `requireAuth` middleware, `seed:admin` script, admin auto-seed at startup (`src/lib/adminSeed.ts`).
- Added auth-guarded write endpoints for every entity via generic controller factories (`createOne`/`updateOne`/`deleteOne`/`upsertOne`) with per-entity Zod schemas.
- Added pino logger + request logging middleware, and a Cloudinary connectivity check at startup.
- Added image uploads: Multer temp upload → Cloudinary (`POST /api/v1/media`, auth-guarded) with `src/services/upload.ts` (`uploadImage`/`deleteImage`).
- Added `npm run seed:content` — idempotent content seed populated with the owner's real CV data (profile, 35 skills, 6 experience entries, education, 4 projects, social links, services, process, contact/site settings). Pricing and testimonials intentionally empty (no data in the CV; no fabricated content).
- Added Vitest + Supertest API test suite (23 tests) covering health, public reads, inquiries, auth, admin CRUD, and media guards. Runs against a dedicated `portfolio_test` database.
- Completed M1; exit criteria met (all public content retrievable via API; writes require auth; tests pass).

### Problems Found

- Mongoose 9 ships ESM-only; named imports fail at runtime. Fixed with default import + destructure.
- Mongoose 9 model typing broke field queries (and a generic helper caused `tsc` to OOM). Fixed with the explicit `model(...)` + `models.X ?? model` re-export pattern and a shared `LeanModel` type.
- Mongoose 9 deprecates `new: true` on `findOneAndUpdate`; switched to `returnDocument: "after"`.
- Shared Zod field types had to be `.optional()` — non-optional versions made omitted fields (e.g. `order`) fail validation with 400.
- `mongodb-memory-server`'s postinstall binary download hung `npm install`; dropped it and used a dedicated local test DB (`portfolio_test`) instead.
- The dev server (`tsx watch`) child crashed after a hot-reload; recovered by touching a watched file to trigger a respawn.
- PowerShell gotchas during live verification: `$pid` is a reserved variable, and the `curl` alias hangs the shell (use `curl.exe`).

### Architecture Decisions

- AD-09: Server models use the explicit `models.X ?? model` pattern with a shared loose `LeanModel` type for generic controllers.
- AD-10: Tests run against a dedicated `portfolio_test` database (local MongoDB), avoiding a memory-server binary download.

### Commits Created

- `feat(server): add mongoose models for content model`
- `fix(server): make mongoose ESM imports work under NodeNext`
- `docs(plan): add session workflow to master plan`
- `feat(server): add public read-only endpoints for recruiter entities`
- `feat(server): add controllers and public read endpoints for client entities`
- `feat(server): add public inquiry submission with zod validation`
- `feat(server): add pino logger with request logging middleware`
- `feat(server): verify Cloudinary connectivity at startup`
- `refactor(server): type mongoose models explicitly for field queries`
- `feat(server): add JWT auth with login/me endpoints and admin seed`
- `feat(server): auto-seed admin user at startup so deployed env stays in sync`
- `feat(server): add auth-guarded CRUD for recruiter entities`
- `feat(server): add auth-guarded CRUD for client entities`
- `feat(server): add image upload endpoint backed by Cloudinary`
- `feat(server): seed real portfolio content from owner CV`
- `test(server): add Vitest + Supertest API test suite`
- Pending: `docs(plan): close out M1 (server foundations)`

### Files Added

- `server/src/models/*` (16 models + index), `server/src/controllers/*`, `server/src/routes/{public,auth,admin,media,health}.ts`, `server/src/validation/{auth,inquiry,recruiter,client}.ts`, `server/src/middleware/{auth,requestLogger,upload}.ts`, `server/src/lib/{adminSeed,jwt,password,logger,serialize}.ts`, `server/src/services/{cloudinary,upload}.ts`, `server/src/scripts/{seed-admin,seed-content}.ts`, `server/src/types/model.ts`
- `server/tests/{api.test.ts,helpers.ts,setup.ts}`, `server/vitest.config.ts`

### Files Modified

- `docs/MASTER_PLAN.md` (M1 complete, progress ~30%, Day 3, next session plan → M2)
- `docs/DAILY_LOG.md` (this entry)
- `server/package.json` (pino, pino-pretty, cloudinary, multer, jsonwebtoken, bcryptjs; dev: vitest, supertest, @types/supertest; scripts `seed:admin`, `seed:content`, `test`)

### Remaining Tasks

- Build the dashboard (M2) inside `client/`.
- Note for deploy pipeline: run `npm run seed:admin` (or rely on startup auto-seed) before going live.

### Tomorrow's Goal

- Begin M2: Next.js App Router `(public)` / `(admin)` route groups, auth guard, login/logout, and the first CRUD modules.

---

## Session 5 — 2026-08-05

- **Session Duration:** M2 implementation (multiple sub-sessions).
- **Session Number:** 5
- **Phase:** 1 — Foundations (M2 — Dashboard)

### Completed Work

- Added server admin routes for every entity (list incl. unpublished, get/create/update/delete/upsert) and inquiry management (list/update/delete), mounted at `/api/v1/admin`; tests extended to 33.
- Added admin auth foundation in `client/`: httpOnly `admin_token` cookie, `/api/auth/login` + `/api/auth/logout` route handlers, authenticated `/api/admin/[...path]` proxy to the server, and a `proxy.ts` guard (Next 16's renamed middleware) that redirects `/admin/*` → `/login` and `/login` → `/admin`.
- Added the admin shell: grouped sidebar (`admin-nav.tsx`), layout, and an overview card grid.
- Added a typed admin API client (`admin-api.ts`, `content.ts`) and TanStack Query hooks (`use-content.ts`).
- Added content management building blocks: field primitives, a generic `CollectionManager` (list/search/CRUD dialog + publish toggle + delete) and `SingletonManager`, plus a Zod/RHF form for every entity (12 forms).
- Wired 12 admin pages (`/admin/*`): 9 collection modules, 2 singleton modules, and the combined settings page (contact + site settings).
- Added the inquiries inbox (`/admin/inquiries`): newest-first list, unread highlight/count, mark read/unread, delete with confirm.
- Extended sessions to 1 year (`JWT_ACCESS_EXPIRES=365d` + cookie max-age) and added automatic logout: any 401 from the admin API clears the cookie and redirects to `/login` (guarded against duplicate redirects).
- Completed M2; exit criteria met (AC-01 — content changes update the API without code edits).

### Problems Found

- Build rejected passing `getLabel`/`searchText` arrow functions from server pages into client components; fixed by marking all admin pages `"use client"`.
- The managers' `resource` prop was typed as a union, so rows/forms lost their per-entity types; refactored both managers to be generic over the resource key.
- RHF's `watch()` was flagged by the React Compiler eslint rule (non-memoizable); refactored all forms to `useWatch`.
- Zod `z.preprocess` fields have an `unknown` input type, so `watch("bullets")` etc. returned `unknown`; cast at the call sites.
- After JWT expiry the user stayed on the dashboard with failing requests; added the 401 → logout redirect.
- `window.location.assign("/login")` tripped the `no-location-assign-relative-destination` lint rule; switched to an absolute URL.

### Architecture Decisions

- AD-11: Dashboard sessions are long-lived (1-year JWT + cookie); an expired/invalid token triggers automatic logout. No refresh-token flow.

### Commits Created

- `feat(server): add admin list and inquiry management endpoints`
- `feat(client): add admin auth foundation with proxy guard and login`
- `feat(client): add admin shell layout with sidebar and overview page`
- `feat(client): add typed admin API client and query hooks`
- `feat(client): add content management modules with CRUD pages`
- `feat(client): add inquiries inbox with read and delete actions`
- `feat(auth): extend session to one year and force logout on expiry`
- Pending: `docs(plan): close out M2 (dashboard)`

### Files Added

- `server/src/routes/admin.ts`
- `client/src/proxy.ts`, `client/src/lib/{session,admin-api,content}.ts`, `client/src/hooks/use-content.ts`
- `client/src/app/(admin)/*`, `client/src/app/api/{auth,admin}/**`, `client/src/components/{admin/**,ui/**}`, `client/src/components/login-form.tsx`

### Files Modified

- `server/.env.example` + local `.env` (`JWT_ACCESS_EXPIRES=365d`)
- `client/src/lib/session.ts` (cookie max-age 1 year), `client/src/lib/admin-api.ts` (401 logout)
- `docs/MASTER_PLAN.md` (M2 complete, progress ~55%, Day 4, AD-11, next session plan → M3)
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Build the public portfolio (M3): recruiter path + client path, all API-driven.
- Fill real content via the dashboard (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M3: scaffold the `(public)` route group and build the recruiter-facing pages (Home, About, Experience, Skills, Projects, Resume, Contact).

---
