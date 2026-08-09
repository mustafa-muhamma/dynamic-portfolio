# PRODUCT REQUIREMENTS

> **Status:** Draft
> **Last Updated:** 2026-08-03
>
> This document defines **WHAT** we are building — the official Product Requirements Document (PRD).
> **Everything implemented must exist here first. If a feature is not inside this document, it should not be implemented.**

---

## 1. Executive Summary

A self-owned, content-managed professional portfolio platform built from three connected parts:

1. **A Headless Backend** (`server/`) — the single source of truth for all portfolio content, exposed via a REST API.
2. **A Dashboard** — the private admin interface, hosted inside the frontend app, where the owner manages all content for every public surface.
3. **A public Portfolio** — the frontend consumer that requests data from the API and renders it; it never owns data.

The same underlying professional data serves **two audiences**: recruiters (resume, experience, skills, projects) and freelance clients (services, pricing, process, testimonials). The owner updates content from the dashboard; source code is never touched to change content. The presentation layer can be redesigned without migrating content.

## 2. Product Scope

### In Scope (core)

- Content dashboard for the owner (authenticated, single-user).
- Public portfolio website with audience-aware views.
- Content API (read for public, read/write for the dashboard).
- Structured content model covering the owner's full professional profile.

### Audiences

- **Recruiters** — need experience, skills, projects, resume, contact.
- **Freelance clients** — need services, pricing, process, testimonials, contact.

## 3. MVP Scope

The MVP delivers a fully content-managed portfolio covering both audiences:

- **Dashboard:**
  - Authentication for the owner.
  - CRUD for every content entity (see Content Model).
  - Publish/unpublish per item.
  - Site-wide settings (name, tagline, contact, social links).
- **Public Portfolio:**
  - Home / hero (from dashboard data).
  - Recruiter path: About, Experience, Skills, Projects, Resume download, Contact.
  - Freelance path: Services, Pricing, Process, Testimonials, Contact.
- **API:**
  - Read-only public endpoints (unauthenticated).
  - Authenticated write endpoints (dashboard only).
  - No content is hardcoded in the frontend.

## 4. Out of Scope (MVP)

- Multi-user / roles / workflow approvals.
- E-commerce, payments, or booking.
- Blog / CMS article system (Future Feature).
- i18n / multiple languages.
- Analytics.
- Mobile apps.
- Import tooling for legacy portfolios.

## 5. Functional Requirements

### FR-01 — Authentication

- Dashboard requires login.
- Single admin account seeded at setup; credentials configurable via environment.
- Sessions expire; public API never exposes admin capabilities.

### FR-02 — Content Management

- The dashboard provides create, read, update, delete, and publish/unpublish for all entities in the Content Model.
- Every visible piece of public content is editable from the dashboard.
- Changes publish immediately to the public site (or via explicit publish action).

### FR-03 — Public Portfolio

- All public pages are rendered from API data; no professional content is hardcoded.
- Pages adapt to audience context (recruiter vs. client) using the same data.
- Resume is downloadable as a file managed from the dashboard.

### FR-04 — Contact

- Public visitors can contact the owner (form or visible contact details).
- Inquiries are either emailed to the owner or stored for review in the dashboard (MVP: store + notify).

### FR-05 — Navigation & Site Settings

- Site name, tagline, logo, social links, and menu labels are dashboard-managed.
- The owner can enable/disable sections.

## 6. Non-Functional Requirements

### NFR-01 — Content/Code Separation

- The frontend MUST NOT contain hardcoded professional content.
- Content changes MUST NOT require a deploy or code edit.

### NFR-02 — Performance

- Public pages should reach good Core Web Vitals on typical connections.
- API responses should be cacheable.

### NFR-03 — Security

- Public API read-only; writes require authentication.
- Secrets (DB, auth) only in server environment, never in the frontend or committed files.

### NFR-04 — Maintainability

- Codebase understandable by a new contributor in one sitting.
- Consistent naming and project conventions documented.

### NFR-05 — Portability / Redesignability

