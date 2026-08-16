# Dynamic Portfolio

> **One profile. Every professional surface. Content-managed.**

A self-owned, headless content platform where a single professional profile powers a
public portfolio for **two audiences** — recruiters and freelance clients — with every
piece of content managed from a private admin dashboard. No code edits, no duplicated
content, no third-party lock-in.

| Part                 | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| [`server/`](server/) | Headless content API — Node.js, Express, TypeScript, MongoDB/Mongoose |
| [`client/`](client/) | Next.js app hosting the public portfolio **and** the admin dashboard  |

---

## Live Demo

- **Portfolio & dashboard:** https://dynamic-portfolio-d2r6.vercel.app
- **API base:** https://dynamic-portfolio-nine-blond.vercel.app/api/v1
- **Health check:** https://dynamic-portfolio-nine-blond.vercel.app/api/v1/health

---

## The Problem

Maintaining a professional online presence today means managing multiple disconnected
surfaces:

- A portfolio website for **recruiters**,
- A services/offerings page for **freelance clients**,
- A resume, bio, and social links scattered across platforms.

Every update forces the owner to edit code, duplicate content, and keep several
versions in sync. The result: an outdated, inconsistent, and inflexible presence that is
expensive to change and hard to redesign.

## The Solution

A single, self-owned content platform:

1. **A headless backend** (`server/`) — the single source of truth for all portfolio
   content, exposed through a REST API.
2. **A dashboard** — a private admin area inside the frontend where the owner manages
   every piece of content (no code required).
3. **A public portfolio** — a pure consumer of the API that renders the same underlying
   data differently for recruiters and for freelance clients.

**Content is data, not code.** Changing a skill, adding a project, or updating pricing
never touches source code. The frontend can be redesigned entirely without migrating a
single piece of content.

---

## Key Features

### Admin Dashboard (`/admin`)

- **Authentication** — JWT-based login with long-lived httpOnly-cookie sessions (1-year
  expiry, automatic logout on expiry).
- **Full CRUD** — manage every content entity: profile, hero, experience, education,
  skills, projects, services, pricing, process, testimonials, social links, and resume.
- **Publish/unpublish** — per-item toggle; unpublished items disappear from the public
  site while the data stays safe in the dashboard.
- **Media management** — image uploads with crop-on-upload (16:10 projects, 16:9 proof
  screenshots), drag-to-reorder galleries, full-image previews, and Cloudinary cleanup
  when images change or entities are deleted.
- **Inquiries inbox** — review, mark read/unread, and manage visitor messages.
- **Settings** — site name, navigation labels, section visibility, contact details, and
  social links.
- **Toast feedback** — every operation (create/update/delete/publish/upload/login)
  confirms or surfaces errors with precise, consistent notifications.

### Public Portfolio

- **Recruiter path** — hero, about (with resume download), experience timeline, skills,
  projects, and contact.
- **Freelance client path** — services, pricing, process, testimonials, and an inquiry
  form.
- **Project detail pages** — premium galleries, stack cards, and linked client reviews.
- **Testimonials** — linked to projects with optional proof screenshots.
- **Resume download** — streamed directly from the database (no third-party dependency).
- **Immersive design** — dark mode, `motion` animations, scroll reveals, reading progress
  bar, fully responsive.
- **Contact** — mailto + copy button and an inquiry form; new messages email the owner
  via **Resend** and alert the dashboard instantly.

### Performance & Reliability

- **Single-request API** — all public content ships in one `GET /api/v1/bundle`
  response (1 request per page load instead of ~14).
- **Cold-start optimized** — serverless API blocks only on the database connect; caching
  (60s TTL + tag-based revalidation) at the Next.js layer with instant purge on every
  dashboard write.
- **ISR + hydration** — the home page ships content inside the page HTML, so the
  portfolio never renders blank on a cold instance.
- **Tested** — 60 automated API tests (Vitest + Supertest).

---

## Tech Stack

