import { asc } from "drizzle-orm";
import { db, hasRemoteDb, withDbDeadline } from "@/db";
import { kbArticles } from "@/db/schema";
import { seedKbArticles, type SeedKbArticle } from "./seed-data";
import { getLocale } from "@/i18n/server";
import { contentPack } from "@/i18n/content";
import { requireAdmin } from "./auth";
import { contentInitialized, publishedContent } from "./content-state";

export type KbView = SeedKbArticle & { published?: boolean };

async function readKbArticles(includeHidden = false): Promise<KbView[]> {
  const pack = contentPack(await getLocale());
  let rows: KbView[] = seedKbArticles;
  if (hasRemoteDb) {
    try {
      const dbRows = await withDbDeadline(
        db.select().from(kbArticles).orderBy(asc(kbArticles.sortOrder), asc(kbArticles.id)),
      );
      const initialized = dbRows.length > 0 || await contentInitialized("kb");
      rows = includeHidden && initialized
        ? dbRows
        : publishedContent(dbRows, initialized, seedKbArticles);
    } catch {
      // Do not return previously withdrawn training material during an outage.
      rows = [];
    }
  }
  if (!pack) return rows;
  return rows.map((a) => {
    const t = pack.kb[a.slug];
    return t
      ? { ...a, title: t.title, category: t.category, excerpt: t.excerpt, body: t.body }
      : a;
  });
}

export function getKbArticles(): Promise<KbView[]> {
  return readKbArticles();
}

export async function getKbArticle(slug: string): Promise<KbView | null> {
  const all = await getKbArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

/** Separate, guarded preview: unpublished rows never enter normal/AI readers. */
export async function getAdminKbArticle(slug: string): Promise<KbView | null> {
  await requireAdmin();
  return (await readKbArticles(true)).find((a) => a.slug === slug) ?? null;
}

export function kbCategories(articles: KbView[]): string[] {
  return [...new Set(articles.map((a) => a.category))];
}