- The content model is the contract; the public frontend can be swapped/redesigned without content migration.

### NFR-06 — Reliability

- Automated tests cover the API contract and critical dashboard flows.
- Clear, documented setup for local development.

## 7. User Flows

### Flow 1 — Owner updates content

1. Owner logs in to the dashboard.
2. Edits an entity (e.g., adds a project).
3. Publishes the change.
4. Public portfolio reflects the change without any code change or deploy.

### Flow 2 — Recruiter evaluates candidate

1. Opens public portfolio.
2. Reads About → Experience → Skills → Projects.
3. Downloads resume.
4. Contacts via contact section.

### Flow 3 — Freelance client evaluates service

1. Opens public portfolio.
2. Reads Services → Pricing → Process.
3. Reviews testimonials.
4. Sends an inquiry via contact.

### Flow 4 — Owner unpublishes content

1. Owner unpublishes an item (e.g., a stale project).
2. It disappears from the public site; data remains in the dashboard for later reuse.

## 8. User Stories

- As the owner, I can update my bio and see it live without touching code.
- As the owner, I can add/edit/remove projects, experience, skills, services, pricing, testimonials, and resume.
- As the owner, I can decide which sections appear on the public site.
- As a recruiter, I can quickly understand the owner's experience, skills, and impact.
- As a recruiter, I can download the resume and find contact details.
- As a freelance client, I can see services, pricing, process, and proof (testimonials/projects).
- As a freelance client, I can send an inquiry easily.
- As a developer, I can redesign the frontend without migrating content.

## 9. Acceptance Criteria

- **AC-01:** Changing any content in the dashboard updates the public site with no code edit.
- **AC-02:** No professional content (name, projects, skills, services, etc.) exists as literals in frontend source.
- **AC-03:** Recruiter path and client path are both fully populated from the same data.
- **AC-04:** Unauthorized users cannot read or write via authenticated API routes.
- **AC-05:** A new contributor can run the full stack locally following documented steps.
- **AC-06:** The public site passes the defined performance and accessibility checks.
- **AC-07:** Unpublishing an item removes it from the public site while preserving the data.

## 10. Content Model

All entities are dashboard-managed. Reference relationships between entities (e.g., a project lists its technologies).

| Entity              | Fields (representative)                                                     | Audience           |
| ------------------- | --------------------------------------------------------------------------- | ------------------ |
| **Profile**         | name, title, tagline, bio, photo, resume file, contact email                | Both               |
| **SocialLink**      | platform, url, order                                                        | Both               |
| **Experience**      | role, company, location, start, end, current, summary, bullets, order       | Recruiter          |
| **Education**       | degree, school, start, end, summary, order                                  | Recruiter          |
| **Skill**           | name, category, level, order                                                | Recruiter / Client |
| **Project**         | title, description, role, link, repo, technologies, images, featured, order | Both               |
| **Service**         | name, description, deliverables, price, order                               | Client             |
| **Pricing**         | plan/tier, price, period, features, order                                   | Client             |
| **Process**         | step, title, description, order                                             | Client             |
| **Testimonial**     | author, role, company, quote, avatar, order                                 | Client             |
| **Resume**          | downloadable document                                                       | Recruiter          |
| **ContactSettings** | email, phone, availability, location, form enabled                          | Both               |
| **SiteSettings**    | site name, tagline, navigation labels, section visibility                   | Both               |
| **Inquiry**         | name, email, message, receivedAt, read                                      | Client             |

## 11. Dashboard Modules

- **Overview** — status of published content, quick links.
- **Profile** — bio, title, tagline, photo, resume.
- **Experience** — CRUD for experience and education.
- **Skills** — CRUD for skills.
- **Projects** — CRUD for projects.
- **Services & Pricing** — CRUD for services, pricing tiers, process steps.
- **Testimonials** — CRUD for testimonials.
- **Contact & Settings** — contact details, social links, site settings, section visibility.
- **Inquiries** — review and manage visitor messages.
- **Auth** — login/logout.

## 12. Public Portfolio Modules

