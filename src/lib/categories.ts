// Canonical product-category list — the single source of truth for order and
// stable slugs. English is the fallback label; 中文 / BM overrides live in the
// i18n dictionaries (dict.products.categories, keyed by these slugs) and fall
// back to English until the client supplies translations.
//
// Client-safe: no DB imports, so nav/filter client components can use it.

export type ProductCategory = { slug: string; en: string };

export const productCategories: ProductCategory[] = [
  { slug: "cleanser-mist-lotion", en: "Cleanser, Mist & Lotion" },
  { slug: "soothing-repairing-care", en: "Soothing & Repairing Care" },
  { slug: "hydrating-moisture-care", en: "Hydrating & Moisture Care" },
  { slug: "antioxidant-firming", en: "Anti-oxidant & Firming Series" },
  { slug: "whitening", en: "Whitening Series" },
  { slug: "eye-care", en: "Intensive Eye Care" },
  { slug: "soft-exfoliator", en: "Soft Exfoliator" },
  { slug: "purifying-care", en: "Purifying Care" },
  { slug: "sun-defence", en: "Sun Defence" },
  { slug: "trial-sets", en: "Trial Sets" },
];

export const categorySlugs = productCategories.map((c) => c.slug);

export function isCategorySlug(v: string | undefined | null): boolean {
  return !!v && categorySlugs.includes(v);
}

/** Localised label for a category slug: dictionary override → English → slug. */
export function categoryLabel(
  slug: string,
  overrides?: Partial<Record<string, string>>,
): string {
  return overrides?.[slug] || productCategories.find((c) => c.slug === slug)?.en || slug;
}
