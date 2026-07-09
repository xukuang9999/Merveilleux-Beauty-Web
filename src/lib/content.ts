// Public content access — reads from the DB, falls back to curated seed
// data if the database isn't reachable, and overlays the active locale's
// translations (English is the canonical source).
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, testimonials, faqs, promotions } from "@/db/schema";
import {
  seedProducts,
  seedTestimonials,
  seedFaqs,
  seedKbArticles,
  seedNews,
  seedBundles,
  type SeedProduct,
} from "./seed-data";
import { getLocale, getDictionary } from "@/i18n/server";
import type { Locale } from "@/i18n/config";
import { contentPack } from "@/i18n/content";

export type ProductView = Omit<SeedProduct, "sortOrder">;
export type ArticleView = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  tags: string[];
};
export type TestimonialView = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};
export type FaqView = { category: string; question: string; answer: string };

export async function getProducts(): Promise<ProductView[]> {
  const pack = contentPack(await getLocale());

  // The curated catalogue in seed-data.ts is the canonical source of truth for
  // the public storefront — it guarantees every product has a valid image under
  // /products/*.jpg. The database is treated as an OPTIONAL overlay keyed by
  // slug: an admin edit to a matching product wins, unpublishing it hides it,
  // and orphaned legacy rows (old SKUs whose graphics were deleted) are simply
  // ignored so they can never blank out the storefront again.
  const base = [...seedProducts].sort((a, b) => a.sortOrder - b.sortOrder);

  const edits = new Map<string, typeof products.$inferSelect>();
  try {
    const db_rows = await db.select().from(products);
    for (const r of db_rows) edits.set(r.slug, r);
  } catch {
    // DB unreachable — render the curated catalogue as-is.
  }

  const rows: ProductView[] = [];
  for (const p of base) {
    const edit = edits.get(p.slug);
    if (edit && !edit.published) continue; // admin hid this product
    const src = edit ?? p;
    rows.push({
      slug: p.slug,
      name: src.name,
      type: src.type,
      tagline: src.tagline,
      description: src.description,
      keyIngredients: src.keyIngredients,
      benefits: src.benefits,
      priceRM: src.priceRM,
      graphic: src.graphic,
    });
  }

  if (!pack) return rows;
  return rows.map((p) => {
    const t = pack.products[p.slug];
    return t ? { ...p, ...t } : p;
  });
}

export async function getProduct(slug: string): Promise<ProductView | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  const pack = contentPack(await getLocale());
  let rows: TestimonialView[];
  try {
    const db_rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.sortOrder));
    rows = db_rows.length ? db_rows : seedTestimonials;
  } catch {
    rows = seedTestimonials;
  }
  if (!pack) return rows;
  return rows.map((t) => {
    const tr = pack.testimonials[t.name];
    return tr ? { ...t, quote: tr.quote, role: tr.role } : t;
  });
}

// Public skincare-tips blog — sourced from the curated KB library and
// overlaid with the active locale's translation (kept in sync with the
// distributor knowledge base, but surfaced publicly as "Skincare Tips").
export async function getArticles(): Promise<ArticleView[]> {
  const pack = contentPack(await getLocale());
  const base: ArticleView[] = [...seedKbArticles]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      body: a.body,
      tags: a.tags,
    }));
  if (!pack) return base;
  return base.map((a) => {
    const t = pack.kb[a.slug];
    return t
      ? { ...a, title: t.title, category: t.category, excerpt: t.excerpt, body: t.body }
      : a;
  });
}

export async function getArticle(slug: string): Promise<ArticleView | null> {
  const all = await getArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export type NewsView = {
  code: string;
  type: "post" | "reel";
  permalink: string;
  image: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
};

// News/journal — curated real posts from the brand Instagram, localised to
// the active locale. Newest first. Not DB-backed (small, editorial content).
export async function getNews(limit?: number): Promise<NewsView[]> {
  const locale = await getLocale();
  const items = [...seedNews]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((n) => ({
      code: n.code,
      type: n.type,
      permalink: n.permalink,
      image: n.image,
      date: n.date,
      category: n.category[locale],
      title: n.title[locale],
      excerpt: n.excerpt[locale],
    }));
  return limit ? items.slice(0, limit) : items;
}

export type PromotionView = {
  slug: string;
  title: string;
  description: string;
  tag: string | null;
  priceRM: string;
  wasRM: string;
  saveRM: string;
  graphic: string;
  productSlugs: string[];
};

function pickLocale(
  map: Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!map) return "";
  return map[locale] ?? map.en ?? Object.values(map)[0] ?? "";
}

// Fallback projection from the curated seed bundles + dictionary copy, used
// when the promotions table is empty (unseeded) or the DB is unreachable.
function seedPromotionViews(locale: Locale): PromotionView[] {
  const bundles = getDictionary(locale).promotions.bundles;
  return seedBundles.map((b, i) => {
    const copy = bundles[i];
    return {
      slug: b.slug,
      title: copy?.title ?? b.slug,
      description: copy?.desc ?? "",
      tag: copy?.tag ?? null,
      priceRM: b.priceRM,
      wasRM: b.wasRM,
      saveRM: b.saveRM,
      graphic: b.graphic,
      productSlugs: b.productSlugs,
    };
  });
}

/** Published promotions for the public page, localised. The DB is the source
 *  of truth once it holds any rows (so unpublishing all yields an empty list);
 *  an empty/unseeded table or an unreachable DB falls back to the seed bundles. */
export async function getPromotions(): Promise<PromotionView[]> {
  const locale = await getLocale();
  try {
    const rows = await db.select().from(promotions);
    if (rows.length) {
      return rows
        .filter((r) => r.published)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((r) => ({
          slug: r.slug,
          title: pickLocale(r.title, locale),
          description: pickLocale(r.description, locale),
          tag: r.tag ? pickLocale(r.tag, locale) || null : null,
          priceRM: r.priceRM,
          wasRM: r.wasRM,
          saveRM: r.saveRM,
          graphic: r.graphic,
          productSlugs: r.productSlugs,
        }));
    }
  } catch {
    // fall through to the curated seed bundles
  }
  return seedPromotionViews(locale);
}

export async function getFaqs(): Promise<FaqView[]> {
  const pack = contentPack(await getLocale());
  let base: FaqView[];
  try {
    const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    base = (rows.length ? rows : seedFaqs).map((f) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
    }));
  } catch {
    base = seedFaqs.map((f) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
    }));
  }
  if (!pack) return base;
  return base.map((f, i) => pack.faqs[i] ?? f);
}
