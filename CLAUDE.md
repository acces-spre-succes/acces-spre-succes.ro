# Acces spre Succes — Project Guide for Claude Code

Website for **Asociația "Acces spre Succes"**, a non-profit from Bistrița,
Romania. Three independently deployable services in one git repo:

- `backend/` — Spring Boot REST API
- `client-frontend/` — public site
- `admin-frontend/` — admin panel

Local dev runs everything via `docker-compose.yml` at the repo root
(`docker compose up -d`).

## Stack at a glance

| Layer            | Tech                                                          |
|------------------|---------------------------------------------------------------|
| Backend          | Java 21 · Spring Boot 4.0.0-M3 · Maven                        |
| Persistence      | PostgreSQL via JPA/Hibernate (`ddl-auto=update`)              |
| Auth             | Spring Security 7 + JJWT 0.12.6 (HS256, 24h) · BCrypt         |
| Database (cloud) | Neon Postgres                                                 |
| Frontends        | React 19 · Vite 5 · plain JS/JSX (no TypeScript)              |
| Routing (public) | react-router-dom 7                                            |
| i18n (public)    | react-i18next (Romanian / English, default `ro`)              |
| Animation        | framer-motion (client-frontend only)                          |
| Payments         | Stripe today, EuPlătesc planned                               |

The `admin-frontend/` is intentionally lean — only `react`/`react-dom`,
no axios, no router. It uses native `fetch` through the `authFetch`
wrapper.

## Where things live

```
backend/src/main/java/com/test/site_ong/
  ├─ articles/           # Articles feature (model + repo + service + controller)
  ├─ upcoming_project/   # Upcoming projects
  ├─ completed_project/  # Completed projects
  ├─ volunteerForm/      # Public "I want to volunteer" form submissions (private data)
  ├─ donators/           # Donations + Stripe checkout
  ├─ comments/           # Article/project comments
  ├─ stripe/             # Stripe service wrapper
  ├─ auth/               # JWT auth: model, repo, service, filter, controller, bootstrap
  ├─ health/             # /api/health
  └─ config/             # WebConfig (static /uploads handler)

admin-frontend/src/
  ├─ App.js              # Top-level layout, login gate, section routing
  ├─ components/         # Articles, Volunteers, UpcomingProjects, etc.
  ├─ services/auth.js    # authFetch wrapper, token storage, login/logout/verifyToken
  ├─ config.js           # API_BASE_URL & BACKEND_URL, env-driven via VITE_API_BASE_URL
  └─ styles/style.css    # All admin styling (single file)

client-frontend/src/
  ├─ App.js              # Public site routes
  ├─ pages/              # HomePage, ArticlesPage, DonatePage, etc.
  ├─ components/Layout/  # Navbar, Footer
  ├─ i18n.js             # ro/en translations (single file)
  └─ config.js           # API_BASE_URL & BACKEND_URL & STRIPE_SERVER_URL
```

## Auth flow

- Public site: anonymous, only hits `GET` endpoints + a few public form `POST`s.
- Admin panel:
  - Login form posts `{username, password}` to `POST /api/auth/login`
  - Server returns `{token, username}` (JWT, HS256, 24h)
  - Frontend stores token in `localStorage` and sends it in `Authorization: Bearer ...`
  - Frontend calls `GET /api/auth/me` on mount to verify the token is still valid
  - All admin API calls go through `authFetch` (`admin-frontend/src/services/auth.js`),
    which auto-attaches the token and forces logout on a 401.
- First admin is seeded by `AdminBootstrap` on first startup from
  `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` env vars.
  After one admin exists in the DB the bootstrap is a no-op.

## Environment / secrets

- Local: `.env` at repo root (gitignored), template is `.env.example`.
- Production backend (Fly.io): `fly secrets set ...` — the same keys
  but stored encrypted on Fly.
- Production frontends (Vercel): set `VITE_API_BASE_URL=https://api.acces-spre-succes.ro`
  in each project's Environment Variables UI; everything else is build-time only.

## Deployment

- **Public site** → Vercel project, Root Directory `client-frontend`,
  custom domain `acces-spre-succes.ro` (+ `www`).
- **Admin panel** → Vercel project, Root Directory `admin-frontend`,
  custom domain `admin.acces-spre-succes.ro`. Carries an
  `X-Robots-Tag: noindex, nofollow` header from `vercel.json`.
- **Backend** → Fly.io app `acces-spre-succes-ro` in region `fra`,
  shared-cpu-1x with 512 MB RAM, auto-stop machines, persistent
  volume `ong_uploads` mounted at `/app/uploads`. See `backend/fly.toml`.
- **DNS** → Cloudflare zone, **all records DNS-only (gray cloud)**.
  Vercel and Fly each issue their own Let's Encrypt certs; Cloudflare
  proxy in front breaks issuance.

## Conventions

- Never hardcode URLs or DB creds — read them from `config.js`
  (frontends) or `application.properties` placeholders (backend).
- Every admin API call in `admin-frontend/` MUST go through
  `authFetch` so the JWT is auto-attached and 401s force logout.
- Image upload pattern: multipart `POST` with field `image`, server
  saves to `/app/uploads/<timestamp>_<original-name>` and stores the
  relative `imagePath` (or `photoPath`) in the DB. Frontend renders
  `${BACKEND_URL}${entity.imagePath}`.
- `package-lock.json` is committed for both frontends; keep them in
  sync with `package.json`. Vercel uses `npm ci --include=dev`.
- Frontend build outputs to `build/` (legacy CRA convention, not
  Vite's default `dist/`); Vite is configured for this in
  `vite.config.js`.
- `ddl-auto=update` — entity changes auto-migrate the DB. Treat each
  entity edit as a schema migration; avoid renames on production data.

## Common gotchas

- **Vercel "Root Directory" has its own Save button** separate from
  the Build Settings save. It's bitten us before; double-check it
  actually persists.
- **Fly machines are ephemeral** — anything written outside `/app/uploads`
  (the mounted volume) is wiped on redeploy. Always store user data
  via the DB or the volume.
- **Cloudflare proxy (orange cloud) breaks Vercel/Fly cert issuance.**
  Always set DNS records to "DNS only" (gray cloud).
- **Two `Volunteer`-ish concepts.** `volunteerForm/Volunteer` holds
  *private application form submissions* (don't display these
  publicly!). For the public team listing, use the `TeamMember`
  entity / `/api/team` endpoint.

## Useful commands

```bash
# Local dev (everything)
docker compose up -d
docker compose logs -f backend

# Backend only, native (faster reload)
cd backend && mvn spring-boot:run

# Admin frontend, native dev server
cd admin-frontend && npm install && npm start

# Public frontend, native dev server
cd client-frontend && npm install && npm start

# Deploy backend
cd backend && fly deploy

# Tail prod logs
fly logs --app acces-spre-succes-ro

# Push to Vercel — just `git push origin master`, both projects auto-deploy
```
