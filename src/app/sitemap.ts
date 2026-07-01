import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/data";
import { seedProducts, seedKbArticles } from "@/lib/seed-data";

const BASE = "https://merveilleuxbeauty.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = navLinks.map((l) => ({
    url: `${BASE}${l.href}`,
    lastModified: now,
    changeFrequency: l.href === "/" ? "weekly" : "monthly",
    priority: l.href === "/" ? 1 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = seedProducts.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = seedKbArticles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
