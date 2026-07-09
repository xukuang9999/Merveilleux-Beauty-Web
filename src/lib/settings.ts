// Site-wide settings backed by the DB, resilient to the DB being absent.
// Feature flags gate optional site features; a missing row (or unreachable
// DB) falls back to the coded default so the public site never breaks.
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { featureFlags, siteSettings, siteCopy } from "@/db/schema";
import { getLocale } from "@/i18n/server";

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

// ---- Appearance (brand colours + fonts) -------------------------
// Master admins can restyle the site. Colours override the Tailwind @theme
// tokens; fonts pick from a curated allowlist (no arbitrary remote fonts).

/** Editable brand colour tokens → the CSS custom property they drive. */
export const COLOR_TOKENS = [
  { key: "bronze", cssVar: "--color-bronze", default: "#8a7355" },
  { key: "gold", cssVar: "--color-gold", default: "#a08c68" },
  { key: "champagne", cssVar: "--color-champagne", default: "#eae2d2" },
  { key: "charcoal", cssVar: "--color-charcoal", default: "#33302a" },
  { key: "umber", cssVar: "--color-umber", default: "#453d31" },
  { key: "mid", cssVar: "--color-mid", default: "#7d7568" },
  { key: "cream", cssVar: "--color-cream", default: "#f7f4ed" },
  { key: "line", cssVar: "--color-line", default: "#e5dfd3" },
] as const;

export type ColorTokenKey = (typeof COLOR_TOKENS)[number]["key"];

// Curated font stacks. Values are either the already-loaded brand fonts
// (via next/font CSS vars) or web-safe families — never a remote fetch.
export const FONT_SERIF_OPTIONS: Record<string, string> = {
  cormorant: "var(--font-cormorant), Georgia, serif",
  georgia: 'Georgia, "Times New Roman", serif',
  palatino: '"Palatino Linotype", Palatino, Georgia, serif',
  times: '"Times New Roman", Times, serif',
};

export const FONT_SANS_OPTIONS: Record<string, string> = {
  dmSans: "var(--font-dm-sans), system-ui, sans-serif",
  system: "system-ui, -apple-system, sans-serif",
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  verdana: "Verdana, Geneva, sans-serif",
};

const DEFAULT_SERIF = "cormorant";
const DEFAULT_SANS = "dmSans";

export type Appearance = {
  colors: Record<ColorTokenKey, string>;
  fontSerif: string;
  fontSans: string;
};

const HEX = /^#[0-9a-fA-F]{6}$/;

function defaultAppearance(): Appearance {
  const colors = {} as Record<ColorTokenKey, string>;
  for (const t of COLOR_TOKENS) colors[t.key] = t.default;
  return { colors, fontSerif: DEFAULT_SERIF, fontSans: DEFAULT_SANS };
}

/** The SETTINGS_KEY row holds the appearance JSON. */
export const APPEARANCE_KEY = "appearance";

/** Resolved appearance for this request (cached). Stored overrides are
 *  validated and merged onto the defaults; anything invalid/missing (or an
 *  unreachable DB) falls back to the coded brand default. */
export const getAppearance = cache(async (): Promise<Appearance> => {
  const base = defaultAppearance();
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, APPEARANCE_KEY))
      .limit(1);
    const stored = (row?.value ?? null) as Partial<Appearance> | null;
    if (!stored) return base;

    if (stored.colors) {
      for (const t of COLOR_TOKENS) {
        const v = stored.colors[t.key];
        if (typeof v === "string" && HEX.test(v)) base.colors[t.key] = v;
      }
    }
    if (stored.fontSerif && FONT_SERIF_OPTIONS[stored.fontSerif]) {
      base.fontSerif = stored.fontSerif;
    }
    if (stored.fontSans && FONT_SANS_OPTIONS[stored.fontSans]) {
      base.fontSans = stored.fontSans;
    }
  } catch {
    // DB unavailable — use the coded brand default.
  }
  return base;
});

// ---- Editable site copy -----------------------------------------
// Per-locale overrides for main-page copy; unset keys fall back to the
// dictionary default. See src/lib/copy-registry.ts for the editable fields.

/** Copy overrides for a locale (cached): key → override value. */
export const getCopyOverrides = cache(
  async (locale: string): Promise<Map<string, string>> => {
    const map = new Map<string, string>();
    try {
      const rows = await db
        .select()
        .from(siteCopy)
        .where(eq(siteCopy.locale, locale));
      for (const r of rows) map.set(r.key, r.value);
    } catch {
      // DB unavailable — no overrides, callers use their dictionary defaults.
    }
    return map;
  },
);

/** Resolver for the current request's locale: `copy(key, fallback)` returns
 *  the stored override or the passed dictionary default. */
export const getCopy = cache(
  async (): Promise<(key: string, fallback: string) => string> => {
    const overrides = await getCopyOverrides(await getLocale());
    return (key, fallback) => overrides.get(key) ?? fallback;
  },
);

/** Inline CSS custom properties for <html>, containing only the values that
 *  differ from the compiled defaults (empty object when fully default). */
export function appearanceVars(app: Appearance): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const t of COLOR_TOKENS) {
    if (app.colors[t.key] !== t.default) vars[t.cssVar] = app.colors[t.key];
  }
  if (app.fontSerif !== DEFAULT_SERIF) {
    vars["--font-serif"] = FONT_SERIF_OPTIONS[app.fontSerif];
  }
  if (app.fontSans !== DEFAULT_SANS) {
    vars["--font-sans"] = FONT_SANS_OPTIONS[app.fontSans];
  }
  return vars;
}
