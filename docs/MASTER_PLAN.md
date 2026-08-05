# MASTER PLAN

> **Status:** Active
> **Last Updated:** 2026-08-05
>
> This document defines **HOW** we build the product. It is the project's **source of truth** and is updated continuously.
>
> **Methodology:** Milestone-driven development. Milestones are the source of truth; days are only estimates. Every milestone ends with working software, clean commits, updated documentation, and a stable architecture.

---

## Current Phase

**Phase 1 — Foundations** (M0–M2 complete; dashboard delivered)

## Current Day

- **Day 4** of the project (2026-08-05).

## Overall Progress

- [x] Documentation hierarchy established
- [x] Architecture decisions finalized (stack + repo layout)
- [x] Repository scaffolding
- [x] Server (headless API)
- [x] Dashboard (admin routes in `client/`)
- [ ] Public portfolio
- [ ] Content completeness
- [ ] Hardening & launch

**Progress: ~55%**

## Remaining Work

- Build public portfolio modules (M3).
- Fill real content via the dashboard (M4).
- Test, harden, and deploy (M5).

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

### M3 — Public Portfolio MVP

**Goal:** A public portfolio consuming the API, serving both audiences.
**Deliverables:**

- Recruiter path (Home, About, Experience, Skills, Projects, Resume, Contact).
- Client path (Home, Services, Pricing, Process, Testimonials, Contact).
  **Exit criteria:** AC-02 satisfied — zero hardcoded content in the frontend.

### M4 — Content & Polish

**Goal:** The portfolio is filled with real content via the dashboard.
**Deliverables:**

- Populate all entities.
- Responsive, accessible, performant design.
  **Exit criteria:** Both personas can complete their full journey.

### M5 — Hardening & Launch

**Goal:** Production-ready.
**Deliverables:**

- Security review, tests, performance pass.
- Deployment for public portfolio + dashboard.
  **Exit criteria:** Live site; project success criteria all true.

## Architecture Decisions

| #     | Decision                                                                                                                                                                                       | Status                             | Date       |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------- |
| AD-01 | Monorepo with `server/` (headless API) and `client/` (Next.js frontend).                                                                                                                       | Decided (pre-existing layout)      | 2026-08-03 |
| AD-02 | Content is data, not code; the frontend consumes an API and never owns content.                                                                                                                | Decided (product requirement)      | 2026-08-03 |
| AD-03 | Public API is read-only; writes are authenticated and dashboard-only.                                                                                                                          | Decided (product requirement)      | 2026-08-03 |
| AD-04 | Approved stack: Next.js/React/TS/Tailwind/shadcn/ui + RHF + Zod + TanStack Query (client); Node/Express/TS + JWT + Multer + Cloudinary SDK (server); MongoDB + Mongoose; Zod validation; REST. | **Decided** (see PRD §13)          | 2026-08-03 |
| AD-05 | Repository layout: `server/` + `client/`; the dashboard lives inside `client/` as admin routes (approved option: "Admin inside client/").                                                      | **Decided**                        | 2026-08-03 |
| AD-06 | Deployment: frontend → Vercel; backend → Railway/Render (final TBD); DB → MongoDB Atlas; media → Cloudinary.                                                                                   | **Decided** (backend provider TBD) | 2026-08-03 |
| AD-11 | Dashboard sessions are long-lived (1-year JWT + cookie); an expired/invalid token triggers automatic logout. No refresh-token flow.                                                            | **Decided**                        | 2026-08-05 |

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
- Finalize backend hosting provider (Railway vs. Render) — PRD §17.
- Deployment automation (CI/CD via GitHub).

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
2. Begin M3: scaffold the `(public)` route group with an API-driven home page.
3. Build the recruiter path (Home, About, Experience, Skills, Projects, Resume, Contact).
4. Build the client path (Home, Services, Pricing, Process, Testimonials, Contact).
5. Commit and close with documentation updates.

---

_This document is the project's source of truth and is updated at the end of every session._
