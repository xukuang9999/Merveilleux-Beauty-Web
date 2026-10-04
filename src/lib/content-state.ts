import { eq } from "drizzle-orm";
import { db, withDbDeadline } from "@/db";
import { siteSettings } from "@/db/schema";

export type ManagedContent = "products" | "promotions" | "kb";

// Persist this before a catalogue's last row is deleted. An intentionally empty
// catalogue must not be confused with a database that has never been seeded.
export const contentStateKey = (kind: ManagedContent) =>
  `content:${kind}:initialized`;

export async function contentInitialized(kind: ManagedContent): Promise<boolean> {
  const [row] = await withDbDeadline(
    db.select({ value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.key, contentStateKey(kind)))
      .limit(1),
  );
  return row?.value === true;
}

export function publishedContent<T extends { published: boolean }, F>(
  rows: readonly T[],
  initialized: boolean,
  fallback: readonly F[],
): Array<T | F> {
  return rows.length || initialized
    ? rows.filter((row) => row.published)
    : [...fallback];
}

export function pickContentLocale(
  values: Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!values) return "";
  return values[locale]?.trim() || values.en?.trim() ||
    Object.values(values).find((value) => value.trim())?.trim() || "";
}

export function validPromotionReferences(
  productSlugs: readonly string[],
  publishedSlugs: ReadonlySet<string>,
): boolean {
  return productSlugs.length > 0 &&
    new Set(productSlugs).size === productSlugs.length &&
    productSlugs.every((slug) => publishedSlugs.has(slug));
}
