import type { FeatureKey } from "./settings";

// Maps a public href to the feature flag that gates it. Client-safe: this
// module pulls in only a type from settings.ts (erased at build), never the DB.
// Hrefs not listed here are always shown.
export const LINK_FLAG: Record<string, FeatureKey> = {
  "/promotions": "promotions",
  "/news": "news",
  "/blog": "blog",
  "/testimonials": "testimonials",
  "/gallery": "gallery",
};
