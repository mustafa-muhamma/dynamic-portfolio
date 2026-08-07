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

## Session 6 — 2026-08-05

- **Session Duration:** Dashboard media uploads session.
- **Session Number:** 6
- **Phase:** 1 — Foundations (M2 — Dashboard refinement)

### Completed Work

- Extended the media endpoint to accept documents: `POST /api/v1/media?kind=image|document`. `kind=document` allows PDF/DOC/DOCX (Cloudinary `raw`), `kind=image` keeps image/* only; both capped at 5MB. `server/src/middleware/upload.ts` now exports `uploadImage` and `uploadDocument` multer instances.
- Generalized `server/src/services/upload.ts` from image-only helpers to `uploadFile()`/`deleteFile()` that take an upload `kind`.
- Rewrote `server/src/routes/media.ts` to select the multer instance and Cloudinary resource type from the `kind` query param.
- Extended `server/tests/api.test.ts` with two media cases (rejects non-documents for `kind=document`; accepts a PDF and fails gracefully when Cloudinary is unconfigured). Suite now at 35 tests.
- Added a client media client `client/src/lib/media.ts` (file-type + size validation, `uploadFile()` helper) and a `POST /api/media` route handler that proxies the multipart body to the backend with the session token.
- Exported `handleUnauthorized` from `client/src/lib/admin-api.ts` so the media client reuses the same 401 → logout redirect.
- Added `client/src/components/admin/file-picker.tsx` with two reusable pickers: `FilePicker` (single file — image thumbnail/document icon preview, upload/replace/remove, URL fallback input) and `ImageListPicker` (multi-image upload grid with per-image remove + URL add input). Both validate type and 5MB size client-side.
- Wired pickers into the dashboard forms: Profile photo + resume, the Resume singleton (picker auto-fills `fileName`/`mimeType`/`size`; `fileName` derived from URL when pasted), Project images (multi-upload replacing the URL-list text area), and Testimonial avatar.
- Verified: server typecheck/lint + 35 tests pass; client `tsc`, ESLint, and `next build` pass clean (build shows new `/api/media` route).

### Problems Found

- Multer 2.x instances are not directly callable as middleware; the media route had to call `.single("file")` on the selected instance.
- RHF's form value type for the Resume form left `fileName` as `string | undefined`, which broke assignment to `CreateDoc<Resume>`; normalized `fileName` from the URL on submit.
- Next 16's proxy body limit defaults to 10MB — fine for 5MB uploads; the `/api/media` route handler buffers the request body as an `ArrayBuffer` and forwards it with the incoming `Content-Type` (boundary preserved).

### Architecture Decisions

- AD-12: One media endpoint handles both images and documents, disambiguated by a `?kind=` query param, so the client never sends raw binary to Cloudinary directly.

### Commits Created

- None (awaiting explicit request).

### Files Added

- `client/src/lib/media.ts`
- `client/src/app/api/media/route.ts`
- `client/src/components/admin/file-picker.tsx`

### Files Modified

- `server/src/middleware/upload.ts`, `server/src/services/upload.ts`, `server/src/routes/media.ts`, `server/tests/api.test.ts`
- `client/src/lib/admin-api.ts` (exported `handleUnauthorized`), `client/src/components/admin/forms.tsx` (Profile, Resume, Project, Testimonial forms)
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Optionally verify a real Cloudinary upload end-to-end in dev.
- Build the public portfolio (M3): recruiter path + client path, all API-driven.
- Fill real content via the dashboard (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M3: scaffold the `(public)` route group and build the recruiter-facing pages (Home, About, Experience, Skills, Projects, Resume, Contact).

---

## Session 7 — 2026-08-05

- **Session Duration:** Hero singleton + responsive dashboard session.
- **Session Number:** 7
- **Phase:** 1 — Foundations (M2 — Dashboard refinement)

### Completed Work

- Added the `Hero` singleton model on the server (`server/src/models/hero.model.ts`): `eyebrow`, `heading`, `subheading`, primary/secondary CTA label + URL, `image`, `backgroundType` (`color|image`), `backgroundColor`, `backgroundImage`, `animated`, `published`; registered in `server/src/models/index.ts`.
- Added `heroWriteSchema`/`heroUpdateSchema` in `server/src/validation/hero.ts` and admin routes `PUT/GET /admin/hero` plus the public `GET /api/v1/hero` in `server/src/routes/admin.ts` / `server/src/routes/public.ts` / `server/src/controllers/public.controller.ts`.
- Seeded a starter hero document in `server/src/scripts/seed-content.ts` and extended the API test suite with three cases (hero upsert, admin read, public read). Suite now at 38 tests; server typecheck/lint/test all pass.
- Client: added `Hero` type + `hero` entry in `SINGLETONS` (`client/src/lib/content.ts`) and a `HeroForm` (`client/src/components/admin/forms.tsx`) with FilePickers for the hero image and background image, a background type Select (color/image), and SwitchFields for `animated`/`published`.
- Added the `/admin/hero` page (`client/src/app/(admin)/admin/hero/page.tsx`) backed by `SingletonManager`, plus a nav item in the Recruiter section (Rocket icon).
- Made the dashboard responsive: `AdminNav` is now `hidden md:flex` with a new `MobileNav` drawer (hamburger + overlay + close on nav) rendered in the layout header; admin layout main padding scales down on mobile; collection tables wrapped in `overflow-x-auto`; search input and header actions wrap/scale on small screens; all `grid-cols-2` form grids are now `grid-cols-1 sm:grid-cols-2`.
- Replaced the manual hex text input for the hero background color with a `ColorField` color picker (native swatch + live hex display) in `client/src/components/admin/fields.tsx`, wired into the HeroForm.
- Verified: client `tsc`, ESLint, and `next build` pass clean (build lists the new `/admin/hero` route).

### Problems Found

- Base UI `Select` typing friction with RHF; used the controlled `value` + `onValueChange` form of the Select root instead of a RHF controller.
- ESLint's `react-hooks/set-state-in-effect` rule rejected closing the mobile drawer via a `useEffect` on `pathname`; the drawer instead closes through the link `onNavigate` handler and the overlay click.
- `SwitchField` uses a `description` prop (not `hint`); the HeroForm initially passed `hint`, caught by `tsc`.

### Architecture Decisions

- AD-13: Hero is a dedicated singleton (not a field on Profile) so the landing section stays independently editable and published via its own toggle.

### Commits Created

- `feat(server): add hero singleton with admin and public endpoints`
- `feat(client): add hero singleton management with responsive admin shell`
- `feat(client): use color picker for hero background color`
- Pending: `docs(log): record session 7 - hero singleton and responsive dashboard`

### Files Added

- `server/src/models/hero.model.ts`, `server/src/validation/hero.ts`
- `client/src/app/(admin)/admin/hero/page.tsx`

### Files Modified

- `server/src/models/index.ts`, `server/src/routes/admin.ts`, `server/src/routes/public.ts`, `server/src/controllers/public.controller.ts`, `server/src/scripts/seed-content.ts`, `server/tests/api.test.ts`
- `client/src/lib/content.ts` (Hero type + SINGLETONS entry), `client/src/components/admin/forms.tsx` (HeroForm + responsive grids + color picker), `client/src/components/admin/fields.tsx` (new `ColorField`), `client/src/components/admin/admin-nav.tsx` (Hero nav item, desktop/mobile split), `client/src/app/(admin)/layout.tsx` (mobile drawer entry), `client/src/components/admin/collection-manager.tsx` (table overflow + responsive actions)
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Build the public portfolio (M3): recruiter path + client path, all API-driven — starting with the Home/hero section consuming `GET /api/v1/hero` (split layout: eyebrow + gradient animated heading when `animated` is on).
- Fill real content via the dashboard (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M3: scaffold the `(public)` route group and build the Home/hero section from the new Hero singleton (data-driven, animations via CSS + IntersectionObserver, mobile-first).

---

## Session 8 — 2026-08-05

- **Session Duration:** Empty-database hardening + health check session.
- **Session Number:** 8
- **Phase:** 1 — Foundations (M2 — Dashboard refinement)

### Completed Work

- Verified the empty-database (brand-new) flow end-to-end: singleton GETs return 404, collection GETs return `[]`, the first save of any singleton upserts a new document and the first collection POST creates one. Dropped content collections are recreated automatically on write via Mongoose `autoCreate` (indexes included), so dashboard edits are self-healing against a blank or wiped DB.
- Hardened the client against an empty DB so every editable section accepts first-time values:
  - `ProfileForm`, `ResumeForm`, `HeroForm`, and `SiteSettingsForm` now pass `defaultValues: defaultValues ?? {}` to `useForm`, so RHF never receives `undefined` defaults on a 404 (empty DB); the form renders empty and ready for the first value (`client/src/components/admin/forms.tsx`).
  - `CollectionManager` list rows are guarded with `Array.isArray(list.data) ? list.data : []` instead of a bare `?? []` (`client/src/components/admin/collection-manager.tsx`).
  - Audit confirmed all `.data` reads across the client are guarded (singletons via 404 → `undefined` → create mode, collections/inquiries via `[]`).
- Added a real database readiness check to `GET /api/v1/health` (`server/src/routes/health.ts`): reports `database.state`, `readyState`, and `ok`, and returns HTTP `503 {status:"degraded"}` when the DB is unreachable vs. `200 {status:"ok"}` when connected. Readiness uses `readyState === 1` **plus** an actual `ping:1` command (3s cap) so a stalled-but-connected state is not a false positive; the ping is skipped while disconnected so the endpoint stays fast even with Mongoose `bufferCommands` (10s) in play.
- Confirmed DB-down behavior of the API: `bootstrap()` swallows a failed connect and the server still listens; every DB-touching request buffers ~10s then returns 500 via the error middleware; Mongoose auto-reconnects, so no restart is needed when the DB returns.
- Verified both health paths live: connected → 200; a throwaway boot with mongoose never connected → 503. Deleted the throwaway verification test.

### Problems Found

- `GET /health` previously always returned `200` with no DB signal — a false positive for availability; now returns 503 when the database is down.
- Mongoose pluralizes `Hero` → `heros` (not `heroes`), which tripped a manual collection check; confirmed real data intact via the live API instead.
- A stray `portfolio_blank` database and an untracked `server/tests/blank-db.test.ts` proof existed from verification; both were removed. The real `portfolio` database was verified untouched.

### Architecture Decisions

- AD-14: The health endpoint is a dependency-aware checker — HTTP 200/`ok` only when the DB is connected and answers `ping:1`, otherwise HTTP 503/`degraded` — so uptime monitors and load balancers can key off the status code.

### Commits Created

- `feat(server): add database readiness check to health endpoint`
- `feat(client): guard admin forms and lists for empty database`
- Pending: `docs(log): record session 8 - empty database guards and health check`

### Files Added

- (none)

### Files Modified

- `server/src/routes/health.ts`
- `client/src/components/admin/forms.tsx`, `client/src/components/admin/collection-manager.tsx`
- `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Build the public portfolio (M3): recruiter path + client path, all API-driven — starting with the Home/hero section consuming `GET /api/v1/hero` (split layout: eyebrow + gradient animated heading when `animated` is on).
- Fill real content via the dashboard (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M3: scaffold the `(public)` route group and build the Home/hero section from the new Hero singleton (data-driven, animations via CSS + IntersectionObserver, mobile-first).

---

## Session 9 — 2026-08-06

- **Session Duration:** M3 implementation — public portfolio foundation + recruiter path (multiple sub-sessions).
- **Session Number:** 9
- **Phase:** 1 — Foundations (M3 — Public Portfolio MVP)

### Completed Work

- Added the immersive design system and theme provider: indigo/green rebrand with dark-mode CTA, `motion` dependency (AD-15), animation primitives (`GradientOrbs`, `Reveal`), and the public shell.
- Added the public data layer and section config (`content.ts`, `sections.ts`, `use-public.ts`) and proxied the public API through Next (`/api/public/[...path]`) to bypass CORS.
- Built the hero section at `/` from the Hero singleton (animated gradient heading, split layout when an image is set).
- Added `yearsOfExperience` to the profile model so the About section shows it without fabricated literals.
- Media/cropping work: `react-easy-crop` dependency for avatar cropping, and a fix so the crop preview shows the exact cropped output with normalized EXIF.
- About section wired into the home page (bio, facts, email mailto + copy button, unclamped fact values, resume download from profile/resume document).
- Added scroll reveals and a reading progress bar.
- Experience timeline with LinkedIn-style durations (`3y 5mo`, current-role computation).
- Projects section with featured cards, then upgraded to premium auto-playing slideshow cards with detail links.
- Skills section with a marquee and compact, category-grouped chips (removed progress-bar styling per feedback).
- Added the mandatory session workflow to the root `AGENTS.md`.

### Problems Found

- Public API calls hit CORS from the browser; fixed by proxying through a Next route handler.
- Earlier About facts were clamped by overflow; unclamped the fact values so full numbers show.
- Hero content collapsed when no hero image was set; made the hero full-width in that case.

### Architecture Decisions

- AD-15: Public animations use `motion` (Framer Motion), approved over hand-rolled CSS + IntersectionObserver and the Web Animations API.

### Commits Created

- `feat(client): add immersive design system and theme provider`
- `chore(client): add motion dependency for public animations`
- `feat(client): add public data layer and section config`
- `feat(client): add animation primitives and public shell`
- `fix(client): proxy public API through Next to bypass CORS`
- `feat(client): build immersive premium hero section at /`
- `feat(profile): add explicit years of experience field`
- `fix(media): preview shows the exact cropped output, normalize EXIF`
- `feat(design): rebrand palette to indigo-green with dark-mode CTA`
- `build(client): add react-easy-crop dependency`
- `feat(public): email mailto + copy button, unclamp fact values`
- `feat(public): wire About section into home page`
- `feat(public): add scroll reveals and progress bar`
- `fix(public): full-width hero content when no image`
- `feat(public): add Experience timeline section with linkedIn duration style`
- `feat(public): add Projects section with featured cards`
- `feat(public): add Skills section with marquee and compact skill chips`
- `docs(workflow): add mandatory session workflow to root AGENTS.md`

### Files Added

- `client/src/components/public/*` (motion, section, hero, about, experience, skills, projects, nav, footer, header, etc.), `client/src/lib/{sections.ts,theme.ts}`, `client/src/hooks/use-public.ts`, `client/src/providers/*`, `client/src/app/api/public/[...path]/route.ts`
- `server/src/models/profile.model.ts` (`yearsOfExperience`), `server/src/validation/recruiter.ts` (field added)

### Files Modified

- `client/src/app/(public)/page.tsx` (all sections wired), `client/src/lib/content.ts`, `client/src/styles/*`, `client/package.json` (motion, react-easy-crop)
- `docs/MASTER_PLAN.md` (AD-15, M3 progress), `docs/DAILY_LOG.md` (this entry), root `AGENTS.md` (session workflow)

### Remaining Tasks

- Project detail pages + dashboard fields for projects (slug, in-progress, date picker).
- Client-path sections (Services, Pricing, Process, Testimonials, Contact) and contact form.
- Testimonials linked to projects with proof screenshots.

### Tomorrow's Goal

- Finish M3: client-path sections, project detail pages, and the testimonial→project linking feature.

---

## Session 10 — 2026-08-07

- **Session Duration:** M3 completion — project detail pages, client-path sections, testimonial linking, and layout polish.
- **Session Number:** 10
- **Phase:** 1 — Foundations (M3 — Public Portfolio MVP)

### Completed Work

- Client-path sections built and wired: Services, Pricing, Process, and Contact form, completing the public page (recruiter + client audiences on one route, per `sections.ts`).
- Project detail data layer (`getResource` + `useProjectBySlug`) and dashboard project fields: optional `slug` (auto-suggested from title, empty allowed), `inProgress` toggle, and a month picker for `date`.
- Project detail page at `/projects/[slug]`: premium gallery (cross-fade main image, arrows, dots, counter, responsive thumbnail strip), sticky stack card, CTAs, and a 404 state.
- Project cards on the home page upgraded to premium slideshows (auto-play, arrows, dots) linking into detail pages; detail routes resolve by `slug` or raw id when `slug` is missing.
- Server: testimonial model + validation extended with optional `projectId` and proof `images`; seed links one review to the flagship project.
- Dashboard: `TestimonialForm` gained a related-project select and a screenshots uploader (`ImageListPicker`).
- Home Testimonials rebuilt as a snap carousel (autoplay, arrows, dots, hover-pause) with per-card project badges and proof screenshots; project detail pages show their linked client reviews.
- Layout polish on the project page per feedback: wider stack card, roomier desktop CTAs, responsive gallery thumbnails.

### Problems Found

- Editing the grid ratio in source did not visibly change the deployed page — the page being inspected was the live build, not local output; verified the local production build generates the exact `grid-cols-[1.1fr_1fr]` rule.
- Explored a brand-icon tile grid (`react-icons`) for the stack card and a wider home-card layout; both were reverted on request in favor of the pill-style stack card and the existing home layout.
- Project detail 404 when a project had no slug; fixed server-side by matching on id or slug (`mongoose.isValidObjectId` guard).

### Architecture Decisions

- AD-16: Testimonials link to projects via optional `projectId` and may carry proof screenshots (`images`); unlinked reviews still render on the home carousel.

### Commits Created

- `feat(client): add project detail data layer`
- `feat(admin): project slug, in-progress status, and month picker fields`
- `feat(public): project cards as premium slideshows with detail links`
- `feat(public): add client-path sections and contact form`
- `feat(public): project detail page with premium gallery and server endpoint`
- `fix(public): resolve project detail by id when slug is missing`
- `feat(server): relate testimonials to projects with proof screenshots`
- `feat(admin): link testimonials to projects and attach screenshots`
- `feat(public): carousel testimonials with project badges and client reviews on projects`
- `fix(public): adjust grid layout for project page`

### Files Added

- `client/src/app/(public)/projects/[slug]/page.tsx`, `client/src/components/public/{services,pricing,process,testimonials,contact}.tsx`
- `server/src/models/testimonial.model.ts` (projectId + images fields added to existing model)

### Files Modified

- `server/src/controllers/public.controller.ts` (get project by slug/id), `server/src/routes/public.ts`, `server/src/validation/client.ts`, `server/src/scripts/seed-content.ts`
- `client/src/lib/content.ts` (Testimonial type), `client/src/components/admin/forms.tsx` (ProjectForm + TestimonialForm), `client/src/components/admin/fields.tsx` (MonthField), `client/src/components/admin/collection-manager.tsx`, `client/src/components/public/projects.tsx`
- `docs/MASTER_PLAN.md` (M3 complete, progress ~75%, AD-16, Day 6), `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Fill real content via the dashboard (M4) — the M3 build is complete.
- Responsive/accessibility/perf polish pass (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M4: populate every entity with real content via the dashboard and run the polish pass.

---

## Session 11 — 2026-08-08

- **Session Duration:** Resume download feature (multiple sub-sessions).
- **Session Number:** 11
- **Phase:** 1 — Foundations (M3 — Public Portfolio MVP / resume download)

### Completed Work

- Server: resume is stored as bytes in Mongo (`data: Buffer`, `select: false` on the Resume singleton) and streamed as an attachment via a new public `GET /api/v1/resume/download` (`server/src/controllers/resume.controller.ts`). Falls back to a 302 redirect when only a `fileUrl` exists.
- Server: new auth-guarded `POST /api/v1/admin/resume/upload` accepting PDF/DOC/DOCX up to 5MB via the existing document multer middleware; upserts the singleton and returns the API doc (data excluded).
- Server: `resumeWriteSchema.fileUrl` made optional so a byte-stored resume no longer requires a URL.
- Server: 7 new API tests (upload auth guard, missing-file 400, successful upload + public read, download streams bytes, redirect fallback) — suite now at 42 tests.
- Client: public download proxy `GET /api/public/resume/download` (`client/src/app/api/public/resume/download/route.ts`) forwarding content-type/disposition/length/cache-control from the server.
- Client: admin upload route `POST /api/admin/resume/upload` and `uploadResumeFile()` in `client/src/lib/media.ts`; `ResumeForm` rebuilt as an upload-and-feedback UI (file picker, type/size validation, uploading spinner, success/error states, current-file summary) in `client/src/components/admin/forms.tsx`.
- Client: `useResumeDownloadUrl()` hook (`client/src/hooks/use-public.ts`) resolves the download URL — the proxy when bytes/URL are stored, otherwise the profile resume link. Wired into the About resume button and the hero.
- Client: hero secondary CTA now links to the resume download (removed the now-unused `secondaryCtaUrl` field from the Hero form/type); renders a plain anchor for the download endpoint.
- Cleanup: removed the seed's placeholder resume (fake `example.com` URL — no real file existed) and the stale hero `secondaryCtaUrl` seed field, so a seeded DB shows no dead resume button.
- Verified: server typecheck/lint + 42 tests pass; client tsc, ESLint, and `next build` pass clean.

### Problems Found

- A resume stored only as a Cloudinary URL could not be downloaded as a file without an external redirect; storing bytes in Mongo makes download self-owned and dashboard-independent.
- The previous resume form required a valid URL (`fileUrl` required), which blocked saving a byte-stored resume; made it optional.
- The hero CTA pointed at a URL field that was no longer used; replaced with the resume download endpoint and a stored-vs-external anchor branch.

### Architecture Decisions

- AD-17: The resume is stored as bytes in Mongo and streamed via a dedicated auth-free `GET /resume/download`, instead of only a Cloudinary URL.

### Commits Created

- `feat(server): store resume bytes in Mongo and stream download`
- `feat(client): download resume through the API proxy`
- `feat(resume): implement resume upload functionality with validation and feedback`
- `feat(hero): link secondary CTA to the resume download`
- Pending: `docs(plan): record resume download feature and clean seed`

### Files Added

- `server/src/controllers/resume.controller.ts`
- `client/src/app/api/public/resume/download/route.ts`, `client/src/app/api/admin/resume/upload/route.ts`

### Files Modified

- `server/src/models/resume.model.ts` (`data: Buffer`, `select: false`), `server/src/routes/{admin,public}.ts`, `server/src/validation/recruiter.ts`, `server/tests/api.test.ts`
- `client/src/lib/media.ts`, `client/src/components/admin/forms.tsx` (ResumeForm rebuild), `client/src/components/public/{about,hero}.tsx`, `client/src/hooks/use-public.ts`, `client/src/lib/content.ts`
- `server/src/scripts/seed-content.ts` (removed placeholder resume + stale hero `secondaryCtaUrl`)
- `docs/MASTER_PLAN.md` (AD-17, Day 7, next session plan), `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Fill real content via the dashboard (M4) — the M3 build and resume download are complete.
- Responsive/accessibility/perf polish pass (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Begin M4: populate every entity with real content via the dashboard and run the polish pass.

---

## Session 12 — 2026-08-08

- **Session Duration:** Social links icons feature (multiple sub-sessions).
- **Session Number:** 12
- **Phase:** 1 — Foundations (M3 — Public Portfolio MVP / social links polish)

### Completed Work

- Client: explained the resume download button in the profile form — removed the redundant resume field and added a helper description of how the resume button works (`client/src/components/admin/forms.tsx`).
- Server: social link model and validation gained optional `icon` (preset key) and `iconUrl` (custom upload URL) fields; validation rejects unknown preset keys and requires a URL when `iconUrl` is used; API tests extended (`server/src/models/socialLink.model.ts`, `server/src/validation/recruiter.ts`, `server/tests/api.test.ts`).
- Client: `SocialLink` type gained `icon`/`iconUrl` (`client/src/lib/content.ts`).
- Client: added the preset library `client/src/lib/social-icons.ts` — 17 keys, grouped (Recruiting / Freelance / Contact & social) with labels.
- Client: added the admin `SocialIconPicker` (`client/src/components/admin/social-icon-picker.tsx`) — grouped preset grid with a selected-state check, plus a custom upload section (reuses `FilePicker`); wired into `SocialLinkForm`.
- Client: rewrote the public `SocialIcon` (`client/src/components/public/social-icon.tsx`) to render every preset glyph and resolve render order `iconUrl` → preset `icon` → platform fallback; wired into hero, footer, and contact.
- Client: added Mostaql and Khamsat preset icons to the Freelance group, using the official brand marks (Mostaql from the wasmenia asset store, Khamsat extracted from worldvectorlogo) rendered as monochrome `currentColor` glyphs via a custom `viewBox`.
- Verified: server typecheck/lint/tests pass; client tsc, ESLint, and `next build` pass clean.

### Problems Found

- lucide-react 1.28 removed all brand icons (Twitter, Instagram, Dribbble, GitHub, LinkedIn), so the previous lucide-based fallbacks stopped typechecking; replaced them with inline monochrome SVG glyphs so all presets share one rendering path.
- Neither Mostaql nor Khamsat exists in simple-icons (both CDN slugs 404'd and the slug list has no match); sourced the official SVG marks instead, and gave `Glyph` an optional `viewBox` prop to support non-24-unit coordinate systems.
- worldvectorlogo/raw.githubusercontent fetches were unreliable (timeouts, 403 from mostaql.com, deleted GitHub repo); the wasmenia asset store provided the Mostaql mark.

### Architecture Decisions

- AD-18: Social link icons are embedded monochrome SVG glyphs (simple-icons CC0 paths + official brand marks) rather than a brand-icon library, because lucide-react dropped brand icons. Render order in `SocialIcon`: `iconUrl` (custom upload) → preset `icon` key → platform-string fallback → default link icon.

### Commits Created

- `feat(profile): remove redundant resume field and explain resume button in profile form`
- `feat(server): add icon and iconUrl fields to social links`
- `feat(social-links): icon picker with presets and custom upload`
- `feat(social-icons): add Mostaql and Khamsat icons to presets and update Freelance group`
- Pending: `docs(log): record session 12 - social links icons`

### Files Added

- `client/src/lib/social-icons.ts`
- `client/src/components/admin/social-icon-picker.tsx`

### Files Modified

- `server/src/models/socialLink.model.ts`, `server/src/validation/recruiter.ts`, `server/tests/api.test.ts`
- `client/src/lib/content.ts`, `client/src/components/admin/forms.tsx`, `client/src/components/public/{social-icon,hero,footer,contact}.tsx`
- `docs/MASTER_PLAN.md` (AD-18, Day 7), `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Finish the session plan review (the user will share the full remaining points).
- Fill real content via the dashboard (M4).
- Responsive/accessibility/perf polish pass (M4).
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Continue M4: populate every entity with real content via the dashboard and run the polish pass.

---

## Session 13 — 2026-08-08

- **Session Duration:** Review fixes — testimonials validation, projects carousel, responsive polish, process order.
- **Session Number:** 13
- **Phase:** 1 — Foundations (M3 — Public Portfolio MVP / review fixes)

### Completed Work

- Testimonials conditional validation (issue 6): `author` and `quote` are now only required when no proof screenshots are uploaded.
  - Server: `server/src/models/testimonial.model.ts` relaxed `author`/`quote` from `required: true` to `default: ""`; `server/src/validation/client.ts` restructured into `testimonialBaseSchema` (all-optional, no refinement) + `testimonialWriteSchema = base.superRefine(...)` — `images` present ⇒ author/quote optional, no images ⇒ author+quote required; `testimonialUpdateSchema = base.partial()`.
  - Client: `client/src/components/admin/forms.tsx` mirrors the base + `superRefine` pattern; `handleImagesChange` clears the `author`/`quote` errors when screenshots are uploaded; Author/Quote hints reworded to "Only required when no proof screenshots are uploaded."
  - Client rendering: `TestimonialCard` hides the quote when empty and the identity footer when author/avatar/role/company are all empty, with a "Client" fallback avatar letter (`client/src/components/public/testimonials.tsx`); `Testimonial` type made `author?`/`quote?` optional (`client/src/lib/content.ts`); admin list label falls back to "Client" (`client/src/app/(admin)/admin/testimonials/page.tsx`); project detail reviews render safely (`client/src/app/(public)/projects/[slug]/page.tsx`).
  - Verified with the real `zodResolver` (@hookform/resolvers 5.7.1 + zod 4.4.3): with screenshots → no errors; without → author/quote custom errors. Server path verified via `safeParse` in the crud controller; `CollectionManager.handleSubmit` passes values through unchanged. Server `dist` rebuilt so `npm start` serves the current validation.
- Projects carousel (issue 7): rewrote `client/src/components/public/projects.tsx` as a single-feature auto-playing carousel — `ProjectCover` image slideshow left + content (title/role/date/description/tech/links/Case study) right on `lg` (stacked on mobile), `AnimatePresence mode="popLayout"` with directional `slideVariants`, 6s auto-advance pausing on hover/focus, prev/next arrows + dots + slide counter, and touch-swipe navigation (>48px delta).
- Responsive polish (issue 8): hero heading `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` with `[overflow-wrap:anywhere]` and stats `grid-cols-2 sm:grid-cols-4` (`hero.tsx`); nav brand truncates with a shrink-0 logo (`nav.tsx`); About facts `grid-cols-1 sm:grid-cols-2` (`about.tsx`); contact values `break-all` instead of `truncate` (`contact.tsx`).
- Process order fix: `process.tsx` sorts steps ascending `(a.order ?? 0) - (b.order ?? 0)` so the Process section renders 1 → N instead of N → 1 (seed uses `step: 1..5`, `order: 0..4`).
- Verified: server typecheck/lint + 43 tests pass; client tsc, ESLint, and `next build` pass clean (remaining lint warnings are the pre-existing `<img>` `@next/next/no-img-element` notices).

### Problems Found

- Zod v4 throws `".partial() cannot be used on object schemas containing refinements"` — `testimonialUpdateSchema` had to derive from the refinement-free `testimonialBaseSchema.partial()` instead of the `superRefine` write schema.
- The user still saw the old "author/quote required" validation on a deployed instance even though the schema accepted screenshots-only submissions. Root cause: a stale running server and/or stale form errors already displayed; fixed by clearing the `author`/`quote` errors on screenshot upload, rewording the hints, and advising a dev-server restart + hard refresh (an empty `images` array legitimately keeps author/quote required).
- Process steps rendered in descending order (N → 1) because the client sorted with `(b.order ?? 0) - (a.order ?? 0)`; reversed to ascending.

### Architecture Decisions

- (none new)

### Commits Created

- `feat(testimonials): make author and quote optional when proof screenshots are attached`
- `feat(projects): replace grid with auto-playing carousel and smooth transitions`
- `fix(public): responsive polish across hero, nav, about, and contact`
- `fix(process): order steps from 1 to N instead of N to 1`
- `feat(testimonials): enhance image handling and update hints for author and quote fields`
- Pending: `docs(log): record session 13 - review fixes`

### Files Added

- (none)

### Files Modified

- `server/src/models/testimonial.model.ts`, `server/src/validation/client.ts`
- `client/src/components/admin/forms.tsx`, `client/src/components/public/{testimonials,projects,process,hero,nav,about,contact}.tsx`, `client/src/lib/content.ts`, `client/src/app/(admin)/admin/testimonials/page.tsx`, `client/src/app/(public)/projects/[slug]/page.tsx`
- `docs/MASTER_PLAN.md` (M4 polish progress, next session plan), `docs/DAILY_LOG.md` (this entry)

### Remaining Tasks

- Continue the review points with the owner.
- Fill real content via the dashboard (M4).
- Responsive/accessibility/perf polish pass (M4) — responsive fixes partially done.
- Test, harden, and deploy (M5).

### Tomorrow's Goal

- Continue M4: remaining review points, populate real content via the dashboard, and finish the polish pass.

---
