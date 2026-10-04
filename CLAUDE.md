# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ **Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4** — newer than your
> training data. Before writing framework code, read the relevant guide in
> `node_modules/next/dist/docs/` and heed deprecation notices.

The digital ecosystem for **Mérvéilléux Premium** (a French-grade beauty house operated by
**Bellesenze Group Sdn Bhd**, Malaysia): marketing site + distributor (经销商) training LMS +
knowledge base + AI advisor + admin console. Brand naming lives in `src/lib/data.ts` — the
public brand is "Mérvéilléux Premium" / wordmark "Mérvéilléux"; don't rename it.

## Commands

```bash
npm run dev        # dev server on :3000 (Turbopack)
npm run build      # production build
npm run lint       # eslint (flat config, eslint.config.mjs)

npm run db:push    # apply schema.ts + rate-limit-schema.ts to PostgreSQL
npm run db:seed    # additive initial content; explicit owner bootstrap; demo users opt-in
npm run db:reset   # db:push + db:seed — the usual first-run / post-pull setup
npm run db:import  # tsx src/db/import-extracted.ts — import extracted product cards as
                   # UNPUBLISHED drafts (dry-run by default; pass --commit to write)
```

The DB CLI scripts need `DATABASE_URL` (Next.js loads `.env*` automatically; drizzle-kit / tsx
don't, so `src/db/load-env.ts` loads it). To target a specific DB, prefix with an env file, e.g.
`ENV_FILE=.env.supabase npm run db:push` (assembles the Supabase pooler URLs from a password so
only the password is pasted). **Never point local dev at production Supabase.**

Run `npm test`, `npm run lint` and `npm run build`. Browser checks should use an isolated local PostgreSQL fixture. Demo users require `SEED_DEMO_USERS=1`, a loopback database and non-production mode; default demo credentials cannot sign in in production. Use explicit owner bootstrap for a fresh real database.

**Database is Postgres** (migrated off Turso/SQLite — Turso vars may linger in Vercel as unused
rollback safety, ignore them). The connection is built in `src/db/index.ts` from `DATABASE_URL`:

- **Production** → Supabase Postgres via the **transaction-mode pooler** (`…pooler.supabase.com:6543`),
  which requires `prepare: false` (already set). Region ap-southeast-1.
- **Local dev** → local Postgres (Postgres.app) on `localhost:5432`, DB `merveilleux_dev`; set in
  `.env.development.local`.
- **Migrations / seeding** use `DIRECT_DATABASE_URL` (Supabase **session** pooler `:5432`) — the
  transaction pooler isn't suited to DDL. `drizzle.config.ts` and `load-env.ts` handle the split.
- **DB unset / unreachable** → `src/db/index.ts` points at an unreachable local address with a short
  `connect_timeout`, so queries **reject fast instead of hanging** (critical: a hang would stall
  Next's static generation). Managed content reads in `content.ts` are bounded and fail closed for configured database outages,
  so the public site still renders; **accounts / training / admin stay inert** until a DB is set.

`hasRemoteDb` (exported from `src/db`, = `Boolean(DATABASE_URL)`) gates features needing real
persistence. AI is gated on `ANTHROPIC_API_KEY` via `aiConfigured()` / `getAnthropic()`
(`src/lib/ai.ts`); the chat route degrades to a "not switched on" message rather than erroring. So
the public site never hard-crashes with no DB and no API key. The repo has **public git history** —
never commit credentials; all `.env*` files are gitignored.

## Content model — the important part

`src/lib/content.ts` is the single read layer, and **the three content types resolve differently**:

- **Products** — the current curated 44-product catalogue is `seedProducts` (from `catalogue-products.ts`). Without a configured DB, it is available for public previews. A populated or initialized database is authoritative: only published rows appear. Hide/delete writes an initialization marker so an intentionally empty catalogue remains empty. Configured-DB read failures fail closed instead of resurrecting seed products.
- **Promotions** — admin-managed per-locale JSON copy; blank translations fall back to English. Product references must resolve to published products. Initialized empty data stays empty. Configured-DB failures fail closed.
- **Knowledge base** — follows the same managed-content policy; hidden drafts are available only through authorized preview links.
- **Testimonials & FAQs** — DB-first, `seed*` arrays as fallback when the DB is empty/unreachable.
- **News** — seed-only: `seedNews` in `seed-data.ts` is a static Instagram feed (permalinks),
  no DB table. Rendered at `/news` via `NewsCard`.

Everything read here is then overlaid with the active locale's translation (see i18n below).

## Architecture

**Route groups** (`src/app/`) = audiences, each with its own layout/guard:
- `(site)` — public marketing pages (`/products` + `/products/[slug]`, `/promotions`, `/blog` +
  `/blog/[slug]` "Skincare Tips", `/news`, `/gallery`, `/testimonials`, `/faq`, `/about`,
  `/contact`, `/join`, `/training`) + chat widget
- `(auth)` — login / register
- `(app)` — authenticated dashboards: `account` (customer, incl. `/consult`), `portal`
  (distributor / 经销商: `/training`, `/knowledge`, `/assistant`), `admin`. Guards live in the
  layouts.
- API routes (mutations are otherwise server actions): `api/chat/route.ts` (streaming Claude,
  Node runtime, shared PostgreSQL rate limits) and `api/admin/media/route.ts` (admin-tier image upload).

**Mutations are React Server Actions**, not API routes — files named `*-actions.ts` in `src/lib/`
(`auth-actions`, `admin-actions`, `enquiry-actions`, `newsletter-actions`, `training-actions`).

**Auth** (`src/lib/auth.ts` + `src/lib/auth-core.ts`), dependency-free / Lucia-style: scrypt
hashing, DB-backed sessions, `mb_session` httpOnly cookie holding a token whose sha-256 is the
stored session id. Roles `customer | distributor | admin | master_admin`. `getCurrentUser()` is
React-`cache`d; `requireUser()` / `requireRole()` redirect. **`auth-core.ts` has no Next.js
imports** so the seed script can reuse the crypto — keep it import-clean.

Admin-tier guards are the single source of truth for the two admin tiers — never gate on the raw
role string: `isAdminTier` / `isMasterAdmin`, `requireAdmin()` (admin **or** master) and
`requireMasterAdmin()` (master only; bounces a normal admin to `/admin`). A role change revokes the
user's sessions (`deleteUserSessions`).

## Admin console (two-tier)

`(app)/admin/*` is gated by `(app)/admin/layout.tsx` → `requireAdmin()`. Two tiers:

- **admin** (content ops): products, promotions, media *upload*, KB, training progress, enquiries.
- **master_admin** (everything above, plus site administration): user management, appearance,
  feature flags, editable site copy, and media *delete*.

Enforce on **both** the page and its server action (`src/lib/admin-actions.ts`); nav/tile
visibility (`DashboardShell.tsx`, `admin/page.tsx`) is cosmetic only. Master-only surfaces call
`requireMasterAdmin()`; admin-tier surfaces call `requireAdmin()`.

**Site settings live in `src/lib/settings.ts`** and all degrade to coded defaults when the DB is
empty/unreachable — the tables only store overrides:
- **Feature flags** (`feature_flags`) — `getFeatureFlags()` / `isFeatureEnabled()`; default-on.
  Applied in **both** UI and routing: nav/footer filter links (client-safe `feature-links.ts`
  map), gated routes `notFound()`, ChatWidget only mounts when `aiChat` is on. Toggling
  `revalidatePath("/", "layout")`.
- **Appearance** (`site_settings`, key `appearance`) — `getAppearance()`; curated brand colour
  tokens + a font allowlist (no remote fonts). The root layout injects only the changed values as
  **inline CSS custom properties on `<html>`** (they beat the compiled `@theme` `:root` defaults).
  Colours are hex-validated / fonts allowlist-checked server-side before they can reach the DOM.
- **Editable copy** (`site_copy`, unique `key`+`locale`) — `getCopy()` returns
  `copy(key, fallback)` for the request locale; the editable fields are registered in
  `copy-registry.ts` (each resolves to its dictionary default). Edited **one language per locale**
  per the i18n rule; a value equal to the default (or blank) removes the override.

**Media / uploads** (`src/lib/media.ts` + `POST /api/admin/media`, admin-tier): validates type
(JPEG/PNG/WebP/AVIF) + size (≤5 MB), then `storeImage` uploads to **Vercel Blob** when
`BLOB_READ_WRITE_TOKEN` is set, else writes to `public/products` (local-dev fallback, no config).
Uploaded assets are tracked in `media_assets`; `/admin/media` browses them and master admins delete
them (`deleteStoredImage` removes the blob/file too). The `ImageUploadField` widget in the product
form stores the returned URL on `products.graphic`. Blob URLs need `images.remotePatterns` in
`next.config.ts` (already set); local `/products/*` paths need none.

**AI** (`src/lib/ai.ts`) — one `MODEL` constant and three `ChatMode`s (`customer | consult |
training`) selecting a system prompt. RAG is done by **string-concatenating** product catalog +
FAQ (customer) or + KB (consult/training) into the system prompt. `consult`/`training` require
auth; `training` is distributor/admin/master only (re-checked in the chat route).

**i18n — two cookie-driven layers (`mb_lang`), locales `en | zh | ms`:**
- **UI strings** → `src/i18n/dictionaries/{en,zh,ms}.ts`, read via `getDict()` / `getLocale()`
  (`src/i18n/server.ts`, request-cached).
- **DB/seed content** (products, testimonials, KB, modules) → translation *overlays* in
  `src/i18n/content/{zh,ms}.ts`; English is canonical (no pack). `contentPack(locale)` merges on
  top inside `content.ts`/`kb.ts`. **Adding translatable content means updating the seed data
  AND every content pack** (keyed by slug / name / `ord`).

**Landing hero** — `src/components/ScrollVideoHero.tsx` scrubs a 90-frame JPEG sequence
(`public/videos/frames/spa-*.jpg`) painted to a `<canvas>` (smoother than scrubbing a `<video>`).
Boutique photography in `public/renders/` is used as page backdrops.

Path alias: `@/*` → `src/*`.
