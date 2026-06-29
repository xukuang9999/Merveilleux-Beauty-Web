# Merveilleux Beauty — Website + 经销商 Training (MVP)

The corporate website and distributor (经销商) training shell for **Merveilleux Beauty**,
an OEM French beauty house. This is the MVP for **Workstream B (Website)** plus a preview
of **Workstream A (Training LMS)** from the [system planning document](docs/system-planning.html).

> Built with Next.js + Tailwind, deployed on Vercel. Brand graphics were generated with the
> Codex CLI and live in [`public/graphics/`](public/graphics).

## What's inside

| Route | Page |
| --- | --- |
| `/` | Home — hero, value props, product collection, brand statement, testimonials, join CTA |
| `/products` | The 4-product OEM range with ingredients & benefits |
| `/testimonials` | Customer & 经销商 stories |
| `/faq` | Q&A grouped by Products / Skincare / Distributor |
| `/contact` | 经销商 enquiry form (hands off to WhatsApp) + contact channels |
| `/training` | **LMS shell** — module cards, progress tracker, interactive demo quiz (70% pass mark) |

Plus `sitemap.xml`, `robots.txt`, OpenGraph metadata, and a branded 404.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design tokens (rose / gold / charcoal palette, Cormorant Garamond + DM Sans) in [`src/app/globals.css`](src/app/globals.css)
- **next/font** for self-hosted Google Fonts
- Static-rendered (every route prerenders) — fast and cheap on Vercel
- Brand SVG assets generated via **Codex CLI**

## Project structure

```
src/
  app/            # routes (App Router)
  components/     # Nav, Footer, ui primitives, ProductCard, EnquiryForm, TrainingShell
  lib/data.ts     # all site content (products, testimonials, FAQs, training modules)
public/graphics/  # Codex-generated brand SVGs (logo, monogram, hero, products, etc.)
docs/             # original system-planning document
```

All copy and content lives in [`src/lib/data.ts`](src/lib/data.ts) so it can later be swapped
for a headless CMS (Sanity/Contentful) without touching the UI.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Configuration to finish before launch

Update the placeholders in [`src/lib/data.ts`](src/lib/data.ts) → the `site` object:

- `whatsapp` — real WhatsApp Business number (digits only, with country code)
- `email` — real contact inbox
- `instagram` — real handle
- product copy, ingredients and testimonials → replace with approved brand content

## Roadmap (from the planning doc)

This MVP delivers Workstream B and an A preview. Next, per the master roadmap:

1. **A · Training LMS** — secure 经销商 login, full 20-question banks, video lessons,
   saved progress, PIC completion notifications, in-person booking calendar
2. **C · 知识库** — searchable skincare knowledge base with AI Q&A (RAG)
3. **D · Multi-Agent AI** — branding / design / sales / promotions agents
4. **E · Virtual Grace** — AI avatar (pending confirmation)

## Deployment

Hosted on **Vercel**, connected to this GitHub repository — every push to `main`
triggers a production deployment.