- **Home** — hero, tagline, call-to-action for both audiences.
- **About** — bio, photo, summary.
- **Experience** — timeline of roles + education (recruiter focus).
- **Skills** — categorized skills.
- **Projects** — portfolio of projects with links/technologies.
- **Services** — offerings, pricing, and process (client focus).
- **Testimonials** — client proof.
- **Resume** — download link.
- **Contact** — contact details / inquiry form.

## 13. Technical Constraints

- **Approved technology stack (MVP):**
  - **Frontend (portfolio + dashboard):** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Query.
  - **Backend (headless API):** Node.js, Express.js, TypeScript, JWT authentication, Multer (temporary file handling), Cloudinary SDK.
  - **Database:** MongoDB with Mongoose ODM (MongoDB Atlas in production).
  - **Media storage:** Cloudinary.
  - **Validation:** Zod (frontend) and a server-side validation layer.
  - **API style:** REST.
  - **Authentication:** single administrator; JWT access token (+ refresh token if required during implementation).
  - **Development tools:** ESLint, Prettier, Husky, lint-staged, Git, GitHub.
  - **Deployment:** frontend → Vercel; backend → Vercel (serverless Node function, decided 2026-08-09 — see AD-06/AD-19 in MASTER_PLAN); database → MongoDB Atlas; media → Cloudinary.
- **Repository layout:** `server/` (headless backend) and `client/` (Next.js app containing the public portfolio and the admin dashboard).
- **Content is data, not code:** stored in MongoDB; exposed via REST API.
- **No hardcoded content** in the frontend.
- **Minimal dependencies;** prefer boring, stable, well-known tooling.
- **Environment-driven configuration** for secrets and URLs.

## 14. Architecture Constraints

- Three connected parts: **Headless Backend** (`server/`), **Dashboard** (admin routes in `client/`), and **Portfolio Website** (public routes in `client/`).
- The backend is the single source of truth; the dashboard and portfolio are consumers.
- The API is the single access point to content for the portfolio and the dashboard.
- The dashboard shares the frontend codebase with the portfolio but is logically isolated (route-group separation) and protected by authentication.
- Clean separation of read (public) and write (admin) capabilities.
- Versioned API responses to allow future frontend upgrades without breaking consumers.
- Future consumers (mobile apps, portfolio templates, PDFs, public APIs, etc.) must be able to consume the same backend without content-layer changes.

## 15. API Expectations

- **Public (read):** `GET` endpoints for all public content entities, no auth.
- **Admin (write):** authenticated `POST / PUT / DELETE` endpoints used only by the dashboard.
- **Shape:** structured JSON (fields per Content Model); links/references included.
- **Consistency:** stable field naming; documented response shapes.
- **Errors:** standard HTTP status codes with machine-readable error bodies.

## 16. Future Features

- Blog / articles managed from the dashboard.
- Multiple public surfaces (e.g., dedicated freelance landing page).
- Scheduled publishing and content versioning.
- Analytics integrated into the dashboard.
- Multiple languages (i18n).
- Optional guest testimonial submissions.

## 17. Open Questions

**Resolved (2026-08-03):**

- ~~Technology stack~~ → **Resolved:** see §13.
- ~~Which database?~~ → **Resolved:** MongoDB (Atlas) with Mongoose.
- ~~Hosting targets?~~ → **Resolved:** frontend on Vercel; backend on Railway/Render (final provider TBD); MongoDB Atlas; Cloudinary.
- ~~Image uploads in MVP?~~ → **Resolved:** yes — Multer (temp) + Cloudinary SDK.

**Still open:**

- How are inquiries delivered — email service, dashboard inbox, or both?
- Is a refresh token required, or is a JWT access token sufficient? ("If required during implementation.")

**Resolved (2026-08-09):**

- ~~Final backend hosting provider: Railway or Render?~~ → **Resolved:** backend deployed on Vercel (serverless) alongside the frontend; see AD-06/AD-19 in MASTER_PLAN.

---

_The PRD is the source of truth for WHAT is built. Changes here require explicit sign-off._
