# Portfolio

A self-owned, content-managed professional portfolio platform. One profile powers a public portfolio for two audiences (recruiters and freelance clients), all content managed from an admin dashboard.

- `server/` — headless content API (Node.js, Express, TypeScript, MongoDB/Mongoose)
- `client/` — Next.js app hosting the public portfolio and the admin dashboard

Read the docs in [`docs/`](docs/) before contributing: vision, requirements (PRD), master plan, and daily log.

## Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)

## Setup

### 1. Server

```bash
cd server
npm install
cp .env.example .env   # then edit values (MONGODB_URI, JWT_SECRET, etc.)
npm run dev            # starts on http://localhost:4000
```

Verify it's running:

```bash
curl http://localhost:4000/api/v1/health
```

### 2. Client

```bash
cd client
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL defaults to http://localhost:4000/api/v1
npm run dev                  # starts on http://localhost:3000
```

## Scripts

### Server (`cd server`)

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `npm run dev`       | Run with hot reload (tsx)     |
| `npm run build`     | Compile TypeScript to `dist/` |
| `npm run start`     | Run the compiled build        |
| `npm run typecheck` | Type-check without emitting   |
| `npm run lint`      | ESLint                        |
| `npm run format`    | Prettier (write)              |

### Client (`cd client`)

| Command         | Purpose                  |
| --------------- | ------------------------ |
| `npm run dev`   | Next.js dev server       |
| `npm run build` | Production build         |
| `npm run start` | Run the production build |
| `npm run lint`  | ESLint                   |

### Root

| Command       | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `npm install` | Installs root tooling (Husky git hooks, lint-staged, Prettier) |

## Git Hooks

Husky + lint-staged run Prettier on staged files at every commit. Install hooks with `npm install` at the repo root.

## Conventions

- No professional content as literals in `client/` — content comes from the API.
- New major dependencies require approval (see `docs/MASTER_PLAN.md`).
- Commit message format: `type(scope): summary`.
