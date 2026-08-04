/**
 * Import the extracted product cards (content/extracted/zh/*.json) into the
 * `products` table as UNPUBLISHED DRAFTS for admin review.
 *
 *   npx tsx src/db/import-extracted.ts          # dry run — prints a plan, writes nothing
 *   npx tsx src/db/import-extracted.ts --commit  # actually insert the draft rows
 *
 * Safety properties:
 *  - Every imported row is `published: false`, so nothing reaches the storefront
 *    until an admin publishes it (see the JS filter in src/lib/content.ts).
 *  - Slugs that already exist (the 7 dev/admin rows) are SKIPPED, never
 *    overwritten or unpublished — the import is additive and re-runnable.
 *  - Runs against whatever `src/db/index.ts` resolves from DATABASE_URL (local
 *    Postgres in dev, Supabase in prod), same as the seed script.
 *
 * The cards are bilingual: the ENGLISH copy (name_en, tagline_en, overview_en,
 * benefits_en, how_to_use_en) is loaded into the canonical columns — English is
 * the source language the read layer expects (see src/lib/content.ts) — while the
 * Chinese copy lives in the src/i18n/content/zh.ts overlay, keyed by the same slug.
 * Keep the two in sync: re-run `python3 gen-zh-overlay.py` after editing cards.
 */
import "./load-env";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { db } from "./index";
import { products } from "./schema";

type Card = {
  name_zh: string | null;
  name_en: string;
  type: "product" | "treatment" | "bundle" | string;
  status: string | null;
  collection?: string | null;
  // English → canonical columns; the _zh copy → src/i18n/content/zh.ts overlay.
  tagline_en: string | null;
  tagline_zh: string | null;
  price_myr: number | null;
  size: string | null;
  overview_en: string | null;
  overview_zh: string | null;
  key_ingredients: string[] | null;
  benefits_en: string[] | null;
  benefits_zh: string[] | null;
  claims_flagged: string[] | null;
  how_to_use_en: string[] | null;
  how_to_use_zh: string[] | null;
  contents?: string[] | null;
  photo_files: string[] | null;
  source_msg_ids: string[] | null;
};

type ProductInsert = typeof products.$inferInsert;

const EXTRACT_DIR = join(process.cwd(), "content", "extracted", "zh");
const PUBLIC_DIR = join(process.cwd(), "public");
const IMG_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];
const KINDS = new Set(["product", "treatment", "bundle"]);

// Import ordering starts after the dev fixture (sortOrder 101–107).
const SORT_BASE = 200;

// The only collection labels that map cleanly onto a canonical category slug;
// everything else is left uncategorised for an admin to assign.
const COLLECTION_TO_CATEGORY: Record<string, string> = {
  "Trial Sets & Bundles": "trial-sets",
  "Eye Care": "eye-care",
};

/** Best-effort primary image: look for a file named after the slug in the two
 *  public image folders (and the merveilleux-<slug>.png convention the dev rows
 *  use). Returns "" when nothing matches — reviewers upload one in the admin. */
function resolveGraphic(slug: string): string {
  const candidates: [string, string][] = [];
  for (const ext of IMG_EXTS) {
    candidates.push([join("products", `${slug}.${ext}`), `/products/${slug}.${ext}`]);
    candidates.push([
      join("images", "products", `${slug}.${ext}`),
      `/images/products/${slug}.${ext}`,
    ]);
  }
  candidates.push([
    join("images", "products", `merveilleux-${slug}.png`),
    `/images/products/merveilleux-${slug}.png`,
  ]);
  for (const [rel, url] of candidates) {
    if (existsSync(join(PUBLIC_DIR, rel))) return url;
  }
  return "";
}

const nonEmpty = (a: string[] | null | undefined): string[] | null =>
  a && a.length ? a : null;

function toRow(slug: string, c: Card, ord: number): ProductInsert {
  const kind = KINDS.has(c.type) ? (c.type as "product" | "treatment" | "bundle") : null;
  // Placeholder display label until an admin sets one; keep the dev rows' style.
  const typeLabel = kind ? kind[0].toUpperCase() + kind.slice(1) : "Product";
  return {
    slug,
    name: c.name_en || c.name_zh || slug,
    type: typeLabel,
    kind,
    // Canonical columns hold English; Chinese is overlaid via the zh content pack.
    tagline: c.tagline_en ?? "",
    description: c.overview_en ?? "",
    keyIngredients: c.key_ingredients ?? [],
    benefits: c.benefits_en ?? [],
    priceRM: c.price_myr != null ? `RM${c.price_myr}` : "",
    graphic: resolveGraphic(slug),
    category: COLLECTION_TO_CATEGORY[c.collection ?? ""] ?? "",
    status: c.status ?? "available",
    collection: c.collection ?? "",
    sizeLabel: c.size ?? null,
    contents: nonEmpty(c.contents),
    claimsFlagged: nonEmpty(c.claims_flagged),
    howToUse: nonEmpty(c.how_to_use_en),
    sourceMsgIds: nonEmpty(c.source_msg_ids),
    // photo_files point at ChatExport paths not present under /public; leave the
    // gallery empty and let reviewers upload real photos via the admin.
    photos: null,
    sortOrder: SORT_BASE + ord,
    published: false,
  };
}

async function main() {
  const commit = process.argv.includes("--commit");

  const files = readdirSync(EXTRACT_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const cards = files.map((f) => {
    const slug = f.replace(/\.json$/, "");
    const card = JSON.parse(readFileSync(join(EXTRACT_DIR, f), "utf8")) as Card;
    return { slug, card };
  });

  const existing = new Set(
    (await db.select({ slug: products.slug }).from(products)).map((r) => r.slug),
  );

  const toInsert: ProductInsert[] = [];
  const skipped: string[] = [];
  const warnings: string[] = [];

  cards.forEach(({ slug, card }, i) => {
    if (existing.has(slug)) {
      skipped.push(slug);
      return;
    }
    const row = toRow(slug, card, i);
    if (!row.graphic) warnings.push(`  · ${slug}: no image found → upload one before publishing`);
    if (!row.priceRM) warnings.push(`  · ${slug}: no price on card → set before publishing`);
    if (!KINDS.has(card.type)) warnings.push(`  · ${slug}: unknown type "${card.type}" → kind left null`);
    toInsert.push(row);
  });

  console.log(`Extracted cards:        ${cards.length}`);
  console.log(`Already in DB (skip):   ${skipped.length}${skipped.length ? ` — ${skipped.join(", ")}` : ""}`);
  console.log(`New drafts to insert:   ${toInsert.length}`);
  if (warnings.length) {
    console.log(`\nReview flags (${warnings.length}):`);
    console.log(warnings.join("\n"));
  }

  if (!commit) {
    console.log("\nDry run — no rows written. Re-run with --commit to insert the drafts.");
    return;
  }

  if (toInsert.length) {
    // onConflictDoNothing is belt-and-braces; we already filtered existing slugs.
    await db.insert(products).values(toInsert).onConflictDoNothing({ target: products.slug });
  }
  console.log(`\n✓ Inserted ${toInsert.length} draft product(s) (published: false).`);
  console.log("  Review, translate, price, image and publish them in /admin/products.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
