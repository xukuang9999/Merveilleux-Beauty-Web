# Merveilleux Beauty

Public skincare catalogue, distributor training, knowledge base, AI advisor and administration console. Built with Next.js 16.2.9, React 19, TypeScript, Tailwind CSS 4, Drizzle ORM and PostgreSQL.

## Development

```bash
npm ci
cp .env.example .env.local
# Set DATABASE_URL to your own PostgreSQL database.
npm run db:push
# Optional: set BOOTSTRAP_ADMIN_EMAIL/PASSWORD to create the first site owner.
npm run db:seed
npm run dev
```

Public pages also work without DATABASE_URL using the curated 44-product catalogue. Accounts, saved enquiries/subscriptions and training progress require PostgreSQL. A configured database is authoritative: hiding or deleting all managed content leaves it empty. Database outages do not republish hidden catalogue or knowledge-base entries.

`db:seed` adds missing initial content without deleting accounts, sessions or overwriting admin edits. It respects initialized managed catalogues. It creates no demo users by default. `SEED_DEMO_USERS=1` is accepted only against a loopback database outside production. Demo credentials are not displayed on the website and are rejected for production sign-in. An existing owner is never reset by bootstrap variables.

## Checks

```bash
npm run lint
npm test
npm run test:content
npm run build
```

`npm test` runs the data and security checks. The PostgreSQL concurrency test is opt-in via `SECURITY_TEST_DATABASE_URL`; it only permits the isolated loopback fixture `127.0.0.1:55441/merc_audit`. A normal application DATABASE_URL does not enable fixture mutations. `test:content` checks catalogue/quiz translation coverage, current bundle arithmetic and legacy compatibility.

Next.js APIs must be checked against the installed guides in `node_modules/next/dist/docs/` before changing the application.

## Routes and access

| Audience | Routes |
| --- | --- |
| Public | `/`, `/about`, `/products`, `/products/[slug]`, `/gallery`, `/testimonials`, `/faq`, `/contact`, `/join`, `/training` |
| Optional public features | `/promotions`, `/news`, `/blog`, `/blog/[slug]` |
| Sign-in | `/login`, `/register` |
| Customer | `/account`, `/account/consult` |
| Distributor and administrators | `/portal`, `/portal/training`, `/portal/knowledge`, `/portal/assistant` |
| Administrators | `/admin` and products, promotions, knowledge base, enquiries and progress pages |
| Site owner | User roles, media, appearance, feature settings, copy overrides and master-only actions |

Optional features and Bahasa Melayu are controlled in admin settings. The sitemap follows enabled features and publication status. Page translations use the `mb_lang` cookie (English, Simplified Chinese, Bahasa Melayu).

## Database and deployment

Set DATABASE_URL for the application. For Supabase transaction pooling, use port 6543 with prepared statements disabled (already configured); set DIRECT_DATABASE_URL to the direct/session connection for `db:push`. Standalone database tools load `.env.local` or an explicit `ENV_FILE`.

Apply `npm run db:push` before running the changed application. This includes `src/db/rate-limit-schema.ts`, the shared PostgreSQL quota table used by sign-in, registration and chat, and automatically applies its backend-only policy (RLS plus client grant revocation). For an existing database, the equivalent additive SQL is in `src/db/migrations/20261004_rate_limit_buckets.sql`. Rate-limit storage failures disable guarded operations. Authentication uses asynchronous scrypt and database sessions. Chat uses server-generated visitor/session keys and shared global budgets; forwarded-IP headers are not trusted as limiter identities.

For a new database, supply BOOTSTRAP_ADMIN_EMAIL and a unique 12–128-character BOOTSTRAP_ADMIN_PASSWORD for the seed run, then remove the bootstrap password from the deployment environment. Existing installations must rotate or remove legacy default demo credentials and revoke old sessions before enabling their accounts. Production sign-in refuses the original demo email/password combinations.

Set ANTHROPIC_API_KEY to enable Claude responses. Set BLOB_READ_WRITE_TOKEN for persistent image uploads on Vercel; without it, uploads write locally for development. Build and start with `npm run build` and `npm start`. Local build success does not deploy the website or apply a remote database migration.

## Content

Canonical product data lives in `src/lib/catalogue-products.ts`; localized overlays are in `src/i18n/content/`. Admin-managed data lives in PostgreSQL. Concept packaging images are labeled publicly; unverified product facts are not invented. Contact links are configured in `src/lib/data.ts`. Brand-owned social links must point to confirmed profiles.

The audit and repair coverage register is in [docs/audit-2026-10-04.md](docs/audit-2026-10-04.md).
