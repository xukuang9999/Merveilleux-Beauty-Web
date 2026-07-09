// Site-wide settings backed by the DB, resilient to the DB being absent.
// Feature flags gate optional site features; a missing row (or unreachable
// DB) falls back to the coded default so the public site never breaks.
import { cache } from "react";
import { db } from "@/db";
import { featureFlags } from "@/db/schema";

export type FeatureKey =
  | "aiChat"
  | "booking"
  | "testimonials"
  | "gallery"
  | "promotions"
  | "news"
  | "blog";

/** The canonical list of flags, in the order the admin UI lists them. */
export const FEATURE_KEYS: readonly FeatureKey[] = [
  "aiChat",
  "booking",
  "testimonials",
  "gallery",
  "promotions",
  "news",
  "blog",
] as const;

export type FeatureFlags = Record<FeatureKey, boolean>;

// Everything ships enabled; the table only ever stores overrides.
const DEFAULTS: FeatureFlags = {
  aiChat: true,
  booking: true,
  testimonials: true,
  gallery: true,
  promotions: true,
  news: true,
  blog: true,
};

function isFeatureKey(k: string): k is FeatureKey {
  return (FEATURE_KEYS as readonly string[]).includes(k);
}

/** Resolved flags for this request (cached). DB overrides the defaults;
 *  an empty or unreachable DB yields the all-on defaults. */
export const getFeatureFlags = cache(async (): Promise<FeatureFlags> => {
  const flags: FeatureFlags = { ...DEFAULTS };
  try {
    const rows = await db.select().from(featureFlags);
    for (const r of rows) {
      if (isFeatureKey(r.key)) flags[r.key] = r.enabled;
    }
  } catch {
    // DB unavailable (e.g. before Turso is configured) — use defaults.
  }
  return flags;
});

export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
  return (await getFeatureFlags())[key];
}
