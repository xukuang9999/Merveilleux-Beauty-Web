import { catalogueProducts } from "./catalogue-products";
import { seedBundles } from "./seed-data";

const legacyPending = [
  "the third item is to be confirmed with Grace",
  "The set contents are only partially legible on the source card",
  "Final components and salon protocol remain subject to brand confirmation",
];
const pendingSlugs = new Set(["brightening-plus-hydrating-trial-set", "congested-set", "advanced-bio-peptide-treatment"]);

/** Correct only the known research-draft copy still persisted by an old seed.
 * Approved/custom admin copy is left intact; no data is written by this reader. */
export function normalizeLegacyProductCopy<T extends {
  slug: string; description: string; tagline: string; benefits: string[];
  sizeLabel: string | null; contents: string[] | null; keyIngredients: string[];
}>(product: T): T {
  if (!pendingSlugs.has(product.slug) || !legacyPending.some((text) => product.description.includes(text))) return product;
  const current = catalogueProducts.find((p) => p.slug === product.slug)!;
  return { ...product,
    description: current.description, tagline: current.tagline, benefits: current.benefits,
    sizeLabel: current.sizeLabel, contents: current.contents, keyIngredients: current.keyIngredients,
  };
}

const aliases: Record<string, string> = {
  "youth-ha-moisturiser": "youth-ha-moisturizer",
  "uv-shield-spf35": "refined-ha-uv-shield-spf35",
  "hyaluronate-moisturiser": "hyaluronate-moisturizer",
  "antioxidant-serum": "revitalize-anti-oxidant-serum",
  "antioxidant-cream": "revitalize-anti-oxidant-creme",
  "eye-treatment-creme": "intense-lift-eye-treatment-creme",
};
const oldSeedWas: Record<string, string> = {
  "brightening-ritual": "RM654", "hydration-ritual": "RM514", "anti-aging-ritual": "RM744",
};

/** Known slug renames preserve product identity. Only unchanged legacy seed
 * pricing is corrected; a manually priced or recomposed promotion stays intact. */
export function normalizeLegacyBundle<T extends {
  slug: string; productSlugs: string[]; priceRM: string; wasRM: string; saveRM: string;
}>(bundle: T): T {
  const productSlugs = bundle.productSlugs.map((slug) => aliases[slug] ?? slug);
  const current = seedBundles.find((b) => b.slug === bundle.slug);
  const unchangedSeed = current && bundle.wasRM === oldSeedWas[bundle.slug]
    && bundle.priceRM === current.priceRM
    && JSON.stringify(productSlugs) === JSON.stringify(current.productSlugs);
  return { ...bundle, productSlugs,
    ...(unchangedSeed ? { wasRM: current.wasRM, saveRM: current.saveRM } : {}),
  };
}
