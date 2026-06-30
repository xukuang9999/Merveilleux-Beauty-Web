// Public content access — reads from the DB, falls back to curated seed
// data if the database isn't reachable, and overlays the active locale's
// translations (English is the canonical source).
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, testimonials, faqs } from "@/db/schema";
import {
  seedProducts,
  seedTestimonials,
  seedFaqs,
  type SeedProduct,
} from "./seed-data";
import { getLocale } from "@/i18n/server";
import { contentPack } from "@/i18n/content";

export type ProductView = Omit<SeedProduct, "sortOrder">;
export type TestimonialView = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};
export type FaqView = { category: string; question: string; answer: string };

export async function getProducts(): Promise<ProductView[]> {
  const pack = contentPack(await getLocale());
  let rows: ProductView[];
  try {
    const db_rows = await db
      .select()
      .from(products)
      .where(eq(products.published, true))
      .orderBy(asc(products.sortOrder));
    rows = db_rows.length ? db_rows : seedProducts;
  } catch {
    rows = seedProducts;
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
