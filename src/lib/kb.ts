import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { kbArticles } from "@/db/schema";
import { seedKbArticles, type SeedKbArticle } from "./seed-data";

export type KbView = SeedKbArticle;

export async function getKbArticles(): Promise<KbView[]> {
  try {
    const rows = await db
      .select()
      .from(kbArticles)
      .where(eq(kbArticles.published, true))
      .orderBy(asc(kbArticles.sortOrder));
    if (rows.length) {
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        excerpt: r.excerpt,
        body: r.body,
        tags: r.tags,
        sortOrder: r.sortOrder,
      }));
    }
    return seedKbArticles;
  } catch {
    return seedKbArticles;
  }
}

export async function getKbArticle(slug: string): Promise<KbView | null> {
  const all = await getKbArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export function kbCategories(articles: KbView[]): string[] {
  return [...new Set(articles.map((a) => a.category))];
}
