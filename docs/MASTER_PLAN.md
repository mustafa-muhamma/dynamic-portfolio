# MASTER PLAN

> **Status:** Active
> **Last Updated:** 2026-08-03
>
> This document defines **HOW** we build the product. It is the project's **source of truth** and is updated continuously.
>
> **Methodology:** Milestone-driven development. Milestones are the source of truth; days are only estimates. Every milestone ends with working software, clean commits, updated documentation, and a stable architecture.

---

## Current Phase

**Phase 1 — Foundations** (documentation, architecture decisions, scaffolding)

## Current Day

- **Day 2** of the project (2026-08-03).

## Overall Progress

- [x] Documentation hierarchy established
- [x] Architecture decisions finalized (stack + repo layout)
- [ ] Repository scaffolding
- [ ] Server (headless API)
- [ ] Dashboard (admin routes in `client/`)
- [ ] Public portfolio
- [ ] Content completeness
- [ ] Hardening & launch

**Progress: ~10%**

## Remaining Work

- Scaffold `server/` and `client/`.
- Add README with setup instructions.
- Build content API + data model.
- Build dashboard modules.
- Build public portfolio modules.
- Fill real content via the dashboard.
- Test, harden, and deploy.

## Milestones

### M0 — Foundations (Current)
**Goal:** Documentation hierarchy + architecture decisions + project scaffolding.
**Deliverables:**
- [x] `docs/` hierarchy (Vision, PRD, Master Plan, Daily Log)
- [x] Technology stack decision (PRD §13)
- [ ] Repo scaffolding for `server/` (Express + TS) and `client/` (Next.js)
- [ ] README with setup instructions
**Exit criteria:** A new contributor can run the full stack locally.

### M1 — Server Foundations
**Goal:** A working headless content API and database with the full content model.
**Deliverables:**
- Express + TypeScript + MongoDB/Mongoose setup.
- Database schema for all Content Model entities.
- Read-only public REST endpoints.
- JWT authentication + authenticated write endpoints.
- Multer (temp) + Cloudinary media handling.
- Seed data.
**Exit criteria:** All public content retrievable via API; writes require auth; tests pass.

### M2 — Dashboard
**Goal:** The owner can manage all content from the admin dashboard (inside `client/`).
**Deliverables:**
- Next.js App Router setup with `(public)` / `(admin)` route groups and an auth guard (middleware).
- Login/logout.
- CRUD modules for every content entity.
- Publish/unpublish.
- Settings and inquiries.
**Exit criteria:** AC-01 satisfied — content changes update the API without code edits.

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

| # | Decision | Status | Date |
|---|---|---|---|
| AD-01 | Monorepo with `server/` (headless API) and `client/` (Next.js frontend). | Decided (pre-existing layout) | 2026-08-03 |
| AD-02 | Content is data, not code; the frontend consumes an API and never owns content. | Decided (product requirement) | 2026-08-03 |
| AD-03 | Public API is read-only; writes are authenticated and dashboard-only. | Decided (product requirement) | 2026-08-03 |
| AD-04 | Approved stack: Next.js/React/TS/Tailwind/shadcn/ui + RHF + Zod + TanStack Query (client); Node/Express/TS + JWT + Multer + Cloudinary SDK (server); MongoDB + Mongoose; Zod validation; REST. | **Decided** (see PRD §13) | 2026-08-03 |
| AD-05 | Repository layout: `server/` + `client/`; the dashboard lives inside `client/` as admin routes (approved option: "Admin inside client/"). | **Decided** | 2026-08-03 |
| AD-06 | Deployment: frontend → Vercel; backend → Railway/Render (final TBD); DB → MongoDB Atlas; media → Cloudinary. | **Decided** (backend provider TBD) | 2026-08-03 |

## Dependency Approval Process

Any new **major dependency** requires approval before introduction. A proposal must explain:
- **Why it is needed.**
- **Alternatives considered.**
- **Trade-offs.**
- **Long-term maintenance impact.**

Dependencies listed in the approved stack (PRD §13) are pre-approved for their stated purpose.

## Daily Objectives

**Day 1 (2026-08-03):**
- [x] Create documentation hierarchy.
- [x] Define vision, requirements, plan, and daily log.
- [x] Propose technology stack for the next milestone.
- [ ] Initial commit (awaiting explicit request).

**Day 2 (2026-08-03):**
- [x] Record approved technology stack and architecture decisions in docs.
- [ ] Scaffold `server/` and `client/`.
- [ ] Add README with setup instructions.

## Commit Plan

Convention: small, focused commits, one logical task each. Suggested message format: `type(scope): summary` (e.g., `docs(foundations): add documentation hierarchy`).

| # | Logical Task | Suggested Commit |
|---|---|---|
| 1 | Documentation hierarchy | `docs(foundations): add documentation hierarchy` |
| 2 | Approved stack + architecture recorded | `docs(foundations): record approved technology stack and architecture` |

## Backlog

- Inquiry delivery (email vs. inbox vs. both) — PRD §17.
- Refresh-token decision during implementation — PRD §17.
- Finalize backend hosting provider (Railway vs. Render) — PRD §17.
- Content seeding script for real data.
- Deployment automation (CI/CD via GitHub).

## Technical Debt

- None recorded yet. Avoid debt by respecting the dependency approval process and keeping docs current.

## Known Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep beyond PRD | Delay, complexity | Strictly follow PRD; new features go to Backlog. |
| Hardcoded content creeping into the frontend | Violates success criteria | Code review rule: no content literals in `client/`. |
| Dependency sprawl over time | Complexity, maintenance burden | Dependency approval process; remove unused deps. |
| Single-owner knowledge | Bus factor | Keep docs current; simple conventions. |

## Blockers

- None. Finalizing the backend hosting provider (PRD §17) is not required before scaffolding.

## Next Session Plan

1. Run the session workflow (read the four docs).
2. Scaffold `server/` (Express + TypeScript + ESLint/Prettier/Husky/lint-staged).
3. Scaffold `client/` (Next.js App Router + TypeScript + Tailwind + shadcn/ui + TanStack Query + React Hook Form + Zod).
4. Add README with setup instructions.
5. Commit and close with documentation updates.

---

*This document is the project's source of truth and is updated at the end of every session.*
