// ============================================================
// Merveilleux Beauty — Site content
// Centralised so a CMS can replace this later without touching UI.
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
  { href: "/training", label: "经销商 Training" },
  { href: "/contact", label: "Contact" },
];

export type Product = {
  slug: string;
  name: string;
  type: string;
  graphic: string;
  tagline: string;
  description: string;
  keyIngredients: string[];
  benefits: string[];
};

export const products: Product[] = [
  {
    slug: "radiance-serum",
    name: "Radiance Serum",
    type: "Brightening Concentrate",
    graphic: "/graphics/product-serum.svg",
    tagline: "A weightless drop of luminosity",
    description:
      "An OEM-formulated vitamin-C and niacinamide serum that evens tone and revives dull, tired skin. Absorbs instantly, layers beautifully under moisturiser.",
    keyIngredients: ["10% Vitamin C", "Niacinamide", "Hyaluronic Acid"],
    benefits: ["Brightens & evens tone", "Hydrates deeply", "Fades dark spots"],
  },
  {
    slug: "velvet-cream",
    name: "Velvet Cream",
    type: "Nourishing Moisturiser",
    graphic: "/graphics/product-cream.svg",
    tagline: "Cushioned comfort, all day",
    description:
      "A rich yet breathable French-formulated moisturiser with ceramides and shea that restores the skin barrier and locks in moisture for a soft, supple finish.",
    keyIngredients: ["Ceramides", "Shea Butter", "Squalane"],
    benefits: ["Repairs barrier", "24h hydration", "Softens texture"],
  },
  {
    slug: "pure-cleanser",
    name: "Pure Cleanser",
    type: "Gentle Daily Cleanser",
    graphic: "/graphics/product-cleanser.svg",
    tagline: "A clean slate, never stripped",
    description:
      "A pH-balanced gel cleanser that lifts away makeup, sunscreen and impurities without disturbing the moisture barrier. Suitable for sensitive and combination skin.",
    keyIngredients: ["Amino Acid Surfactants", "Centella Asiatica", "Glycerin"],
    benefits: ["Deep yet gentle clean", "Calms redness", "Non-stripping"],
  },
  {
    slug: "essence-toner",
    name: "Essence Toner",
    type: "Hydrating Essence",
    graphic: "/graphics/product-essence.svg",
    tagline: "The first step to glass skin",
    description:
      "A lightweight prep essence that floods skin with hydration and preps it to receive serum and cream. Leaves a dewy, plumped finish.",
    keyIngredients: ["Galactomyces Ferment", "Panthenol", "Allantoin"],
    benefits: ["Preps & hydrates", "Refines pores", "Boosts glow"],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "My skin has never looked this even. Three weeks with the Radiance Serum and my dark spots are visibly lighter. Customers ask me what I'm using every week.",
    name: "Aisyah R.",
    role: "经销商 · Kuala Lumpur",
    rating: 5,
  },
  {
    quote:
      "The Velvet Cream is the first moisturiser that calmed my eczema-prone skin. The OEM quality genuinely rivals the luxury brands I used to pay triple for.",
    name: "Mei Ling T.",
    role: "Customer · Penang",
    rating: 5,
  },
  {
    quote:
      "As a distributor, the brand trust this website builds makes selling effortless. Clients see the products are real, French-grade, and beautifully made.",
    name: "Nurul H.",
    role: "经销商 · Johor Bahru",
    rating: 5,
  },
  {
    quote:
      "Glass skin is real. The Essence Toner plus serum routine gave me the dewy finish I'd only seen in adverts. I've repurchased four times.",
    name: "Priya S.",
    role: "Customer · Selangor",
    rating: 5,
  },
];

export type Faq = {
  q: string;
  a: string;
  category: "Products" | "Distributor" | "Skincare";
};

