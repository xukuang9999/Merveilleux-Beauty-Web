// ============================================================
// Merveilleux Beauty — Site config (brand, nav, contact channels).
// Real company details from the client intake brief (Bellesenze Group).
// Catalogue / training / KB content lives in seed-data.ts + the DB.
// ============================================================

export const site = {
  name: "Mérvéilléux Premium",
  brand: "Mérvéilléux",
  legalName: "Bellesenze Group Sdn Bhd",
  regNo: "202401042071",
  established: "2014",
  tagline: "The Art of French Beauty",
  description:
    "Mérvéilléux Premium is a French-grade beauty house — clean, results-driven skincare, a flagship experience centre by Bellesenze, and a partner network built on training and trust.",

  // Primary contact (from brief)
  contactName: "Grace Phua",
  contactRole: "Director",
  email: "gracepbl@gmail.com",
  phone: "+60 19-283 7139", // Phone / WhatsApp on file
  wechat: "gracepbl",

  // WhatsApp Business line — digits only, used for wa.me deep links & the
  // floating chat button. (Brief "WhatsApp Business Number": 0192837239.)
  whatsapp: "60192837239",

  address: {
    line: "No. 23A, Jalan SG 3/10, Sri Gombak",
    city: "68100 Batu Caves",
    state: "Selangor",
    country: "Malaysia",
    full: "No. 23A, Jalan SG 3/10, Sri Gombak, 68100 Batu Caves, Selangor, Malaysia",
  },

  // Social profiles.
  instagram: "https://www.instagram.com/merveilleuxskincare_sbn/",
  instagramHandle: "merveilleuxskincare_sbn",
  facebook: "https://facebook.com/merveilleux.my",
  xiaohongshu: "https://www.xiaohongshu.com/",

  // Preferred domain (from brief; not yet owned).
  domains: ["merveilleuxfrance.com"],
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

// Keyless Google Maps embed / link, driven by the company address.
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  site.address.full,
)}&output=embed`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.address.full,
)}`;

export type NavLink = { href: string; label: string };

// Public routes — drives the XML sitemap. Display labels are localised in
// the Nav / Footer components via the dictionaries.
export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/promotions", label: "Promotions" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Skincare Tips" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "Q&A" },
  { href: "/training", label: "Distributor Training" },
  { href: "/join", label: "Join Us" },
  { href: "/contact", label: "Contact" },
];
