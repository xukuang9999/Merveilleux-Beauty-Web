import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/data";

const BASE = "https://merveilleuxbeauty.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((l) => ({
    url: `${BASE}${l.href}`,
    lastModified: new Date(),
    changeFrequency: l.href === "/" ? "weekly" : "monthly",
    priority: l.href === "/" ? 1 : 0.7,
  }));
}
