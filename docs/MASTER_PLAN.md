# MASTER PLAN

> **Status:** Active
> **Last Updated:** 2026-08-09
>
> This document defines **HOW** we build the product. It is the project's **source of truth** and is updated continuously.
>
> **Methodology:** Milestone-driven development. Milestones are the source of truth; days are only estimates. Every milestone ends with working software, clean commits, updated documentation, and a stable architecture.

---

## Current Phase

**Phase 1 — Foundations** (M0–M4 complete; dashboard + public portfolio delivered; M5 — hardening & launch)

## Current Day

- **Day 8** of the project (2026-08-09).

## Overall Progress

- [x] Documentation hierarchy established
- [x] Architecture decisions finalized (stack + repo layout)
- [x] Repository scaffolding
- [x] Server (headless API)
- [x] Dashboard (admin routes in `client/`)
- [x] Public portfolio
- [x] Content completeness (populated via the dashboard — confirmed 2026-08-09)
- [ ] Hardening & launch (deployment live; security/test pass + polish remain)

**Progress: ~95%**

## Remaining Work

- Finish the responsive/accessibility/perf polish pass (M5 — deferred from M4).
- Security review, tests, and performance pass (M5).
- Deployment is **live**: frontend + backend on Vercel, MongoDB Atlas, Cloudinary.

## Milestones

### M0 — Foundations (Complete)

**Goal:** Documentation hierarchy + architecture decisions + project scaffolding.
**Deliverables:**

- [x] `docs/` hierarchy (Vision, PRD, Master Plan, Daily Log)
- [x] Technology stack decision (PRD §13)
- [x] Repo scaffolding for `server/` (Express + TS) and `client/` (Next.js)
- [x] README with setup instructions
- [x] Root tooling (Husky + lint-staged + Prettier) for the monorepo
      **Exit criteria:** A new contributor can run the full stack locally.

### M1 — Server Foundations (Complete)

**Goal:** A working headless content API and database with the full content model.
**Deliverables:**

