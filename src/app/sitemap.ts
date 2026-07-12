import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/data";
import { seedKbArticles } from "@/lib/seed-data";
import { getProducts } from "@/lib/content";

const BASE = "https://merveilleuxbeauty.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = navLinks.map((l) => ({
    url: `${BASE}${l.href}`,
    lastModified: now,
    changeFrequency: l.href === "/" ? "weekly" : "monthly",
    priority: l.href === "/" ? 1 : 0.7,
  }));

  // Live storefront products (seed base + published DB rows). The seed
  // catalogue is now empty, so this is the real admin-managed range.
  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
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
