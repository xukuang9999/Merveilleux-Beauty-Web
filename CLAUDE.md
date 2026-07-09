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
`admin@merveilleux.test / admin1234`, `distributor@… / dist1234`, `customer@… / cust1234`.

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

- **Products** — `src/lib/seed-data.ts` (`seedProducts`) is the **canonical source of truth**;
  the DB is only an *overlay keyed by `slug`*. An admin edit to a matching slug wins,
  unpublishing hides it, and orphaned legacy DB rows are ignored. This guarantees every product
  has a real image at `public/products/<graphic>.jpg` and the storefront can never blank out.
  **To add/change a product, edit `seed-data.ts`** (not just the DB).
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
- `api/chat/route.ts` — the **only** API route: streaming Claude (Node runtime, in-instance rate limit).

**Mutations are React Server Actions**, not API routes — files named `*-actions.ts` in `src/lib/`
(`auth-actions`, `admin-actions`, `enquiry-actions`, `newsletter-actions`, `training-actions`).

**Auth** (`src/lib/auth.ts` + `src/lib/auth-core.ts`), dependency-free / Lucia-style: scrypt
hashing, DB-backed sessions, `mb_session` httpOnly cookie holding a token whose sha-256 is the
stored session id. Roles `customer | distributor | admin`. `getCurrentUser()` is React-`cache`d;
`requireUser()` / `requireRole()` redirect. **`auth-core.ts` has no Next.js imports** so the seed
script can reuse the crypto — keep it import-clean.

**AI** (`src/lib/ai.ts`) — one `MODEL` constant and three `ChatMode`s (`customer | consult |
training`) selecting a system prompt. RAG is done by **string-concatenating** product catalog +
FAQ (customer) or + KB (consult/training) into the system prompt. `consult`/`training` require
auth; `training` is distributor/admin only (re-checked in the chat route).

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