| Layer        | Technology                               | Purpose                            |
| ------------ | ---------------------------------------- | ---------------------------------- |
| **Frontend** | Next.js 16 (App Router, Turbopack)       | Public portfolio + admin dashboard |
|              | React 19, TypeScript                     | UI and type safety                 |
|              | Tailwind CSS v4                          | Styling                            |
|              | shadcn/ui (Base UI preset)               | Accessible UI primitives           |
|              | React Hook Form + Zod                    | Typed forms and validation         |
|              | TanStack Query                           | Server-state and data fetching     |
|              | `motion` (Framer Motion)                 | Scroll reveals and animations      |
|              | `react-easy-crop`                        | Image cropping on upload           |
|              | `sonner`                                 | Toast notifications                |
| **Backend**  | Node.js 20+, Express 5, TypeScript (ESM) | Headless REST API                  |
|              | MongoDB + Mongoose 9                     | Data storage and modeling          |
|              | JWT (`jsonwebtoken` + `bcryptjs`)        | Authentication                     |
|              | Multer                                   | Temporary file handling            |
|              | Cloudinary SDK                           | Media upload/storage               |
|              | Zod                                      | API request validation             |
|              | Pino                                     | Structured logging                 |
| **Tooling**  | Vitest + Supertest                       | API test suite                     |
|              | Husky + lint-staged + Prettier           | Git hooks and formatting           |
|              | ESLint + Prettier                        | Linting and code style             |

## Architecture

Three connected parts, with the backend as the single source of truth:

```
                        ┌─────────────────────┐
                        │  Headless Backend   │
                        │  (server/ · REST)   │
                        └──────────┬──────────┘
                                   │  public: read / admin: write
                  ┌────────────────┴────────────────┐
                  │                                 │
        ┌─────────┴─────────┐           ┌───────────┴───────────┐
        │  Public Portfolio │           │      Dashboard       │
        │  (client/, public)│           │  (client/, admin)     │
        └───────────────────┘           └───────────────────────┘
```

The frontend proxies **all** API traffic through Next.js route handlers
(`/api/public/*`, `/api/admin/*`, `/api/auth/*`, `/api/media`) — the browser never talks
to the backend directly, and CORS is never exposed.

---

## Integrations

- **MongoDB Atlas** — hosted database (also works with local MongoDB).
- **Cloudinary** — image/document uploads, cropping, and asset cleanup.
- **Resend** — email notifications for new inquiries (native `fetch`, no SDK).
- **Vercel** — hosts both the frontend (Next.js) and the backend (serverless Node
  function).
- **JWT** — stateless authentication for the dashboard.

---

## Repository Structure

