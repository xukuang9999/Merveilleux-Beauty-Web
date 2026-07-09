# Two-Tier Admin Permission System — Implementation Plan

Adds a `master_admin` tier above the existing `admin` role, on top of the current
customer / distributor / admin auth. Master admins can do everything; normal admins are
limited to content operations.

## How it fits the existing code

- **Roles** live in one enum (`src/db/schema.ts` → `users.role`) with a TS-derived `Role`
  type; guards are `requireRole()` / `requireUser()` in `src/lib/auth.ts`. There are
  ~13 `requireRole(["admin"])`-style call sites plus the client `Role` unions in
  `DashboardShell.tsx` and `Nav.tsx`.
- The role enum is **text-only** (SQLite/Turso don't enforce it), so adding `master_admin`
  needs **no destructive migration** — `npm run db:push` adds any new tables/columns
  non-destructively.
- **Theming** is already CSS-variable based: `@theme { --color-bronze … }` in `globals.css`,
  fonts wired via `--font-serif` / `--font-sans`. Appearance settings override these at
  runtime by injecting a `<style>:root{…}</style>` in the root layout — no component rewrites.
- **Content** already has a DB-overlay + seed-fallback + i18n-overlay pattern (`content.ts`);
  new editable copy / flags / appearance follow the same "graceful when DB is down" discipline.

## Core design decisions

**Capability helpers (not scattered role checks).** Add to `auth.ts`:

- `isAdminTier(role)` → `admin | master_admin`
- `requireAdmin()` = `requireRole(["admin","master_admin"])` — master inherits everything
  admin can do
- `requireMasterAdmin()` = `requireRole(["master_admin"])`

Every existing `requireRole(["admin"])` becomes `requireAdmin()`; master-only surfaces use
`requireMasterAdmin()`. **Both the page and its server action enforce** — UI hiding is
cosmetic only.

**New tables** (all key/value-ish, seeded with sensible defaults, all degrade to defaults
when the DB is unreachable):

- `featureFlags(key PK, enabled, updatedAt)`
- `siteSettings(key PK, value JSON)` — appearance (palette + font choices)
- `siteCopy(key, locale, value)` UNIQUE(key, locale) — bilingual, one language per locale
  per CLAUDE.md
- `mediaAssets(id, url, kind, label, uploadedBy, createdAt)`
- `promotions(…)` — new table for admin-managed promotions (currently static)

## Confirmed scope

- **Normal admin keeps:** Products, Promotions, KB, Training-Progress, Enquiries, and
  marketing/product media uploads.
- **Master-only:** Appearance settings, Feature flags, Site copy, full Media management
  (delete + site-structural media), User management.
- **Promotions:** new `promotions` table + `/admin/promotions` CRUD (admin-tier, bilingual).
- **Media:** Vercel Blob (needs a `BLOB_READ_WRITE_TOKEN` env var) with a local-filesystem
  dev fallback so it can be tested without the token.
- **Editable copy:** Home + About + Contact, each with EN / 中文 / BM fields (generic table,
  expandable later).

## Phases (each independently reviewable & committable)

| # | Phase | Tier gate | Key deliverable |
|---|-------|-----------|-----------------|
| 0 | Role foundation | — | `master_admin` exists; both test accounts log in; helpers `requireAdmin()` / `requireMasterAdmin()` |
| 1 | Two-tier gate | admin vs master | User mgmt → master-only; capability-driven nav; server-enforced |
| 2 | Feature flags | master | `/admin/features`; features hide + routes 404 site-wide |
| 3 | Appearance settings | master | `/admin/appearance`; palette/fonts → CSS vars, hex-validated |
| 4 | Editable copy (Home/About/Contact) | master | `/admin/content`; per-locale fields, dictionary fallback |
| 5 | Promotions CRUD | **admin** | `promotions` table + `/admin/promotions`, bilingual |
| 6 | Media manager (Vercel Blob) | admin upload / master delete | `/admin/media`; product + marketing uploads, master site media |
| 7 | Docs + verification | — | CLAUDE.md update + two-account verification matrix |

Promotions (Phase 5) and media (Phase 6) are split out because they add external surface
(a new public-facing table and a storage dependency), so they can be reviewed in isolation.

### Phase detail

- **Phase 0 — Role foundation.** Add `master_admin` to the enum + `Role`; add capability
  helpers; `roleHome.master_admin = "/admin"`; extend `Role` unions + badges in
  `DashboardShell` / `Nav`; add `roleMasterAdmin` label to en/zh/ms dictionaries; seed a
  `master_admin@merveilleux.test` account and keep `admin@merveilleux.test`. Convert all
  `["admin"]` guards → `requireAdmin()` and `["distributor","admin"]` → add `master_admin`;
  update the chat-route training check. *Verify: both accounts log in, master lands on
  /admin, nothing regresses.*
- **Phase 1 — Two-tier gate (no new features).** Add `(app)/admin/layout.tsx` calling
  `requireAdmin()`. Move user management to master-only (`/admin/users` + `setUserRole` →
  `requireMasterAdmin()`; extend role-validation & last-admin lockout to cover
  `master_admin`, and block anyone but master from creating/editing admin/master accounts).
  Make `DashboardShell` admin nav capability-driven (base admin tiles vs. master-only tiles)
  and gate the dashboard index tiles the same way. *Verify: normal admin sees only content
  sections and is server-redirected away from /admin/users; master sees all.*
- **Phase 2 — Feature flags.** `featureFlags` table + `src/lib/settings.ts`
  (`getFeatureFlags()`, `isFeatureEnabled()`, cached, default-on). Master-only
  `/admin/features` page + toggle action. Apply flags in both places: hide nav/footer links
  & mount points (ChatWidget in `(site)/layout`, home sections) and `notFound()`-guard the
  routes (booking, AI chat, testimonials, gallery, promotions, news…). *Verify: toggling off
  removes it site-wide and 404s the route.*
- **Phase 3 — Appearance settings.** `siteSettings` + `getAppearance()`; root layout injects
  a validated `<style id="site-theme">` overriding `--color-*` / font vars. Master-only
  `/admin/appearance` with color pickers for the documented brand tokens + font selector.
  **Security: strict hex / allowlist validation** before anything reaches the `<style>` tag
  (prevents stored CSS/script injection). *Verify: master changes bronze → whole site
  updates; DB-down falls back to compiled palette.*
- **Phase 4 — Editable site copy (bilingual).** `siteCopy` table + `getCopy(key, locale)`
  with fallback to current dictionary defaults. Master-only `/admin/content` editor showing
  one field per locale (EN / 中文 / BM) — enforcing one language per locale per CLAUDE.md.
  Wire Home / About / Contact copy keys to read overrides. *Verify: master edits homepage
  hero in all 3 languages; live site reflects it, unset keys fall back.*
- **Phase 5 — Promotions CRUD.** `promotions` table + admin-tier `/admin/promotions` page,
  bilingual. *Verify: admin creates/updates a promotion; it renders on the public
  /promotions page.*
- **Phase 6 — Media manager.** `mediaAssets` + upload/delete actions with type/size
  validation, backed by Vercel Blob (local-fs dev fallback). Normal admin uploads product
  photos (in `/admin/products`) and marketing material; master additionally deletes assets
  and manages site-structural media. *Verify: upload → asset usable by URL; delete works;
  permission split holds.*
- **Phase 7 — Docs + verification.** Update CLAUDE.md (role tiers, capability helpers, new
  tables, appearance injection, flag/copy conventions) and run the full two-account
  verification matrix.

## Cross-cutting notes

- **Seed idempotency:** the master account seed will be safely re-runnable (or use
  `npm run db:reset` in dev).
- **Session invalidation on role change** already exists (`deleteUserSessions`) — reused for
  promotions/demotions across the new tier.
- **CSS-injection safety:** appearance colors and any user-supplied string landing in an
  injected `<style>` tag get strict hex/allowlist validation; fonts are a **curated
  allowlist** rather than free text (avoids arbitrary remote font loading and injection).
