// Public content access — reads from the DB, falls back to curated seed
// data if the database isn't reachable (e.g. before Turso is configured).
// Keeps the marketing site always-rendering.
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, testimonials, faqs } from "@/db/schema";
import {
  seedProducts,
  seedTestimonials,
  seedFaqs,
  type SeedProduct,
} from "./seed-data";

export type ProductView = Omit<SeedProduct, "sortOrder">;
export type TestimonialView = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};
export type FaqView = { category: string; question: string; answer: string };

export async function getProducts(): Promise<ProductView[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.published, true))
      .orderBy(asc(products.sortOrder));
    if (rows.length) return rows;
    return seedProducts;
  } catch {
    return seedProducts;
  }
}

export async function getProduct(slug: string): Promise<ProductView | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.sortOrder));
    if (rows.length) return rows;
    return seedTestimonials;
  } catch {
    return seedTestimonials;
  }
}

export async function getFaqs(): Promise<FaqView[]> {
  try {
    const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    if (rows.length) {
      return rows.map((f) => ({
        category: f.category,
        question: f.question,
        answer: f.answer,
      }));
    }
    return seedFaqs.map((f) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
    }));
  } catch {
    return seedFaqs.map((f) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
    }));
  }
}
