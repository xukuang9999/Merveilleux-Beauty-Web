// ============================================================
// Merveilleux Beauty — Site config (brand, nav, contact channels).
// Catalogue / training / KB content lives in seed-data.ts + the DB.
// ============================================================

export const site = {
  name: "Merveilleux Beauty",
  tagline: "OEM French Beauty, made for modern skin",
  description:
    "Merveilleux Beauty is an OEM French beauty house crafting clean, results-driven skincare — and the partner network that brings it to you.",
  // Update these to the real handles once confirmed.
  whatsapp: "60123456789", // placeholder MY number, digits only
  email: "hello@merveilleuxbeauty.com",
  instagram: "https://instagram.com/",
  domains: ["merveilleuxbeauty.com", "merveilleuxbeauty.com.my"],
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "Q&A" },
  { href: "/training", label: "Distributor Training" },
  { href: "/contact", label: "Contact" },
];
