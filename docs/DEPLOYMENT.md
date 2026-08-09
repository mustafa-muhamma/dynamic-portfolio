# DEPLOYMENT

> **Status:** Live
> **Last Updated:** 2026-08-09
>
> How the portfolio platform is deployed and operated. Follow this to reproduce,
> update, or redeploy any part of the stack.

---

## Architecture

Three connected parts (see PRD §14):

| Part                                              | Host                              | URL (production)                                  |
| ------------------------------------------------- | --------------------------------- | ------------------------------------------------- |
| **Frontend** (public portfolio + admin dashboard) | Vercel (Next.js)                  | `https://dynamic-portfolio-d2r6.vercel.app`       |
| **Backend** (headless content API)                | Vercel (serverless Node function) | `https://dynamic-portfolio-nine-blond.vercel.app` |
| **Database**                                      | MongoDB Atlas                     | —                                                 |
| **Media storage**                                 | Cloudinary                        | —                                                 |

The backend is the single source of truth. The frontend proxies all API traffic
through Next route handlers (`/api/public/*`, `/api/admin/*`, `/api/auth/*`,
`/api/media`) so the browser only ever talks to the frontend origin.

## Accounts & credentials

- **Vercel** — two projects: one for the frontend (`client/`), one for the backend (`server/`).
- **MongoDB Atlas** — one free cluster with a database user.
- **Cloudinary** — one cloud with API key/secret.

Secrets (DB URI, JWT secret, Cloudinary creds, admin password) live **only** in the
deployment dashboard env vars — never in the repo.

## Backend (`server/`) on Vercel

The server ships a serverless handler (`server/src/index.ts` default export) and a
long-running process (`node dist/index.js`). On Vercel it runs as a Node function.

**Env vars (Vercel project — Server → Settings → Environment Variables):**

| Key                     | Example / notes                                                                   |
| ----------------------- | --------------------------------------------------------------------------------- |
| `NODE_ENV`              | `production`                                                                      |
| `PORT`                  | leave unset (Vercel injects)                                                      |
| `CLIENT_URL`            | `https://dynamic-portfolio-d2r6.vercel.app` (CORS origin)                         |
| `MONGODB_URI`           | Atlas connection string (`mongodb+srv://user:pass@cluster.mongodb.net/portfolio`) |
| `JWT_SECRET`            | long random string                                                                |
| `JWT_ACCESS_EXPIRES`    | `365d`                                                                            |
| `JWT_REFRESH_EXPIRES`   | `7d`                                                                              |
| `ADMIN_EMAIL`           | admin login email (auto-seeded at first boot)                                     |
| `ADMIN_PASSWORD`        | admin login password (min 8 chars)                                                |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                                                             |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                                |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                                             |

**Build/settings:** build command `npm run build` (outputs `dist/`); the serverless
handler is the default export of `dist/index.js`.

**Cold starts (important):** Vercel serverless instances boot on demand. The first
request after idle waits only for the database connect (capped at 5s); admin seeding
and the Cloudinary ping run in the background, and the Mongoose pool is capped at one
connection per instance so cold starts never exhaust Atlas M0 (see AD-19). If a cold
request ever fails, confirm the Atlas connection string and that Atlas Network Access
allows `0.0.0.0/0`.

**Redeploy:** push to the connected branch (auto-deploy) or `vercel --prod` from `server/`.

## Frontend (`client/`) on Vercel

**Env vars (Vercel project):**

| Key                   | Example                                                  |
| --------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://dynamic-portfolio-nine-blond.vercel.app/api/v1` |

**Settings:** framework Next.js, root directory `client/`, build command default
(`next build`). No build-time data fetching, so the build does not need a live API.

**Redeploy:** push to the connected branch (auto-deploy) or `vercel --prod` from `client/`.

> After changing `NEXT_PUBLIC_API_URL`, the frontend must be **rebuilt** — it is
> inlined at build time (`client/src/lib/config.ts`).

## MongoDB Atlas

1. Create a free cluster (M0, shared).
2. Add a database user (username + password) — used in the connection string.
3. **Network Access → IP Access List → allow from anywhere (`0.0.0.0/0`)** so the
   serverless API can connect from any egress IP.
4. Copy the `mongodb+srv://...` connection string into the backend `MONGODB_URI`.
5. The API auto-creates collections on first write and auto-seeds the admin on boot.

## Cloudinary

1. Create a free cloud.
2. Copy **Cloud Name**, **API Key**, **API Secret** into the backend env vars.
3. Media uploads go browser → frontend `/api/media` → backend → Cloudinary.

## Post-deploy verification

```bash
# Backend health + DB state (expect 200, database.ok: true)
curl https://dynamic-portfolio-nine-blond.vercel.app/api/v1/health

# Public content
curl https://dynamic-portfolio-nine-blond.vercel.app/api/v1/profile
curl https://dynamic-portfolio-nine-blond.vercel.app/api/v1/projects

# Resume download streams a PDF
curl -I https://dynamic-portfolio-nine-blond.vercel.app/api/v1/resume/download

# Frontend proxies the same content
curl https://dynamic-portfolio-d2r6.vercel.app/api/public/hero
```

Manual checks: public portfolio renders all sections; log in at `/admin` with
`ADMIN_EMAIL`/`ADMIN_PASSWORD`; add/edit content; submit a contact inquiry; upload an
image and a resume.

## Operations notes

- Content is managed from the dashboard — no code edits for content changes (AC-01).
- Admin sessions are 1-year JWTs in an httpOnly cookie; expired tokens auto-logout.
- Test/dummy inquiries posted during verification should be deleted from
  `/admin/inquiries`.
- Future hardening (pending M5): security review, rate limiting, performance pass,
  and CI/CD automation (see `docs/MASTER_PLAN.md`).
