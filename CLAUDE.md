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

npm run db:push    # apply src/db/schema.ts to the DB (drizzle-kit, no migration files)
npm run db:seed    # run src/db/seed.ts — seeds content + 3 demo users
npm run db:reset   # db:push + db:seed — the usual first-run / post-pull setup
```

No test runner is configured. Verify changes by driving the app. Demo logins after seeding:
`master@merveilleux.test / master1234` (master admin), `admin@merveilleux.test / admin1234`
(admin), `distributor@… / dist1234`, `customer@… / cust1234`.

## Environment / data resolution

The DB URL is resolved at runtime in `src/db/index.ts`, and this cascade shapes behavior:

1. `TURSO_DATABASE_URL` set → real Turso (dev or prod).
2. No Turso but on Vercel → **in-memory** DB (serverless FS is read-only). Public pages still
   render from curated seed data; **accounts / training / admin are inert**.
3. Local dev → `file:./local.db`.

`hasRemoteDb` (exported from `src/db`) gates features needing real persistence. AI is gated on
`ANTHROPIC_API_KEY` via `aiConfigured()` / `getAnthropic()` (`src/lib/ai.ts`); the chat route
degrades to a "not switched on" message rather than erroring. So the public site never
hard-crashes with no DB and no API key.

## Content model — the important part

`src/lib/content.ts` is the single read layer, and **the three content types resolve differently**:

- **Products** — additive: `seedProducts` in `src/lib/seed-data.ts` is the canonical base, and
  the DB is a slug-keyed **overlay** (an edit to a matching seed slug wins; unpublishing hides
  that seed product). DB rows whose slug is *not* in the seed catalogue appear on the storefront
  **only when explicitly published** — `products.published` defaults to `false`, so
  unpublished/orphan rows are ignored and the storefront can never blank out. Seed products are
  seeded as published. Editing an existing seed product and creating brand-new products are both
  done in the admin; product photos are set by **upload** (see the admin console section), not by
  hand-editing paths.
- **Promotions** — DB-backed and admin-managed (`promotions` table, per-locale JSON copy).
  `getPromotions()` is the source of truth once the table holds rows, falling back to the seed
  bundles (`seedBundles` + dict copy) when empty/unreachable.
- **Testimonials & FAQs** — DB-first, `seed*` arrays as fallback when the DB is empty/unreachable.
- **News** — seed-only: `seedNews` in `seed-data.ts` is a static Instagram feed (permalinks),
  no DB table. Rendered at `/news` via `NewsCard`.

Everything read here is then overlaid with the active locale's translation (see i18n below).

## Architecture

**Route groups** (`src/app/`) = audiences, each with its own layout/guard:
- `(site)` — public marketing pages (incl. `/news`, `/join`, `/products`) + chat widget
- `(auth)` — login / register
- `(app)` — authenticated dashboards: `account` (customer), `portal` (distributor / 经销商),
  `admin`. Guards live in the layouts.
- API routes (mutations are otherwise server actions): `api/chat/route.ts` (streaming Claude,
  Node runtime, in-instance rate limit) and `api/admin/media/route.ts` (admin-tier image upload).

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