- [x] Express + TypeScript + MongoDB/Mongoose setup.
- [x] Database schema for all Content Model entities.
- [x] Read-only public REST endpoints.
- [x] JWT authentication + authenticated write endpoints.
- [x] Multer (temp) + Cloudinary media handling.
- [x] Seed data (real content from the owner's CV).
- [x] Vitest + Supertest test suite (23 tests).
      **Exit criteria met:** All public content retrievable via API; writes require auth; tests pass.

### M2 — Dashboard (Complete)

**Goal:** The owner can manage all content from the admin dashboard (inside `client/`).
**Deliverables:**

- [x] Next.js App Router setup with `(admin)` route group and an auth guard (`proxy.ts` — middleware was renamed in Next 16).
- [x] Login/logout (httpOnly cookie; proxy-guarded `/login` and `/admin`).
- [x] CRUD modules for every content entity (12 pages wired to typed managers/forms).
- [x] Publish/unpublish (per-row toggle in every collection list).
- [x] Settings (contact + site settings singletons) and the inquiries inbox.
- [x] Long-lived sessions (1-year JWT + cookie) with automatic logout on expiry.
      **Exit criteria met:** AC-01 satisfied — content changes update the API without code edits.

### M3 — Public Portfolio MVP (Complete)

**Goal:** A public portfolio consuming the API, serving both audiences.
**Deliverables:**

- [x] Immersive design system + theme provider (indigo/green brand, dark mode, `motion` animations, scroll reveals + progress bar).
- [x] Public data layer + section config (`client/src/lib/content.ts`, `client/src/lib/sections.ts`, `client/src/hooks/use-public.ts`), with the public API proxied through Next to bypass CORS.
- [x] Recruiter path: hero (data-driven singleton), About (with resume download), Experience (LinkedIn-style durations), Skills (marquee + compact chips), Projects (slideshow cards + detail pages), Contact.
- [x] Client path: Services, Pricing, Process, Testimonials (carousel with project badges + proof screenshots), Contact form.
- [x] Project detail pages (`/projects/[slug]`) with premium gallery, stack card, and linked client reviews.
- [x] Testimonials link to projects (`projectId`) and carry optional proof screenshots, editable from the dashboard.
      **Exit criteria met:** AC-02 satisfied — zero hardcoded content in the frontend (all content comes from the API).

### M4 — Content & Polish (Complete)

**Goal:** The portfolio is filled with real content via the dashboard.
**Deliverables (final scope):**

- [x] Review fixes: testimonials conditional validation, projects auto-playing carousel, responsive polish (hero/nav/about/contact), process order 1→N.
- [x] Last updates: navigation active-section tracking + scroll behavior fix — key-based `NAV_SPY` ordering in `sections.ts`, applied to `client/src/components/public/nav.tsx`, `client/src/lib/sections.ts`, `server/src/scripts/seed-content.ts`.
      **Exit criteria:** Both personas can complete their full journey.

> **Closed 2026-08-09.** The remaining M4 items — populating every entity with real content via the dashboard and the residual responsive/accessibility/perf pass — were deferred to M5 (see below).

### M5 — Hardening & Launch

**Goal:** Production-ready.
**Deliverables:**

- [x] Deployment for public portfolio + dashboard (frontend + backend on Vercel, MongoDB Atlas, Cloudinary).
- [x] Cold-start optimization for the serverless API (defer boot work, cap DB connect timeouts).
- [x] Public bundle endpoint: single `GET /api/v1/bundle` returns all public content in one request; the frontend makes **1 request per page load** instead of ~14 (see AD-20).
- [x] Populate every entity with real content via the dashboard (deferred from M4) — confirmed complete by the owner 2026-08-09.
- [ ] Finish the responsive/accessibility/perf polish pass (deferred from M4).
- [ ] Security review, tests, performance pass.
      **Exit criteria:** Live site; project success criteria all true. Deployment live 2026-08-09.

## Architecture Decisions

| #     | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Status                           | Date       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------- |
| AD-01 | Monorepo with `server/` (headless API) and `client/` (Next.js frontend).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Decided (pre-existing layout)    | 2026-08-03 |
| AD-02 | Content is data, not code; the frontend consumes an API and never owns content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Decided (product requirement)    | 2026-08-03 |
| AD-03 | Public API is read-only; writes are authenticated and dashboard-only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Decided (product requirement)    | 2026-08-03 |
| AD-04 | Approved stack: Next.js/React/TS/Tailwind/shadcn/ui + RHF + Zod + TanStack Query (client); Node/Express/TS + JWT + Multer + Cloudinary SDK (server); MongoDB + Mongoose; Zod validation; REST.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | **Decided** (see PRD §13)        | 2026-08-03 |
| AD-05 | Repository layout: `server/` + `client/`; the dashboard lives inside `client/` as admin routes (approved option: "Admin inside client/").                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **Decided**                      | 2026-08-03 |
| AD-06 | Deployment: frontend → Vercel; **backend → Vercel (serverless, Node function)**; DB → MongoDB Atlas; media → Cloudinary. Originally planned Railway/Render; the owner deployed the Express API on Vercel (it ships a serverless handler), and cold starts were optimized (see AD-19).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Decided** (updated 2026-08-09) | 2026-08-03 |
| AD-11 | Dashboard sessions are long-lived (1-year JWT + cookie); an expired/invalid token triggers automatic logout. No refresh-token flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | **Decided**                      | 2026-08-05 |
| AD-15 | Public animations use `motion` (Framer Motion). Why: mission-critical for the immersive scroll UX (scroll reveals, springs, layout transitions, stagger). Alternatives: hand-rolled CSS + IntersectionObserver (more code, less buttery) and Web Animations API (lower-level). Trade-offs: ~+50 kB client dependency; mature, actively maintained. Long-term: stable `motion/react` API, well-documented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **Decided** (user-approved)      | 2026-08-06 |
| AD-16 | Testimonials are linked to projects via an optional `projectId` field so a review can surface on the matching project detail page; reviews may also carry proof screenshots (`images`) for trust. Kept optional so unlinked reviews still render on the home carousel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Decided**                      | 2026-08-07 |
| AD-17 | The resume is stored as bytes in Mongo (a `data: Buffer` on the Resume singleton) and streamed via a dedicated `GET /resume/download` endpoint (auth-free), instead of only a Cloudinary URL. Why: the resume must download as a file, and a single self-owned source avoids third-party dependency for this core document. Alternatives: keep Cloudinary raw upload (URL only — but the file had no seeded real URL, and the download path is dashboard-independent). Trade-offs: DB bloat vs. self-owned control. Long-term: fine for a single PDF document; can move to object storage later.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Decided**                      | 2026-08-08 |
| AD-18 | Social link icons are embedded monochrome SVG glyphs (simple-icons CC0 paths + official brand marks) rather than a brand-icon library, because lucide-react 1.x removed brand icons. Each link stores an optional preset `icon` key or custom `iconUrl`; `SocialIcon` resolves `iconUrl` → preset `icon` → platform-string fallback → default link icon. Why: zero new dependencies, consistent styling, works for niche platforms (e.g. Mostaql/Khamsat) absent from icon sets. Trade-offs: manual glyph maintenance vs. library convenience.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | **Decided**                      | 2026-08-08 |
| AD-19 | On serverless (Vercel) the API cold start blocks only on the database connect; admin seeding and the Cloudinary connectivity ping are fire-and-forget (logged, never block responses); `mongoose.connect` caps `serverSelectionTimeoutMS`/`connectTimeoutMS` at 5s, uses `maxPoolSize: 1`/`minPoolSize: 0`/`maxIdleTimeMS: 60s`, so cold instances hold one connection and release it fast. Why: first requests after idle returned 503/no data — Vercel's default 100-connection Mongoose pool across many cold instances exhausted Atlas M0, failing new connects. Trade-offs: single connection serializes DB ops (fine for a single-user portfolio); admin seed/Cloudinary check may complete a moment after the first response (safe — uploads call Cloudinary at request time).                                                                                                                                                                                                                                                                                                                                           | **Decided**                      | 2026-08-09 |
| AD-20 | Public content is served as a single `GET /api/v1/bundle` response containing every public entity (profile, hero, resume meta, contact/site settings, social links, experience, education, skills, projects, services, pricing, process, testimonials; missing singletons → `null`), and the frontend fetches it once via `usePublicBundle()` with each existing hook (`useProfile`, `useHero`, …) reading a slice through `useQuery` `select`. Why: on serverless, ~14 parallel entity requests each spun up a separate cold instance doing its own DB connect, compounding cold-start latency and Atlas connection pressure (see AD-19). Alternatives: keep per-entity requests (simpler but multi-instance cold starts) or client-side dedup (still 14 upstream fetches). Trade-offs: the bundle always returns all public content per load (a slightly larger payload; resume download bytes still stream separately at `/resume/download`); the project detail page also fetches the bundle for its linked reviews. Long-term: individual read endpoints remain for future consumers; one round-trip per public page load. | **Decided**                      | 2026-08-09 |

## Dependency Approval Process

Any new **major dependency** requires approval before introduction. A proposal must explain:

- **Why it is needed.**
- **Alternatives considered.**
- **Trade-offs.**
- **Long-term maintenance impact.**

Dependencies listed in the approved stack (PRD §13) are pre-approved for their stated purpose.

## Session Workflow

Every work session follows this order:

1. **Review** — read the four docs (vision, PRD, master plan, daily log).
2. **Plan** — agree on exactly what will be done this session and split it into logical commits.
3. **Discuss** — confirm the plan (scope, approach, and any open decisions) before writing code.
4. **Execute** — implement one commit at a time; after each commit, the next session step is a fresh review.
5. **Close** — update docs (master plan progress + daily log entry) and commit.

No implementation happens before the plan is agreed. A day's work = one reviewed, committed, and documented unit of work.

## Daily Objectives

**Day 1 (2026-08-03):**

- [x] Create documentation hierarchy.
- [x] Define vision, requirements, plan, and daily log.
- [x] Propose technology stack for the next milestone.
- [ ] Initial commit (awaiting explicit request).

**Day 2 (2026-08-03):**

- [x] Record approved technology stack and architecture decisions in docs.
- [x] Scaffold `server/` and `client/`.
- [x] Add README with setup instructions.

## Commit Plan

Convention: small, focused commits, one logical task each. Suggested message format: `type(scope): summary` (e.g., `docs(foundations): add documentation hierarchy`).

| #   | Logical Task                           | Suggested Commit                                                       |
| --- | -------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Documentation hierarchy                | `docs(foundations): add documentation hierarchy`                       |
| 2   | Approved stack + architecture recorded | `docs(foundations): record approved technology stack and architecture` |
| 3   | Server scaffolding                     | `feat(server): scaffold Express + TypeScript API with root git hooks`  |
| 4   | Client scaffolding                     | `feat(client): scaffold Next.js app with approved frontend stack`      |
| 5   | README + M0 closure                    | `docs(foundations): add setup README and close out M0`                 |

## Backlog

- Inquiry delivery (email vs. inbox vs. both) — PRD §17.
- Refresh-token decision during implementation — PRD §17.
- Deployment automation (CI/CD via GitHub).
- (Resolved 2026-08-09) Backend hosting provider — deployed on Vercel serverless (see AD-06/AD-19).

## Technical Debt

- None recorded yet. Avoid debt by respecting the dependency approval process and keeping docs current.

## Known Risks

| Risk                                         | Impact                         | Mitigation                                          |
| -------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| Scope creep beyond PRD                       | Delay, complexity              | Strictly follow PRD; new features go to Backlog.    |
| Hardcoded content creeping into the frontend | Violates success criteria      | Code review rule: no content literals in `client/`. |
| Dependency sprawl over time                  | Complexity, maintenance burden | Dependency approval process; remove unused deps.    |
| Single-owner knowledge                       | Bus factor                     | Keep docs current; simple conventions.              |

## Blockers

- None. Finalizing the backend hosting provider (PRD §17) is not required before scaffolding.

## Next Session Plan

1. Run the session workflow (read the four docs).
2. Finish the responsive/accessibility/perf polish pass on the public site — deferred from M4.
3. Security review, tests, and performance pass against the live site — re-verify the cold page load now that the bundle endpoint makes it a **single request**.
4. Verify the project success criteria against the live site (deployed: frontend + backend on Vercel, Atlas, Cloudinary).
5. Commit and close with documentation updates.

---

_This document is the project's source of truth and is updated at the end of every session._
