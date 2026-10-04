import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/data";
import { getProducts, getArticles } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { LINK_FLAG } from "@/lib/feature-links";

const BASE = "https://merveilleuxbeauty.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [flags, products, articles] = await Promise.all([
    getFeatureFlags(),
    getProducts(),
    getArticles(),
  ]);

  // No reliable content timestamps exist for these records. Omit lastModified
  // instead of claiming every page changed whenever the sitemap is requested.
  const staticRoutes: MetadataRoute.Sitemap = navLinks.filter((l) => {
    const flag = LINK_FLAG[l.href];
    return !flag || flags[flag];
  }).map((l) => ({
    url: `${BASE}${l.href}`,
    changeFrequency: l.href === "/" ? "weekly" : "monthly",
    priority: l.href === "/" ? 1 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = flags.blog ? articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  })) : [];

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