```
portfolio/                          # monorepo root
├── server/                         # Headless content API (Express + TypeScript)
│   ├── src/
│   │   ├── config/                 # zod-validated environment configuration
│   │   ├── controllers/            # public + admin request handlers
│   │   ├── lib/                    # jwt, password, logger, admin seeding, bootstrap
│   │   ├── middleware/             # auth guard, request logger, upload (Multer)
│   │   ├── models/                 # Mongoose models for the content model (16 entities)
│   │   ├── routes/                 # public, admin, auth, media, health routers
│   │   ├── scripts/                # seed:admin, seed:content
│   │   ├── services/               # Cloudinary, upload, email (Resend)
│   │   ├── types/                  # shared TypeScript model types
│   │   └── validation/             # zod schemas per entity
│   └── tests/                      # Vitest + Supertest suite (60 tests)
├── client/                         # Next.js app — public portfolio + admin dashboard
│   └── src/
│       ├── app/(admin)/            # /admin/* dashboard routes (login-guarded)
│       ├── app/(public)/           # public portfolio routes incl. /projects/[slug]
│       ├── app/api/                # Next proxies: public, admin, auth, media
│       ├── components/admin/       # dashboard UI (managers, forms, pickers)
│       ├── components/public/      # portfolio UI (hero, about, projects, ...)
│       ├── components/ui/          # shadcn/ui primitives
│       ├── hooks/                  # TanStack Query hooks (content, public bundle)
│       └── lib/                    # content types, API clients, icons, helpers
├── docs/                           # vision, PRD, master plan, daily log, deployment
├── .husky/                         # pre-commit hook (Prettier on staged files)
└── package.json                    # root tooling (Husky, lint-staged, Prettier)
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **MongoDB** — local install, or a free [MongoDB Atlas](https://www.mongodb.com/atlas)
  cluster (connection string only)
- Optional: a [Cloudinary](https://cloudinary.com) account (media) and a
  [Resend](https://resend.com) API key (inquiry emails) — leave blank to run without them

### 1. Server (`server/`)

```bash
cd server
npm install
cp .env.example .env   # then edit MONGODB_URI, JWT_SECRET, ADMIN_EMAIL/ADMIN_PASSWORD, Cloudinary keys
npm run dev            # starts on http://localhost:4000
```

Verify it's running:

```bash
curl http://localhost:4000/api/v1/health
```

The admin account is auto-seeded at startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(you can also run `npm run seed:admin`). Optionally load real portfolio content with
`npm run seed:content`.

### 2. Client (`client/`)

```bash
cd client
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL defaults to http://localhost:4000/api/v1
npm run dev                  # starts on http://localhost:3000
```

Open **http://localhost:3000** for the public portfolio and **http://localhost:3000/admin**
for the dashboard.

---

## Scripts

### Root

| Command       | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `npm install` | Installs root tooling (Husky git hooks, lint-staged, Prettier) |

### Server (`cd server`)

| Command                | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Run with hot reload (tsx)        |
| `npm run build`        | Compile TypeScript to `dist/`    |
| `npm run start`        | Run the compiled build           |
| `npm run typecheck`    | Type-check without emitting      |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier (write)                 |
| `npm run seed:admin`   | Create/reset the admin account   |
| `npm run seed:content` | Seed real portfolio content      |
| `npm test`             | Run the Vitest + Supertest suite |

### Client (`cd client`)

| Command         | Purpose                  |
| --------------- | ------------------------ |
| `npm run dev`   | Next.js dev server       |
| `npm run build` | Production build         |
| `npm run start` | Run the production build |
| `npm run lint`  | ESLint                   |

---

## Testing

The backend ships a **Vitest + Supertest** suite — **60 tests** across 3 files:

| File                                  | Tests | Covers                                                                                                                    |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| `server/tests/api.test.ts`            | 51    | health, public reads, inquiries + email notifications, auth, admin CRUD, media uploads/deletion, resume streaming, bundle |
| `server/tests/email.test.ts`          | 3     | Resend notification posts, dedupe window, provider failures                                                               |
| `server/tests/cloudinary-url.test.ts` | 6     | Cloudinary asset-URL parsing for cleanup                                                                                  |

```bash
cd server && npm test
```

Tests run against a dedicated local database (`portfolio_test`), so they are safe to run
alongside a dev environment. The client quality gates are `npm run lint`, `tsc`, and
`next build` (the client has no unit-test suite — its correctness is covered by the API
contract tests plus type-checking).

---

## Pre-Commit Behavior

Every commit is automatically formatted by a **Husky pre-commit hook**
(`.husky/pre-commit`):

1. Detects staged files (`git diff --cached`) of supported types —
   `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, `.json`, `.md`, `.css`.
2. Runs **Prettier `--write`** on them.
3. Re-stages the formatted files.
4. **Blocks the commit** if Prettier reports an error.

No lint or type-check runs in the hook — those run manually per app
(`npm run lint`, `npm run typecheck`, `npm test`). Hooks are installed with
`npm install` at the repo root.

**Commit message convention:** `type(scope): summary`

```
docs(readme): rewrite README as professional project overview
feat(server): add public bundle endpoint
fix(client): resolve project detail by id when slug is missing
```

---

