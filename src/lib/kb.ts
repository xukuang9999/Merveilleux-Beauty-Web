import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { kbArticles } from "@/db/schema";
import { seedKbArticles, type SeedKbArticle } from "./seed-data";
import { getLocale } from "@/i18n/server";
import { contentPack } from "@/i18n/content";

export type KbView = SeedKbArticle;

export async function getKbArticles(): Promise<KbView[]> {
  const pack = contentPack(await getLocale());
  let rows: KbView[];
  try {
    const db_rows = await db
      .select()
      .from(kbArticles)
      .where(eq(kbArticles.published, true))
      .orderBy(asc(kbArticles.sortOrder));
    rows = db_rows.length
      ? db_rows.map((r) => ({
          slug: r.slug,
          title: r.title,
          category: r.category,
          excerpt: r.excerpt,
          body: r.body,
          tags: r.tags,
          sortOrder: r.sortOrder,
        }))
      : seedKbArticles;
  } catch {
    rows = seedKbArticles;
  }
  if (!pack) return rows;
  return rows.map((a) => {
    const t = pack.kb[a.slug];
    return t
      ? { ...a, title: t.title, category: t.category, excerpt: t.excerpt, body: t.body }
      : a;
  });
}

export async function getKbArticle(slug: string): Promise<KbView | null> {
  const all = await getKbArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export function kbCategories(articles: KbView[]): string[] {
  return [...new Set(articles.map((a) => a.category))];
}
