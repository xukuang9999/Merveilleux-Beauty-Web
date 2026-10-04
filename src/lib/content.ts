// Public content access — reads the authoritative DB, uses curated seed
// data before configuration/initialization, and overlays the active locale's
// translations (English is the canonical source).
import { asc } from "drizzle-orm";
import { db, hasRemoteDb, withDbDeadline } from "@/db";
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
import { normalizeLegacyProductCopy, normalizeLegacyBundle } from "./catalogue-compat";
import {
  contentInitialized,
  publishedContent,
  pickContentLocale,
  validPromotionReferences,
} from "./content-state";

export type ProductView = Omit<SeedProduct, "sortOrder"> & {
  // Retail price for East Malaysia; null until one is set, in which case
  // `priceRM` (West Malaysia) is shown on its own, unlabelled.
  priceRMEast: string | null;
};
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

  // No database: show the curated catalogue immediately. Once a database has
  // content, its publication/deletion state is authoritative for the whole list.
  const base = [...seedProducts]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({ ...p, priceRMEast: null }));
  let source: Array<(typeof products.$inferSelect) | (typeof base)[number]> = base;
  if (hasRemoteDb) {
    try {
      const dbRows = await withDbDeadline(
        db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id)),
      );
      const initialized = dbRows.length > 0 || await contentInitialized("products");
      source = publishedContent(dbRows, initialized, base);
    } catch {
      // A configured database outage must not resurrect withdrawn products.
      source = [];
    }
  }
  const rows: ProductView[] = source.map((p) => normalizeLegacyProductCopy({
      slug: p.slug,
      name: p.name,
      type: p.type,
      tagline: p.tagline,
      description: p.description,
      keyIngredients: p.keyIngredients,
      benefits: p.benefits,
      priceRM: p.priceRM,
      priceRMEast: p.priceRMEast || null,
      graphic: p.graphic,
      category: p.category,
      kind: p.kind,
      sizeLabel: p.sizeLabel,
      contents: p.contents,
      howToUse: p.howToUse,
  }));

  if (!pack) return rows;
  return rows.map((p) => {
    const t = pack.products[p.slug];
    // Ingredient identities (INCI/proper names) come from the canonical source,
    // including current admin edits, rather than a potentially older locale pack.
    return t ? { ...p, ...t, keyIngredients: p.keyIngredients } : p;
  });
}

export async function getProduct(slug: string): Promise<ProductView | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  const pack = contentPack(await getLocale());
  let rows: TestimonialView[] = seedTestimonials;
  if (hasRemoteDb) {
    try {
      const dbRows = await withDbDeadline(
        db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
      );
      rows = dbRows.length ? dbRows.filter((row) => row.published) : seedTestimonials;
    } catch {
      rows = [];
    }
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

// Fallback projection from the curated seed bundles + dictionary copy, used
// when no database is configured or the table has never been initialized.
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

/** Database publishing is authoritative; references must resolve to available products. */
export async function getPromotions(): Promise<PromotionView[]> {
  const locale = await getLocale();
  let result = seedPromotionViews(locale);
  if (hasRemoteDb) {
    try {
      const rows = await withDbDeadline(
        db.select().from(promotions).orderBy(asc(promotions.sortOrder), asc(promotions.id)),
      );
      const initialized = rows.length > 0 || await contentInitialized("promotions");
      result = publishedContent(rows, initialized, []).map((r) => ({
          slug: r.slug,
          title: pickContentLocale(r.title, locale),
          description: pickContentLocale(r.description, locale),
          tag: r.tag ? pickContentLocale(r.tag, locale) || null : null,
          priceRM: r.priceRM,
          wasRM: r.wasRM,
          saveRM: r.saveRM,
          graphic: r.graphic,
          productSlugs: r.productSlugs,
      }));
      if (!rows.length && !initialized) result = seedPromotionViews(locale);
    } catch {
      return [];
    }
  }
  const slugs = new Set((await getProducts()).map((p) => p.slug));
  return result.map(normalizeLegacyBundle)
    .filter((p) => validPromotionReferences(p.productSlugs, slugs));
}

export async function getFaqs(): Promise<FaqView[]> {
  const pack = contentPack(await getLocale());
  let source: FaqView[] = seedFaqs;
  if (hasRemoteDb) {
    try {
      const rows = await withDbDeadline(db.select().from(faqs).orderBy(asc(faqs.sortOrder)));
      source = rows.length ? rows : seedFaqs;
    } catch {
      source = [];
    }
  }
  const base = source.map((f) => ({ category: f.category, question: f.question, answer: f.answer }));
  if (!pack) return base;
  return base.map((f, i) => pack.faqs[i] ?? f);
}
