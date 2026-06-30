# Merveilleux Beauty — Full digital ecosystem

The website, distributor (经销商) training LMS, knowledge base, AI advisor and admin
console for **Merveilleux Beauty**, an OEM French beauty house. This implements all five
workstreams from the [system planning document](docs/system-planning.html):

- **B · Website** — marketing site with an 8-product catalogue and a hero AI advisor
- **A · Training LMS** — login-gated modules, quizzes (70% pass) and saved progress
- **C · 知识库** — searchable skincare knowledge base with AI Q&A
- **D · AI agents** — customer-service chat + a distributor training coach / consultant
- **E · Virtual advisor** — "Margaux", a stylized AI avatar in the hero (consent-safe;
  swappable for a real video clip later)

> Built with Next.js 16 + Tailwind v4 + SQLite (libSQL/Turso) + Claude. Brand graphics
> generated with the Codex CLI. Deployed on Vercel.

## Routes

| Area | Routes |
| --- | --- |
| Public | `/`, `/products`, `/testimonials`, `/faq`, `/contact`, `/training` |
| Auth | `/login`, `/register` |
| Customer | `/account`, `/account/consult` (AI skincare consult) |
| 经销商 | `/portal`, `/portal/training`, `/portal/knowledge`, `/portal/assistant` |
| Admin | `/admin` (+ products, kb, progress, users, enquiries) |
| API | `/api/chat` (streaming Claude) |

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, **Tailwind CSS v4**
- **Database:** SQLite via **Drizzle ORM** + **libSQL** — local file in dev, **Turso** in prod
- **Auth:** dependency-free email/password with scrypt hashing + DB-backed sessions
  (Lucia-style), three roles: `customer`, `distributor`, `admin`
- **AI:** **Claude** (`@anthropic-ai/sdk`) streaming chat with RAG context (products + FAQ + KB)
- Brand SVGs generated via **Codex CLI** ([`public/graphics/`](public/graphics))

## Project structure

```
src/
  app/
    (site)/        # public marketing pages + chat widget
    (auth)/        # login / register
    (app)/         # authenticated dashboards (account / portal / admin)
    api/chat/      # streaming Claude endpoint
  components/      # Nav, HeroAvatar, ChatPanel/Widget, PortalTraining, DashboardShell, …
  db/             # Drizzle schema, client, seed
  lib/            # auth, ai, content, kb, training, server actions
public/graphics/   # Codex-generated brand SVGs
docs/              # original system-planning document
```

## Local development

```bash
npm install
npm run db:reset   # create local.db schema + seed content & demo users
npm run dev        # http://localhost:3000
```

**Demo accounts** (from the seed):

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@merveilleux.test | admin1234 |
| 经销商 | distributor@merveilleux.test | dist1234 |
| Customer | customer@merveilleux.test | cust1234 |

## Production setup (Vercel)

The public site works immediately (it falls back to seeded content). To enable
accounts, training, the knowledge base and the AI advisor, set three env vars:

1. **Database — Turso (libSQL):**
   ```bash
   turso auth login
   turso db create merveilleux
   turso db show merveilleux --url           # → TURSO_DATABASE_URL
   turso db tokens create merveilleux        # → TURSO_AUTH_TOKEN
   # then push schema + seed against it:
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run db:reset
   ```
2. **AI — Anthropic:** create a key at <https://console.anthropic.com> → `ANTHROPIC_API_KEY`
3. Add all three to **Vercel → Project → Settings → Environment Variables**, then redeploy.

See [`.env.example`](.env.example). Every push to `main` auto-deploys.

## Notes

- The hero "digital human" is a **stylized brand avatar**, not a real person — no likeness
  consent issues. Swap `public/graphics/avatar.svg` (or wire a `<video>`) for a real clip later.
- ⚠️ **Trademark:** research found a pre-existing Malaysian skincare line "Merveilleux –
  France HQ" plus other "Merveilleux" entities. Consider a trademark/name check before launch.
- Update brand contact details (WhatsApp, email, Instagram) in [`src/lib/data.ts`](src/lib/data.ts).
