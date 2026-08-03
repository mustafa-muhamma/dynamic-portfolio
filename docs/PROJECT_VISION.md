# PROJECT VISION

> **Status:** Draft / Stable
> **Last Updated:** 2026-08-03
> **Owner:** Project Owner
>
> This document defines **WHY** this product exists. It changes only when the product vision itself changes.

---

## Problem Statement

Maintaining a professional online presence today requires managing multiple, disconnected surfaces:

- A portfolio website for **recruiters**
- A service/offerings page for **freelance clients**
- A resume/CV, bio, and social links scattered across platforms

Every update forces the owner to edit code, duplicate content, and keep several versions in sync. The result: an outdated, inconsistent, and inflexible presence that is expensive to change and hard to redesign.

## Product Vision

A single, self-owned content platform where **one professional profile** powers every public surface.

The owner manages all content through a **dashboard**. A decoupled **public portfolio** consumes that content through an API. Changing a skill, adding a project, or updating pricing never requires touching source code.

## Mission

Give the owner complete control over their professional identity by making **content** the single source of truth and the **frontend** a pure consumer of that content.

## Long-Term Vision

A headless content platform that:

- Serves **multiple audiences** (recruiters, freelance clients, and future audiences) from the same data.
- Survives **frontend redesigns** without content migration.
- Grows from a single-user portfolio into a multi-surface professional presence without an architectural rewrite.
- Remains simple enough for contributors (and the owner) to understand and extend.

## Target Users

| User | Description |
|---|---|
| **Owner / Content Manager** | The person who creates, edits, and publishes all content through the dashboard. |
| **Recruiter** | Views the portfolio to evaluate the owner as a candidate. Needs credibility signals: experience, skills, projects, resume. |
| **Freelance Client** | Views the portfolio to evaluate the owner as a service provider. Needs services, pricing, process, testimonials, contact path. |

## User Personas

### Persona 1 — The Owner (Content Manager)
- **Needs:** Update content quickly, publish from anywhere, no code required.
- **Pain points:** Editing HTML to change text; fear of breaking the site; content stored in many places.
- **Goal:** Log in, edit, publish, and see the change live.

### Persona 2 — Priya, the Recruiter
- **Needs:** Fast signal on experience, skills, and impact. Wants a downloadable resume and clear project evidence.
- **Pain points:** Slow sites, buried contact info, unclear career timeline.
- **Goal:** In under 2 minutes, decide whether the owner is worth an interview.

### Persona 3 — Dan, the Freelance Client
- **Needs:** Proof of capability, service clarity, pricing transparency, and a clear way to start a project.
- **Pain points:** Portfolios that show no services, no pricing, no process, no testimonials.
- **Goal:** Feel confident the owner can deliver, and know exactly what it costs and how to engage.

## Product Philosophy

1. **Content owns. Frontend consumes.** The frontend renders whatever the dashboard provides; it never hardcodes professional content.
2. **One source of truth.** Every fact about the owner exists exactly once.
3. **Audience-aware, not audience-forked.** The same underlying data is shaped for different audiences — never duplicated per audience.
4. **Redesign without migration.** The content model is the contract; the presentation is replaceable.
5. **Simplicity over cleverness.** The system stays boring, predictable, and easy to extend.
6. **Self-owned.** No third-party lock-in for the owner's professional data.

## Success Criteria

The project is **successful ONLY if** all of the following are true:

- The owner **never edits portfolio source code** to update content.
- **Every visible piece of content** can be managed from the dashboard.
- The **same professional data** serves multiple audiences (Recruiters & Freelance Clients).
- The frontend **consumes content instead of owning it**.
- The owner can **redesign the frontend** in the future without migrating content.
- The codebase is **simple enough for contributors to understand**.
- The architecture **supports future growth without requiring a rewrite**.

## Design Principles

- **Content-first layout:** Components are generic; content gives them meaning.
- **Audience-aware presentation:** The same content is framed differently for recruiters vs. clients (e.g., "Resume" vs. "Services & Pricing").
- **Fast by default:** Public pages prioritize load speed.
- **Accessible and responsive:** Works on any device; readable by assistive technology.
- **Unobtrusive editing:** The dashboard is isolated from public routes; editing never pollutes the presentation.

## Technical Principles

- **Decoupled architecture:** The headless backend is the single source of truth and deploys separately; the dashboard is an admin area inside the frontend app, logically isolated from public routes.
- **API as the contract:** The content API is versioned and stable.
- **Data over layout:** Content is stored as structured data, not HTML strings, whenever possible.
- **Convention over configuration:** Minimal setup for contributors.
- **Boring technology:** Prefer widely-known, stable tools over bleeding-edge ones.
- **Secure by default:** Admin access is protected; public API is read-only.

## Technology Principles

- Choose mature and well-supported libraries.
- Prefer simplicity over feature richness.
- Minimize dependencies whenever possible.
- Avoid introducing new libraries unless they provide significant value.
- Prefer libraries already familiar to the project.
- Every dependency must have a clear purpose.
- New major dependencies require approval, with justification covering: why it is needed, alternatives considered, trade-offs, and long-term maintenance impact.

## Non-Goals

- No social network / community features.
- No multi-tenancy (other users publishing their own portfolios) in the MVP.
- No e-commerce, payments, or online booking in the MVP.
- No complex CMS workflows (workflows, approvals, roles) in the MVP.
- No native mobile apps in the MVP.
- No migration of existing legacy portfolio data in the MVP (fresh start).

## Future Vision

- New public surfaces (e.g., a focused freelance landing page, a blog) served from the same API.
- Optional guest testimonials and an inquiry inbox managed from the dashboard.
- Content versioning and scheduled publishing.
- Analytics surfaced inside the dashboard.
- If demand exists, evolve into a small multi-user platform — made possible because the core is already decoupled.

---

*This document is a living artifact but intentionally stable. Changes require explicit product-vision decisions.*