export const faqs: Faq[] = [
  {
    category: "Products",
    q: "What does OEM French beauty actually mean?",
    a: "Our formulas are developed and manufactured to French cosmetic standards by established OEM laboratories, then released under the Merveilleux Beauty name. You get luxury-grade formulation without the luxury-brand markup.",
  },
  {
    category: "Products",
    q: "Are the products suitable for sensitive skin?",
    a: "Yes. Our cleanser, essence and cream are pH-balanced and fragrance-considerate, formulated with soothing actives like Centella Asiatica and Allantoin. We always recommend a 24-hour patch test before first use.",
  },
  {
    category: "Skincare",
    q: "In what order should I apply the products?",
    a: "Cleanse → Essence Toner → Radiance Serum → Velvet Cream. In the morning, finish with a broad-spectrum SPF. At night, the cream seals everything in.",
  },
  {
    category: "Skincare",
    q: "How long until I see results?",
    a: "Hydration and texture improvements are often visible within days. Tone and dark-spot results from the Radiance Serum typically appear over 4–8 weeks of consistent use.",
  },
  {
    category: "Distributor",
    q: "How do I become a Merveilleux 经销商?",
    a: "Send us an enquiry through the Contact page or WhatsApp. Approved distributors complete our online training programme (5–7 modules) and an in-person session before they begin selling.",
  },
  {
    category: "Distributor",
    q: "Is there training and support for distributors?",
    a: "Absolutely. Every 经销商 gets access to our structured training portal covering brand, products, policy and SOP, plus an ongoing skincare knowledge base and team support.",
  },
];

// ---- Training (LMS shell) -----------------------------------

export type TrainingModule = {
  id: number;
  icon: string;
  title: string;
  cnTitle: string;
  summary: string;
  lessons: string[];
  durationMins: number;
  quizQuestions: number;
};

export const trainingModules: TrainingModule[] = [
  {
    id: 1,
    icon: "🏢",
    title: "Company Culture",
    cnTitle: "公司文化",
    summary: "Brand story, vision, mission and the values behind Merveilleux.",
    lessons: [
      "Our origin & brand story",
      "Vision, mission & values",
      "What 'Merveilleux' stands for",
    ],
    durationMins: 25,
    quizQuestions: 20,
  },
  {
    id: 2,
    icon: "📜",
    title: "经销商 Policy",
    cnTitle: "经销商政策",
    summary: "Terms & conditions, commission structure and conduct rules.",
    lessons: [
      "Distributor terms & conditions",
      "Commission & incentive structure",
      "Code of conduct",
    ],
    durationMins: 30,
    quizQuestions: 20,
  },
  {
    id: 3,
    icon: "💄",
    title: "Product Training",
    cnTitle: "产品培训",
    summary: "OEM formulations, ingredients, benefits and usage routines.",
    lessons: [
      "The product range in depth",
      "Key ingredients & benefits",
      "Building a routine for customers",
    ],
    durationMins: 40,
    quizQuestions: 20,
  },
  {
    id: 4,
    icon: "📋",
    title: "Standard Operating Procedures",
    cnTitle: "标准作业流程",
    summary: "Order handling, customer service and returns done right.",
    lessons: [
      "Order handling workflow",
      "Customer service standards",
      "Returns & exchange policy",
    ],
    durationMins: 35,
    quizQuestions: 20,
  },
  {
    id: 5,
    icon: "💬",
    title: "Sales Scripts",
    cnTitle: "销售话术",
    summary: "Proven openers, objection handling and closing techniques.",
    lessons: [
      "Conversation starters",
      "Handling common objections",
      "Closing with confidence",
    ],
    durationMins: 30,
    quizQuestions: 20,
  },
  {
    id: 6,
    icon: "📱",
    title: "Social Media SOP",
    cnTitle: "社媒规范",
    summary: "On-brand posting, content do's & don'ts, and promo policy.",
    lessons: [
      "Brand voice on social",
      "Content do's & don'ts",
      "Running compliant promotions",
    ],
    durationMins: 30,
    quizQuestions: 20,
  },
];

export const PASS_MARK = 70;