## Project Documentation

The `docs/` folder is the source of truth for why/what/how the product is built:

| Document                                                       | Contents                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`docs/PROJECT_VISION.md`](docs/PROJECT_VISION.md)             | Why the product exists, personas, success criteria                |
| [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | What is built — the official PRD, content model, API expectations |
| [`docs/MASTER_PLAN.md`](docs/MASTER_PLAN.md)                   | How it is built — milestones, architecture decisions (AD-01…24)   |
| [`docs/DAILY_LOG.md`](docs/DAILY_LOG.md)                       | Chronological record of every work session                        |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)                     | Full deployment and operations guide                              |

---

## Deployment

The platform is deployed across four services:

| Service      | Host                              | Notes                             |
| ------------ | --------------------------------- | --------------------------------- |
| **Frontend** | Vercel (Next.js)                  | public portfolio + dashboard      |
| **Backend**  | Vercel (serverless Node function) | headless REST API                 |
| **Database** | MongoDB Atlas                     | collections auto-created on write |
| **Media**    | Cloudinary                        | images and documents              |

**Key environment variables:**

- **Server:** `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
  `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
  `CLIENT_URL`, optional `EMAIL_API_KEY` / `EMAIL_FROM` / `INQUIRY_NOTIFY_EMAIL` (Resend).
- **Client:** `NEXT_PUBLIC_API_URL` (inlined at build time — rebuild after changing it).

Step-by-step deployment instructions (Vercel projects, Atlas setup, Cloudinary, and
post-deploy verification) live in **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)**.

---

## Contributing & Forking

This project is a showcase of a real-world full-stack architecture — contributions,
ideas, and improvements are welcome. To contribute:

1. **Fork** the repository on GitHub.
2. **Clone** your fork and add the original as an upstream remote:
   ```bash
   git clone https://github.com/<your-user>/dynamic-portfolio.git
   cd dynamic-portfolio
   git remote add upstream https://github.com/mustafa-muhamma/dynamic-portfolio.git
   ```
3. **Create a branch** for your change:
   ```bash
   git checkout -b feat/your-feature
   ```
4. **Install dependencies** and set up the project (see [Getting Started](#getting-started)).
5. **Make your change**, run the checks (`npm test`, `npm run lint`, `npm run typecheck`,
   `npm run build`), and commit with a conventional message — the pre-commit hook formats
   your staged files automatically.
6. **Keep your fork in sync** before opening a pull request:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
7. **Push** and open a **Pull Request** against `main`.

### Contribution rules

- **No professional content in `client/`** — content must come from the API, never
  hardcoded in the frontend source (project acceptance criterion AC-02).
- **New major dependencies require approval** — propose why it is needed, alternatives
  considered, trade-offs, and long-term maintenance impact (see
  `docs/MASTER_PLAN.md` → Dependency Approval Process).
- **Keep the docs current** — update `docs/MASTER_PLAN.md` (and add a `DAILY_LOG.md`
  entry) when the work changes scope, decisions, or milestones.
- **Boring technology wins** — prefer mature, well-known, stable tools over
  bleeding-edge ones; minimize dependencies.

---

## Status & Roadmap

**Project complete.** All milestones (M0–M5) are delivered and the platform is live:

- [x] M0 — Foundations (documentation, architecture, scaffolding)
- [x] M1 — Server foundations (content API, auth, media, 60 tests)
- [x] M2 — Dashboard (full content management)
- [x] M3 — Public portfolio (recruiter + freelance client paths)
- [x] M4 — Content & polish (real content populated via the dashboard)
- [x] M5 — Hardening & launch (deployment, cold-start optimization, caching)

**Backlog / future features:** CI/CD automation via GitHub, blog/articles, scheduled
publishing and content versioning, analytics in the dashboard, i18n, and multi-surface
growth (see `docs/PRODUCT_REQUIREMENTS.md` §16).

---

## License

Not yet specified — contact the project owner for usage terms.
