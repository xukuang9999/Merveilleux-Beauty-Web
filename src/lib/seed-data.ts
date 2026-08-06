// ============================================================
// Product catalogue & content for Mérvéilléux Premium.
// Source of truth for DB seeding AND the public-page fallback
// (used when the database isn't reachable). No DB imports here.
//
// The product range (27 SKUs), pricing and copy are sourced from the
// live MÉRVÉILLÉUX FRANCE catalogue. Real product photography lives in
// /public/products/<slug>.jpg.
// ============================================================

export type SeedProduct = {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  keyIngredients: string[];
  benefits: string[];
  priceRM: string;
  graphic: string;
  sortOrder: number;
};

// Demo/placeholder catalogue removed — the storefront now shows only the
// real, admin-managed products (published DB rows). Kept as an empty base so
// getProducts() still resolves; see src/lib/content.ts.
export const seedProducts: SeedProduct[] = [];

export type SeedTestimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
  sortOrder: number;
};

export const seedTestimonials: SeedTestimonial[] = [
  {
    quote:
      "My skin has never looked this even. Three weeks with the Oxy-Bright Serum and my dark spots are visibly lighter. Customers ask me what I'm using every week.",
    name: "Aisyah R.",
    role: "Distributor · Kuala Lumpur",
    rating: 5,
    sortOrder: 1,
  },
  {
    quote:
      "The Cell Repair Treatment Cream is the first moisturiser that calmed my eczema-prone skin. The quality genuinely rivals the luxury brands I used to pay triple for.",
    name: "Mei Ling T.",
    role: "Customer · Penang",
    rating: 5,
    sortOrder: 2,
  },
  {
    quote:
      "As a distributor, the brand trust this website builds makes selling effortless. Clients see the products are real, French-grade, and beautifully made.",
    name: "Nurul H.",
    role: "Distributor · Johor Bahru",
    rating: 5,
    sortOrder: 3,
  },
  {
    quote:
      "Glass skin is real. The Essential Lotion Toner plus Hydro-Moist Serum routine gave me the dewy finish I'd only seen in adverts. I've repurchased four times.",
    name: "Priya S.",
    role: "Customer · Selangor",
    rating: 5,
    sortOrder: 4,
  },
  {
    quote:
      "Refined HA UV Shield is the only sunscreen my customers will wear daily — light, hydrating and never greasy. It sells itself once they try a sample.",
    name: "Farah K.",
    role: "Distributor · Shah Alam",
    rating: 5,
    sortOrder: 5,
  },
];

export type SeedFaq = {
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export const seedFaqs: SeedFaq[] = [
  {
    category: "Products",
    question: "What makes MÉRVÉILLÉUX French beauty?",
    answer:
      "Our formulas are developed to French cosmetic standards, using clean, effective actives and released under the MÉRVÉILLÉUX name. You get luxury-grade formulation without the luxury-brand markup.",
    sortOrder: 1,
  },
  {
    category: "Products",
    question: "Are the products suitable for sensitive skin?",
    answer:
      "Yes. Products such as the Gentle Cleansing Milk, Ceramide Ice-Essence Toner, Refined Hydro-Care and Cell Repair range are pH-balanced and formulated with soothing actives like chamomile, licorice extract and Centella. We always recommend a 24-hour patch test before first use.",
    sortOrder: 2,
  },
  {
    category: "Skincare",
    question: "In what order should I apply the products?",
    answer:
      "Cleanse → Essential Lotion Toner → Serum (Oxy-Bright or Hydro-Moist) → Intense Lift Eye Treatment Crème → Moisturiser. In the morning, finish with Refined HA UV Shield SPF35. At night, the cream seals everything in.",
    sortOrder: 3,
  },
  {
    category: "Skincare",
    question: "How long until I see results?",
    answer:
      "Hydration and texture improvements are often visible within days. Tone and dark-spot results from the Oxy-Bright Serum typically appear over 4–8 weeks of consistent use.",
    sortOrder: 4,
  },
  {
    category: "Distributor",
    question: "How do I become a MÉRVÉILLÉUX distributor?",
    answer:
      "Register an account and send us an enquiry, or message us on WhatsApp. Approved distributors complete our online training programme (6 modules) and an in-person session before they begin selling.",
    sortOrder: 5,
  },
  {
    category: "Distributor",
    question: "Is there training and support for distributors?",
    answer:
      "Absolutely. Every distributor gets access to our structured training portal, an ongoing skincare knowledge base, and an AI assistant for product guidance and skincare consultations — plus human team support.",
    sortOrder: 6,
  },
];

export type SeedModule = {
  ord: number;
  icon: string;
  title: string;
  cnTitle: string;
  summary: string;
  lessons: string[];
  durationMins: number;
  quiz: { question: string; options: string[]; answerIndex: number }[];
};

export const seedModules: SeedModule[] = [
  {
    ord: 1,
    icon: "🏢",
    title: "Company Culture",
    cnTitle: "公司文化",
    summary: "Brand story, vision, mission and the values behind Mérvéilléux.",
    lessons: [
      "Our origin & brand story",
      "Vision, mission & values",
      "What 'Mérvéilléux' stands for",
    ],
    durationMins: 25,
    quiz: [
      {
        question: "What does “Merveilleux” mean?",
        options: ["Mysterious", "Marvellous", "Modern", "Mineral"],
        answerIndex: 1,
      },
      {
        question: "What standard are our formulas developed to?",
        options: [
          "No particular standard",
          "French cosmetic standards",
          "Home-made",
          "Food-grade only",
        ],
        answerIndex: 1,
      },
      {
        question: "Which best describes our brand positioning?",
        options: [
          "Cheapest possible products",
          "Luxury-grade formulas at a fair price",
          "Medical prescription skincare",
          "Colour cosmetics only",
        ],
        answerIndex: 1,
      },
      {
        question: "Who is our core customer in this market?",
        options: [
          "Only teenagers",
          "Modern skin-conscious customers in a tropical climate",
          "Only men over 60",
          "Industrial buyers",
        ],
        answerIndex: 1,
      },
      {
        question: "What underpins everything we do?",
        options: [
          "Aggressive discounting",
          "Trust, quality and results",
          "One-time sales",
          "Mass spam marketing",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    ord: 2,
    icon: "📜",
    title: "Distributor Policy",
    cnTitle: "经销商政策",
    summary: "Terms & conditions, commission structure and conduct rules.",
    lessons: [
      "Distributor terms & conditions",
      "Commission & incentive structure",
      "Code of conduct",
    ],
    durationMins: 30,
    quiz: [
      {
        question: "Before selling, a new distributor must…",
        options: [
          "Start immediately, no steps",
          "Complete online training + in-person onboarding",
          "Only pay a fee",
          "Just read one PDF",
        ],
        answerIndex: 1,
      },
      {
        question: "The passing mark for each module quiz is…",
        options: ["50", "70", "90", "100"],
        answerIndex: 1,
      },
      {
        question: "Which is against our code of conduct?",
        options: [
          "Honest product claims",
          "Making false medical promises",
          "Patch-test advice",
          "Following the SOP",
        ],
        answerIndex: 1,
      },
      {
        question: "Customer pricing should be…",
        options: [
          "Whatever you like, undercutting others",
          "Per the official price list",
          "Always free",
          "Hidden from customers",
        ],
        answerIndex: 1,
      },
      {
        question: "Confidential brand materials should be…",
        options: [
          "Shared publicly",
          "Kept within the distributor network",
          "Sold to competitors",
          "Posted anonymously",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    ord: 3,
    icon: "💄",
    title: "Product Training",
    cnTitle: "产品培训",
    summary: "Formulations, ingredients, benefits and usage routines.",
    lessons: [
      "The product range in depth",
      "Key ingredients & benefits",
      "Building a routine for customers",
    ],
    durationMins: 40,
    quiz: [
      {
        question: "Which product is the brightening oxygen concentrate?",
        options: [
          "Hyaluronate Moisturiser",
          "Oxy-Bright Serum",
          "Gentle Cleansing Milk",
          "Aqua-Concentrate Mask",
        ],
        answerIndex: 1,
      },
      {
        question: "What is the correct routine order?",
        options: [
          "Cream → Serum → Cleanser",
          "Cleanse → Toner → Serum → Cream",
          "Serum → Cleanse → Toner",
          "Mask → Cleanse → Toner",
        ],
        answerIndex: 1,
      },
      {
        question: "The Cell Repair Treatment Cream rebuilds the barrier mainly with…",
        options: ["Alcohol", "Ergothioneine & peptides", "Fragrance", "Clay"],
        answerIndex: 1,
      },
      {
        question: "Refined HA UV Shield SPF35 is notable because it…",
        options: [
          "Leaves a heavy white cast",
          "Is light, hydrating and non-greasy",
          "Replaces moisturiser entirely",
          "Is only for night use",
        ],
        answerIndex: 1,
      },
      {
        question: "Which finishes a morning routine?",
        options: [
          "Refined HA UV Shield SPF35",
          "Aqua-Concentrate Mask",
          "Gentle Cleansing Milk",
          "Nothing",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    ord: 4,
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
    quiz: [
      {
        question: "When an order comes in, you should first…",
        options: [
          "Ignore it for a week",
          "Confirm details & stock, then process promptly",
          "Cancel it",
          "Change the price",
        ],
        answerIndex: 1,
      },
      {
        question: "A customer reports irritation. You…",
        options: [
          "Tell them to keep using it",
          "Advise stopping use, reassure, and escalate per SOP",
          "Ignore them",
          "Blame the customer",
        ],
        answerIndex: 1,
      },
      {
        question: "Our customer-service tone should be…",
        options: [
          "Rude and rushed",
          "Warm, professional and helpful",
          "Robotic",
          "Dismissive",
        ],
        answerIndex: 1,
      },
      {
        question: "Returns should be handled…",
        options: [
          "Never, no returns ever",
          "Per the official returns & exchange policy",
          "Only for friends",
          "By keeping the money",
        ],
        answerIndex: 1,
      },
      {
        question: "Good record-keeping of orders helps with…",
        options: [
          "Nothing",
          "Follow-up, restock and customer care",
          "Hiding mistakes",
          "Avoiding customers",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    ord: 5,
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
    quiz: [
      {
        question: "A good opener focuses on…",
        options: [
          "Pushing the most expensive item",
          "The customer's skin concern and goal",
          "Talking about yourself",
          "Discount only",
        ],
        answerIndex: 1,
      },
      {
        question: "“It's too expensive” is best met with…",
        options: [
          "Arguing with the customer",
          "Value, results and cost-per-use framing",
          "Giving up",
          "Ignoring it",
        ],
        answerIndex: 1,
      },
      {
        question: "The most trustworthy proof in skincare is…",
        options: [
          "Exaggerated claims",
          "Real before/after results & testimonials",
          "Pressure tactics",
          "Fake reviews",
        ],
        answerIndex: 1,
      },
      {
        question: "When closing, you should…",
        options: [
          "Be pushy and aggressive",
          "Recommend a clear next step and routine",
          "Never ask for the sale",
          "Confuse the customer",
        ],
        answerIndex: 1,
      },
      {
        question: "After the sale, the best move is…",
        options: [
          "Disappear",
          "Follow up on results and reorder",
          "Spam unrelated offers",
          "Nothing",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    ord: 6,
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
    quiz: [
      {
        question: "Our brand voice on social is…",
        options: [
          "Loud and spammy",
          "Elegant, warm and trustworthy",
          "Aggressive",
          "Inconsistent",
        ],
        answerIndex: 1,
      },
      {
        question: "Which claim is NOT allowed?",
        options: [
          "“Hydrates the skin”",
          "“Cures eczema permanently”",
          "“Helps brighten tone”",
          "“Lightweight finish”",
        ],
        answerIndex: 1,
      },
      {
        question: "Brand colours and logo should be…",
        options: [
          "Changed freely",
          "Used consistently per brand guidelines",
          "Ignored",
          "Replaced with competitors'",
        ],
        answerIndex: 1,
      },
      {
        question: "Promotions must follow…",
        options: [
          "No rules",
          "The official promotions policy & pricing",
          "Random discounts",
          "Whatever competitors do",
        ],
        answerIndex: 1,
      },
      {
        question: "User-generated testimonials should be…",
        options: [
          "Faked",
          "Genuine and with permission",
          "Bought",
          "Copied from others",
        ],
        answerIndex: 1,
      },
    ],
  },
];

export type SeedKbArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  tags: string[];
  sortOrder: number;
};

export const seedKbArticles: SeedKbArticle[] = [
  {
    slug: "dark-spots-hyperpigmentation",
    title: "Case: Dark spots & post-acne marks",
    category: "Skincare Cases",
    excerpt:
      "A routine for uneven tone and stubborn post-acne marks in tropical skin.",
    body: "**Concern:** Uneven tone, sun-induced dark spots and lingering post-acne marks — extremely common in our climate.\n\n**Why it happens:** UV exposure and inflammation (e.g. after acne) trigger excess melanin. Without daily SPF, marks fade slowly and new ones form.\n\n**Recommended routine:**\n1. **Gentle Cleansing Milk** morning & night.\n2. **Oxy-Bright Serum** every morning on clean skin.\n3. **Youth-HA Moisturiser** to brighten and lock in.\n4. **Refined HA UV Shield SPF35** every single morning — non-negotiable for fading marks.\n\n**Timeline:** Expect visible evening of tone in 4–8 weeks with consistent SPF. Set this expectation with customers up front.\n\n**Pro tip:** The number-one reason brightening 'doesn't work' is skipping sunscreen. Sell the serum and the SPF together.",
    tags: ["pigmentation", "brightening", "spf", "post-acne"],
    sortOrder: 1,
  },
  {
    slug: "dehydrated-vs-dry-skin",
    title: "Dehydrated vs dry skin — and how to fix each",
    category: "Skincare Cases",
    excerpt:
      "They feel similar but need different solutions. Here's how to tell them apart.",
    body: "**Dehydrated skin** lacks *water*. It can look dull, feel tight, and show fine 'crepey' lines — even on oily skin. **Dry skin** lacks *oil* (lipids); it flakes and feels rough.\n\n**For dehydration:** layer water-based hydration. **Essential Lotion Toner** → **Hydro-Moist Serum** (multi-weight hyaluronic + ceramide) → seal with **Hyaluronate Moisturiser**.\n\n**For dryness:** prioritise barrier lipids — **Cell Repair Treatment Cream** (ergothioneine + peptides), and avoid over-cleansing.\n\n**Both at once?** Very common in air-conditioned offices. Use the full hydration layering plus the cream.\n\n**Counter-intuitive tip:** oily, breakout-prone skin is often *dehydrated*. Don't strip it — hydrate it, and oil production usually calms down.",
    tags: ["hydration", "dry skin", "hyaluronic acid", "barrier"],
    sortOrder: 2,
  },
  {
    slug: "sensitive-skin-redness",
    title: "Calming sensitive, reactive skin",
    category: "Skincare Cases",
    excerpt: "A gentle, barrier-first approach for redness and reactivity.",
    body: "**Concern:** Stinging, redness, reacting to many products.\n\n**Principle:** Less is more. Repair the barrier first, introduce actives slowly.\n\n**Routine:**\n1. **Gentle Cleansing Milk** (chamomile) — never strip.\n2. **Refined Hydro-Care** with oat peptides to soothe and rebuild.\n3. For flare-ups, **Cell Repair Powder** as an intensive recovery boost.\n4. **Refined HA UV Shield SPF35** — sensitive skin burns and reacts faster.\n\n**Hold off on:** strong brightening or exfoliating acids until the barrier is calm. Introduce the Oxy-Bright Serum every other day once stable.\n\n**Always:** patch-test new products for 24 hours behind the ear or on the inner arm.",
    tags: ["sensitive", "redness", "repair", "barrier"],
    sortOrder: 3,
  },
  {
    slug: "ingredient-niacinamide",
    title: "Ingredient guide: Niacinamide",
    category: "Ingredient Glossary",
    excerpt: "The multitasker in the Hydro-Moist Serum and Pore Refining Serum.",
    body: "**What it is:** Vitamin B3, one of the best-studied skincare actives.\n\n**What it does:** regulates oil, strengthens the barrier, visibly brightens tone, and calms redness. Well-tolerated by most skin types.\n\n**In our range:** featured in the **Hydro-Moist Serum**, **Pore Refining Serum** and **Youth-HA Moisturiser**.\n\n**Pairs well with:** hyaluronic acid, ceramides, SPF.\n\n**Talking point for customers:** 'a gentle all-rounder that brightens and balances without irritation.'",
    tags: ["niacinamide", "ingredients", "oil control", "brightening"],
    sortOrder: 4,
  },
  {
    slug: "ingredient-hyaluronic-acid",
    title: "Ingredient guide: Hyaluronic acid",
    category: "Ingredient Glossary",
    excerpt: "Why molecular weight matters for real hydration.",
    body: "**What it is:** a humectant that binds water to skin.\n\n**Molecular weight matters:** high-weight HA hydrates the surface; low-weight HA reaches deeper layers. The **Hydro-Moist Serum** works with larger molecules for a protective surface veil, while the **Hydro-Sensi Concentré** uses ultra-fine molecules (under 500 Daltons) for deep-layer hydration.\n\n**Use tip:** apply to slightly damp skin, then seal with the **Hyaluronate Moisturiser** so the water doesn't evaporate in dry, air-conditioned air.\n\n**Myth-buster:** in very dry environments, HA alone can feel tight — that's why sealing with a cream matters.",
    tags: ["hyaluronic acid", "hydration", "ingredients"],
    sortOrder: 5,
  },
  {
    slug: "spf-the-most-important-step",
    title: "Why SPF is the most important step",
    category: "Customer FAQ",
    excerpt: "The single biggest lever for tone, ageing and protecting results.",
    body: "**Short version:** sunscreen protects every other result you've paid for.\n\n**Why daily, even indoors:** UVA passes through windows and contributes to pigmentation and ageing. In our climate, UV is high year-round.\n\n**Our picks:** **Refined HA UV Shield SPF35** for a hydrating finish, or **UV Protection SPF35 PA+++** for an ultra-light dry-touch feel — both broad-spectrum, so customers actually reapply.\n\n**How much:** about two finger-lengths for the face and neck; reapply through the day when outdoors.\n\n**Sales angle:** pair SPF with any brightening purchase — without it, brightening results stall.",
    tags: ["spf", "sun protection", "faq"],
    sortOrder: 6,
  },
  {
    slug: "building-a-routine",
    title: "How to build a simple, effective routine",
    category: "Product Usage Guide",
    excerpt: "The correct order, AM and PM, using the Mérvéilléux range.",
    body: "**Order = thinnest to thickest, then SPF last in the morning.**\n\n**Morning:**\n1. Gentle Cleansing Milk\n2. Essential Lotion Toner\n3. Oxy-Bright Serum\n4. Intense Lift Eye Treatment Crème\n5. Hyaluronate Moisturiser\n6. Refined HA UV Shield SPF35\n\n**Night:**\n1. Gentle Cleansing Milk\n2. Essential Lotion Toner\n3. Hydro-Moist Serum\n4. Intense Lift Eye Treatment Crème\n5. Cell Repair Treatment Cream\n\n**Weekly:** Aqua-Concentrate Mask 1–2× for a hydration boost.\n\n**Keep it realistic:** a routine the customer will actually follow beats a perfect one they abandon. Start with cleanse + serum + cream + SPF, then build.",
    tags: ["routine", "usage", "how-to"],
    sortOrder: 7,
  },
  {
    slug: "oily-acne-prone-tropical",
    title: "Case: Oily, breakout-prone skin in humidity",
    category: "Skincare Cases",
    excerpt: "Control shine and breakouts without stripping the barrier.",
    body: "**Concern:** Midday shine, congestion and breakouts in hot, humid weather.\n\n**Key insight:** stripping oily skin makes it produce *more* oil. Hydrate and balance instead.\n\n**Routine:**\n1. **Ultrafine Cleansing Gel** AM & PM (don't over-wash).\n2. **Pore Refining Serum** on congested areas to clear and balance.\n3. **Hydro-Sensi Concentré** for oil-free hydration.\n4. A light layer of **Refined Hydro-Care**.\n5. **UV Protection SPF35 PA+++** (dry-touch, won't clog).\n\n**Add:** the **Blemish Serum** as a targeted treatment on active breakouts.\n\n**Tell customers:** consistency beats harsh scrubbing. Expect calmer skin over a few weeks.",
    tags: ["oily skin", "acne", "pore care", "humidity"],
    sortOrder: 8,
  },
];

export const PASS_MARK = 70;

// ============================================================
// Product-detail enrichment — extra fields for the per-product pages
// (category, size, suitable skin types, how-to-use). Kept OUT of
// `seedProducts` so DB seeding (which inserts seedProducts directly)
// stays untouched. Merged onto products by slug.
// `category` → dict.products.categories key. `skinTypes` → skinTypeLabels
// keys. `howToUse` is localised inline (en/zh/ms), one language per locale.
// ============================================================

export type ProductDetail = {
  category: string;
  size: string;
  skinTypes: string[];
  howToUse: { en: string[]; zh: string[]; ms: string[] };
};

export const productDetails: Record<string, ProductDetail> = {
  "gentle-cleansing-milk": {
    category: "cleansers",
    size: "200 ml",
    skinTypes: ["all", "sensitive", "dry"],
    howToUse: {
      en: [
        "Dispense onto dry hands and massage over dry or damp skin.",
        "Work gently over the face to dissolve makeup and impurities, avoiding the eyes.",
        "Rinse with lukewarm water. Use morning and night.",
      ],
      zh: [
        "取适量于干爽双手，涂抹于干或微湿的肌肤。",
        "轻柔按摩全脸以溶解彩妆与污垢，避开眼周。",
        "以温水冲洗。早晚使用。",
      ],
      ms: [
        "Tuang ke tangan yang kering dan urut pada kulit kering atau lembap.",
        "Urut perlahan pada muka untuk melarutkan solekan dan kotoran, elak mata.",
        "Bilas dengan air suam. Gunakan pagi dan malam.",
      ],
    },
  },
  "ultrafine-cleansing-gel": {
    category: "cleansers",
    size: "150 ml",
    skinTypes: ["all", "combination", "oily"],
    howToUse: {
      en: [
        "Add water and lather a small amount into a fine, dense foam.",
        "Massage over a wet face for 30–60 seconds, avoiding the eyes.",
        "Rinse with lukewarm water. Use morning and night.",
      ],
      zh: [
        "加水将少量凝胶搓出细密泡沫。",
        "于湿润的脸部按摩 30–60 秒，避开眼周。",
        "以温水冲洗。早晚使用。",
      ],
      ms: [
        "Tambah air dan buihkan sedikit gel menjadi buih halus dan padat.",
        "Urut pada muka yang basah selama 30–60 saat, elak mata.",
        "Bilas dengan air suam. Gunakan pagi dan malam.",
      ],
    },
  },
  "micellaire-solution": {
    category: "cleansers",
    size: "120 ml",
    skinTypes: ["all", "combination", "sensitive"],
    howToUse: {
      en: [
        "Saturate a cotton pad with the solution.",
        "Sweep gently over the face and eyes to lift makeup and impurities — no rinsing needed.",
        "Follow with your cleanser for a full cleanse.",
      ],
      zh: [
        "以卸妆水浸湿化妆棉。",
        "轻扫全脸与眼部，卸除彩妆与污垢——无需冲洗。",
        "随后使用洁面乳进行二次清洁。",
      ],
      ms: [
        "Basahkan kapas dengan larutan ini.",
        "Sapu perlahan pada muka dan mata untuk mengangkat solekan — tanpa bilas.",
        "Ikuti dengan pencuci muka untuk pembersihan penuh.",
      ],
    },
  },
  "essential-lotion-toner": {
    category: "toners",
    size: "150 ml",
    skinTypes: ["all", "sensitive"],
    howToUse: {
      en: [
        "After cleansing, pour a few drops into your palm or onto a cotton pad.",
        "Press gently over the face to hydrate and prep.",
        "Follow immediately with serum while skin is still damp.",
      ],
      zh: [
        "洁面后，取数滴于掌心或化妆棉。",
        "轻拍于脸部，补水并打底。",
        "趁肌肤微湿时立即接续精华。",
      ],
      ms: [
        "Selepas membersih, tuang beberapa titis ke tapak tangan atau kapas.",
        "Tepuk lembut pada muka untuk melembap dan menyediakan kulit.",
        "Ikuti segera dengan serum semasa kulit masih lembap.",
      ],
    },
  },
  "ceramide-toner": {
    category: "toners",
    size: "100 ml",
    skinTypes: ["all", "sensitive", "dry"],
    howToUse: {
      en: [
        "After cleansing, apply a few drops to the palm or a cotton pad.",
        "Press evenly over the face and neck.",
        "Follow with serum and moisturiser. Use morning and night.",
      ],
      zh: [
        "洁面后，取数滴于掌心或化妆棉。",
        "均匀轻拍于脸部与颈部。",
        "随后使用精华与面霜。早晚使用。",
      ],
      ms: [
        "Selepas membersih, sapu beberapa titis ke tapak tangan atau kapas.",
        "Tepuk sekata pada muka dan leher.",
        "Ikuti dengan serum dan pelembap. Gunakan pagi dan malam.",
      ],
    },
  },
  "micro-nano-mist": {
    category: "toners",
    size: "100 ml",
    skinTypes: ["all", "sensitive"],
    howToUse: {
      en: [
        "Hold 15–20 cm from the face and mist evenly.",
        "Press lightly into the skin, or let it absorb on its own.",
        "Use any time to refresh — before serum, or over makeup.",
      ],
      zh: [
        "距离脸部约 15–20 厘米，均匀喷洒。",
        "轻拍至吸收，或让其自然吸收。",
        "随时使用以提神——精华前或妆容之上皆可。",
      ],
      ms: [
        "Semburkan sekata pada jarak 15–20 cm dari muka.",
        "Tepuk perlahan ke dalam kulit atau biar meresap sendiri.",
        "Guna bila-bila masa untuk menyegarkan — sebelum serum atau atas solekan.",
      ],
    },
  },
  "oxy-bright-serum": {
    category: "serums",
    size: "30 ml",
    skinTypes: ["all", "dry", "normal"],
    howToUse: {
      en: [
        "Each morning, after toner, apply 3–4 drops to clean, dry skin.",
        "Pat gently until absorbed, then follow with moisturiser.",
        "Always finish your morning routine with an SPF.",
      ],
      zh: [
        "每天早上化妆水后，取 3–4 滴涂于洁净干爽的肌肤。",
        "轻拍至吸收，随后使用面霜。",
        "早晨护理请务必以防晒作结。",
      ],
      ms: [
        "Setiap pagi selepas toner, sapu 3–4 titis pada kulit yang bersih dan kering.",
        "Tepuk perlahan sehingga meresap, kemudian ikuti dengan pelembap.",
        "Sentiasa akhiri rutin pagi anda dengan SPF.",
      ],
    },
  },
  "hydro-moist-serum": {
    category: "serums",
    size: "30 ml",
    skinTypes: ["all", "dry", "sensitive"],
    howToUse: {
      en: [
        "Apply 3–4 drops to damp skin morning and night, after toner.",
        "Press into the skin, then seal with moisturiser.",
        "Layer on more during dry spells or after air travel.",
      ],
      zh: [
        "早晚于化妆水后，取 3–4 滴涂于微湿的肌肤。",
        "按压吸收，再以面霜锁住水分。",
        "干燥的日子或长途飞行后可多叠加一层。",
      ],
      ms: [
        "Sapu 3–4 titis pada kulit lembap pagi dan malam, selepas toner.",
        "Tekan lembut ke dalam kulit, kemudian kunci dengan pelembap.",
        "Sapu lebih banyak pada hari kering atau selepas penerbangan.",
      ],
    },
  },
  "hydro-sensi-concentre": {
    category: "serums",
    size: "30 ml",
    skinTypes: ["sensitive", "dry", "all"],
    howToUse: {
      en: [
        "After toner, apply 3–4 drops to damp skin.",
        "Press gently until absorbed — ideal for reactive, dehydrated skin.",
        "Seal with a soothing moisturiser. Use morning and night.",
      ],
      zh: [
        "化妆水后，取 3–4 滴涂于微湿的肌肤。",
        "轻按至吸收——特别适合敏感、缺水肌肤。",
        "以舒缓面霜锁住水分。早晚使用。",
      ],
      ms: [
        "Selepas toner, sapu 3–4 titis pada kulit lembap.",
        "Tepuk perlahan sehingga meresap — sesuai untuk kulit reaktif dan dehidrasi.",
        "Kunci dengan pelembap menenangkan. Gunakan pagi dan malam.",
      ],
    },
  },
  "antioxidant-serum": {
    category: "serums",
    size: "30 ml",
    skinTypes: ["all", "normal", "dry"],
    howToUse: {
      en: [
        "After toner, apply 3–4 drops to clean skin morning and night.",
        "Press over the face and neck until absorbed.",
        "Follow with the Revitalise Anti-Oxidant Cream to seal in.",
      ],
      zh: [
        "化妆水后，早晚取 3–4 滴涂于洁净肌肤。",
        "轻按于脸部与颈部至吸收。",
        "随后使用抗老修复面霜锁住成分。",
      ],
      ms: [
        "Selepas toner, sapu 3–4 titis pada kulit bersih pagi dan malam.",
        "Tepuk pada muka dan leher sehingga meresap.",
        "Ikuti dengan Revitalise Anti-Oxidant Cream untuk mengunci.",
      ],
    },
  },
  "antioxidant-essence": {
    category: "serums",
    size: "30 ml",
    skinTypes: ["all", "normal", "dry"],
    howToUse: {
      en: [
        "After toner, smooth 3–4 drops over the face and neck.",
        "Press in until absorbed, focusing on areas of concern.",
        "Layer under serum and cream, morning and night.",
      ],
      zh: [
        "化妆水后，取 3–4 滴匀涂于脸部与颈部。",
        "按压至吸收，重点照顾在意部位。",
        "叠搽于精华与面霜之下，早晚使用。",
      ],
      ms: [
        "Selepas toner, sapu 3–4 titis pada muka dan leher.",
        "Tepuk sehingga meresap, fokus pada kawasan yang dibimbangkan.",
        "Sapu di bawah serum dan krim, pagi dan malam.",
      ],
    },
  },
  "blemish-serum": {
    category: "serums",
    size: "15 ml",
    skinTypes: ["oily", "combination"],
    howToUse: {
      en: [
        "After cleansing, apply a small amount directly to blemishes.",
        "Use up to a few times a day on affected areas.",
        "Continue for severe cases to help minimise scarring.",
      ],
      zh: [
        "洁面后，取少量直接点涂于痘痘部位。",
        "每日可于患处使用数次。",
        "情况较严重者可持续使用，帮助淡化痘印。",
      ],
      ms: [
        "Selepas membersih, sapu sedikit terus pada jerawat.",
        "Guna beberapa kali sehari pada kawasan terjejas.",
        "Teruskan untuk kes teruk bagi membantu mengurangkan parut.",
      ],
    },
  },
  "pore-refining-serum": {
    category: "serums",
    size: "15 ml",
    skinTypes: ["oily", "combination"],
    howToUse: {
      en: [
        "After toner, apply to congested areas — nose, chin, forehead.",
        "Use morning and night on blackheads and clogged pores.",
        "Follow with a light moisturiser.",
      ],
      zh: [
        "化妆水后，涂于阻塞部位——鼻翼、下巴、额头。",
        "早晚用于黑头与堵塞毛孔。",
        "随后使用清爽面霜。",
      ],
      ms: [
        "Selepas toner, sapu pada kawasan tersumbat — hidung, dagu, dahi.",
        "Guna pagi dan malam pada bintik hitam dan liang tersumbat.",
        "Ikuti dengan pelembap ringan.",
      ],
    },
  },
  "cell-repair-powder": {
    category: "serums",
    size: "10 g",
    skinTypes: ["sensitive", "all"],
    howToUse: {
      en: [
        "Mix the freeze-dried powder with the accompanying toner or essence.",
        "Apply the activated solution to clean skin and press in.",
        "Use as an intensive treatment on redness, damage or irritation.",
      ],
      zh: [
        "将冻干粉与随附的化妆水或精华调和。",
        "把调活后的溶液涂于洁净肌肤并按压吸收。",
        "作为强效护理，用于泛红、受损或刺激部位。",
      ],
      ms: [
        "Campurkan serbuk sejuk-beku dengan toner atau esen yang disertakan.",
        "Sapu larutan yang diaktifkan pada kulit bersih dan tepuk masuk.",
        "Guna sebagai rawatan intensif pada kemerahan, kerosakan atau kerengsaan.",
      ],
    },
  },
  "cell-repair-powder-3g": {
    category: "serums",
    size: "3 g",
    skinTypes: ["sensitive", "all"],
    howToUse: {
      en: [
        "Activate the travel-size powder with toner or essence.",
        "Apply to clean skin and press in until absorbed.",
        "Ideal for travel or as a first trial of the repair range.",
      ],
      zh: [
        "以化妆水或精华调活这款便携装冻干粉。",
        "涂于洁净肌肤并按压至吸收。",
        "适合旅行携带，或作为修复系列的初次体验。",
      ],
      ms: [
        "Aktifkan serbuk saiz perjalanan dengan toner atau esen.",
        "Sapu pada kulit bersih dan tepuk sehingga meresap.",
        "Sesuai untuk perjalanan atau percubaan pertama rangkaian repair.",
      ],
    },
  },
  "hyaluronate-moisturiser": {
    category: "moisturisers",
    size: "30 ml",
    skinTypes: ["dry", "combination", "sensitive"],
    howToUse: {
      en: [
        "Warm a pea-sized amount between your fingertips.",
        "Massage over face and neck as the last step (before SPF in the morning).",
        "Use morning and night.",
      ],
      zh: [
        "取豌豆大小的用量于指尖温热。",
        "作为最后一步按摩于脸部与颈部（早晨在防晒之前）。",
        "早晚使用。",
      ],
      ms: [
        "Panaskan jumlah sebesar kacang di hujung jari.",
        "Urut ke muka dan leher sebagai langkah terakhir (sebelum SPF pada waktu pagi).",
        "Gunakan pagi dan malam.",
      ],
    },
  },
  "youth-ha-moisturiser": {
    category: "moisturisers",
    size: "30 ml",
    skinTypes: ["combination", "dry"],
    howToUse: {
      en: [
        "Warm a pea-sized amount and smooth over face and neck.",
        "Use as the last skincare step, morning and night.",
        "In the morning, follow with an SPF.",
      ],
      zh: [
        "取豌豆大小温热后，匀涂于脸部与颈部。",
        "作为护肤最后一步，早晚使用。",
        "早晨请接续防晒。",
      ],
      ms: [
        "Panaskan jumlah sebesar kacang dan sapu pada muka dan leher.",
        "Guna sebagai langkah terakhir, pagi dan malam.",
        "Pada waktu pagi, ikuti dengan SPF.",
      ],
    },
  },
  "antioxidant-cream": {
    category: "moisturisers",
    size: "30 g",
    skinTypes: ["all", "dry"],
    howToUse: {
      en: [
        "Apply a small amount to face and neck as the last step.",
        "Massage upward until absorbed.",
        "Use morning and night; follow with SPF in the day.",
      ],
      zh: [
        "作为最后一步，取少量涂于脸部与颈部。",
        "由下往上按摩至吸收。",
        "早晚使用；日间请接续防晒。",
      ],
      ms: [
        "Sapu sedikit pada muka dan leher sebagai langkah terakhir.",
        "Urut ke atas sehingga meresap.",
        "Gunakan pagi dan malam; ikuti dengan SPF pada siang hari.",
      ],
    },
  },
  "cell-repair-cream": {
    category: "moisturisers",
    size: "30 ml",
    skinTypes: ["dry", "sensitive"],
    howToUse: {
      en: [
        "Warm a small amount and press over cleansed skin.",
        "Focus on dry, rough or compromised areas.",
        "Use as the final step, morning and night.",
      ],
      zh: [
        "取少量温热后，按压于洁净肌肤。",
        "重点照顾干燥、粗糙或受损部位。",
        "作为最后一步，早晚使用。",
      ],
      ms: [
        "Panaskan sedikit dan tekan pada kulit yang bersih.",
        "Fokus pada kawasan kering, kasar atau terjejas.",
        "Guna sebagai langkah terakhir, pagi dan malam.",
      ],
    },
  },
  "refined-hydro-care": {
    category: "moisturisers",
    size: "30 ml",
    skinTypes: ["sensitive", "all", "dry"],
    howToUse: {
      en: [
        "Smooth a gentle layer over cleansed, toned skin.",
        "Ideal for calming sensitivity, dryness and post-treatment skin.",
        "Use morning and night.",
      ],
      zh: [
        "于洁净、爽肤后的肌肤匀涂薄薄一层。",
        "特别适合舒缓敏感、干燥及术后肌肤。",
        "早晚使用。",
      ],
      ms: [
        "Sapu lapisan lembut pada kulit yang dibersih dan ditoner.",
        "Sesuai menenangkan kulit sensitif, kering dan selepas rawatan.",
        "Gunakan pagi dan malam.",
      ],
    },
  },
  "essence-oil": {
    category: "moisturisers",
    size: "20 ml",
    skinTypes: ["dry", "normal"],
    howToUse: {
      en: [
        "Warm 2–3 drops between the palms.",
        "Press gently over the face as the last step, or mix into your cream.",
        "Best at night; use sparingly in humid weather.",
      ],
      zh: [
        "取 2–3 滴于掌心温热。",
        "作为最后一步轻按于脸部，或与面霜混合使用。",
        "夜间使用最佳；潮湿天气请少量使用。",
      ],
      ms: [
        "Panaskan 2–3 titis di antara tapak tangan.",
        "Tekan lembut pada muka sebagai langkah terakhir, atau campur ke dalam krim.",
        "Terbaik pada waktu malam; guna sedikit pada cuaca lembap.",
      ],
    },
  },
  "eye-treatment-creme": {
    category: "eye",
    size: "20 ml",
    skinTypes: ["all"],
    howToUse: {
      en: [
        "Dot a rice-grain amount under and around each eye.",
        "Tap gently with your ring finger until absorbed.",
        "Use morning and night, before moisturiser.",
      ],
      zh: [
        "取米粒大小分点于双眼下方及周围。",
        "以无名指轻弹至吸收。",
        "早晚使用，于面霜之前。",
      ],
      ms: [
        "Titiskan jumlah sebesar sebutir beras di bawah dan sekeliling setiap mata.",
        "Tepuk perlahan dengan jari manis sehingga meresap.",
        "Gunakan pagi dan malam, sebelum pelembap.",
      ],
    },
  },
  "uv-shield-spf35": {
    category: "sun",
    size: "30 ml",
    skinTypes: ["all"],
    howToUse: {
      en: [
        "As the final morning step, apply two finger-lengths to face and neck.",
        "Apply 20 minutes before going outdoors.",
        "Reapply every 2–3 hours when outdoors.",
      ],
      zh: [
        "作为早晨最后一步，取两指节长度涂于脸部与颈部。",
        "外出前 20 分钟涂抹。",
        "户外时每 2–3 小时补涂一次。",
      ],
      ms: [
        "Sebagai langkah pagi terakhir, sapu sepanjang dua jari pada muka dan leher.",
        "Sapu 20 minit sebelum keluar.",
        "Sapu semula setiap 2–3 jam apabila di luar.",
      ],
    },
  },
  "uv-protection-spf35": {
    category: "sun",
    size: "30 ml",
    skinTypes: ["all", "oily", "combination"],
    howToUse: {
      en: [
        "Apply as the last morning step, before makeup.",
        "Smooth two finger-lengths evenly over face and neck.",
        "Reapply every 2–3 hours when outdoors.",
      ],
      zh: [
        "作为早晨最后一步，于上妆前使用。",
        "取两指节长度均匀涂于脸部与颈部。",
        "户外时每 2–3 小时补涂一次。",
      ],
      ms: [
        "Sapu sebagai langkah pagi terakhir, sebelum solekan.",
        "Sapu sepanjang dua jari sekata pada muka dan leher.",
        "Sapu semula setiap 2–3 jam apabila di luar.",
      ],
    },
  },
  "aqua-concentrate-mask": {
    category: "masks",
    size: "50 ml",
    skinTypes: ["all", "dry"],
    howToUse: {
      en: [
        "After toner, apply a generous layer over cleansed skin.",
        "Leave on for 15–20 minutes, then massage in or rinse.",
        "Use 2–3× a week for a hydration boost.",
      ],
      zh: [
        "化妆水后，于洁净肌肤敷上厚厚一层。",
        "静敷 15–20 分钟，再按摩吸收或冲洗。",
        "每周使用 2–3 次，加强补水。",
      ],
      ms: [
        "Selepas toner, sapu lapisan tebal pada kulit yang bersih.",
        "Biar selama 15–20 minit, kemudian urut masuk atau bilas.",
        "Guna 2–3 kali seminggu untuk hidrasi.",
      ],
    },
  },
  "hydra-soothing-gel-mask": {
    category: "masks",
    size: "50 ml",
    skinTypes: ["all", "sensitive"],
    howToUse: {
      en: [
        "Apply an even layer to cleansed skin.",
        "Leave on for 15–20 minutes for a cooling, soothing effect.",
        "Rinse or massage in the remaining gel. Use 2–3× a week.",
      ],
      zh: [
        "于洁净肌肤匀敷一层。",
        "静敷 15–20 分钟，带来清凉舒缓感。",
        "冲洗或将剩余凝胶按摩吸收。每周使用 2–3 次。",
      ],
      ms: [
        "Sapu lapisan sekata pada kulit yang bersih.",
        "Biar selama 15–20 minit untuk kesan sejuk dan menenangkan.",
        "Bilas atau urut baki gel. Guna 2–3 kali seminggu.",
      ],
    },
  },
  "silk-mask": {
    category: "masks",
    size: "5 sheets",
    skinTypes: ["sensitive", "all"],
    howToUse: {
      en: [
        "After toner, unfold the silk mask and smooth it over cleansed skin.",
        "Relax for 15–20 minutes.",
        "Remove and pat in the remaining essence. Ideal after treatments.",
      ],
      zh: [
        "化妆水后，展开丝膜并服帖敷于洁净肌肤。",
        "放松敷 15–20 分钟。",
        "取下后轻拍剩余精华至吸收。术后使用尤佳。",
      ],
      ms: [
        "Selepas toner, buka silk mask dan lekapkan pada kulit yang bersih.",
        "Rehat selama 15–20 minit.",
        "Tanggalkan dan tepuk baki esen. Sesuai selepas rawatan.",
      ],
    },
  },
};

// ============================================================
// Promotions / bundles — used by the /promotions page. Prices in RM.
// Localised copy (title / desc / tag) lives in the dictionaries under
// `promotions.bundles`, index-matched to this array.
// ============================================================

export type SeedBundle = {
  slug: string;
  productSlugs: string[];
  priceRM: string;
  wasRM: string;
  saveRM: string;
  graphic: string;
};

// ============================================================
// News / Journal — real posts from the brand Instagram
// (@merveilleuxskincare_sbn). Captions are summarised into a
// localised title + excerpt; each card links back to the real post.
// Trilingual copy is inline (en/zh/ms), one language per locale.
// ============================================================

export const instagramHandle = "merveilleuxskincare_sbn";
export const instagramUrl =
  "https://www.instagram.com/merveilleuxskincare_sbn/";

export type SeedNews = {
  code: string; // Instagram shortcode
  type: "post" | "reel";
  permalink: string;
  image: string;
  date: string; // ISO date (real post date, decoded from the shortcode)
  category: { en: string; zh: string; ms: string };
  title: { en: string; zh: string; ms: string };
  excerpt: { en: string; zh: string; ms: string };
};

export const seedNews: SeedNews[] = [
  {
    code: "DWny58Lkg2t",
    type: "reel",
    permalink: "https://www.instagram.com/reel/DWny58Lkg2t/",
    image: "/products/silk-mask.png",
    date: "2026-04-02",
    category: {
      en: "New Launch",
      zh: "新品上市",
      ms: "Pelancaran Baharu",
    },
    title: {
      en: "The Silk Mask Collection",
      zh: "高端蚕丝面膜系列",
      ms: "Koleksi Silk Mask",
    },
    excerpt: {
      en: "It's not that you need a mask — you need the right one. Our high-end silk mask collection is built around moisture balance and barrier repair.",
      zh: "你缺的不是面膜，而是对的面膜。以专业皮肤管理理念为基础的高端蚕丝面膜系列，专注肌肤水分平衡与屏障修复。",
      ms: "Bukan anda perlukan mask — anda perlukan yang betul. Koleksi silk mask mewah kami direka untuk imbangan lembapan dan pembaikan penghalang kulit.",
    },
  },
  {
    code: "DS8U2VJEpLk",
    type: "reel",
    permalink: "https://www.instagram.com/reel/DS8U2VJEpLk/",
    image: "/renders/reception.jpg",
    date: "2025-12-31",
    category: { en: "Journal", zh: "品牌手记", ms: "Jurnal" },
    title: {
      en: "Welcome 2026",
      zh: "迎接 2026",
      ms: "Selamat Datang 2026",
    },
    excerpt: {
      en: "Let's welcome 2026 with healthy, glowing skin.",
      zh: "以健康透亮的肌肤，迎接 2026。",
      ms: "Mari sambut 2026 dengan kulit sihat dan berseri.",
    },
  },
  {
    code: "DRgkvAfktdO",
    type: "post",
    permalink: "https://www.instagram.com/p/DRgkvAfktdO/",
    image: "/products/micro-nano-mist.png",
    date: "2025-11-26",
    category: {
      en: "Product Spotlight",
      zh: "产品聚焦",
      ms: "Sorotan Produk",
    },
    title: {
      en: "Six powers, one bottle",
      zh: "一瓶多效：微纳米能量水的六大功效",
      ms: "Enam kuasa, satu botol",
    },
    excerpt: {
      en: "The Micro Nano Mist is more than a hydrating spray — it's all-round protection for your skin, with six standout benefits.",
      zh: "微纳米能量水不只是深层补水喷雾，更是全方位的肌肤守护者，蕴藏六大卓越功效。",
      ms: "Micro Nano Mist lebih daripada semburan lembapan — perlindungan menyeluruh dengan enam manfaat utama.",
    },
  },
  {
    code: "DRWLNHikh0V",
    type: "post",
    permalink: "https://www.instagram.com/p/DRWLNHikh0V/",
    image: "/renders/portraits.jpg",
    date: "2025-11-22",
    category: {
      en: "Before & After",
      zh: "真实见证",
      ms: "Sebelum & Selepas",
    },
    title: {
      en: "Calmer, more refined skin",
      zh: "告别敏感泛红，重现稳定肌",
      ms: "Kulit lebih tenang & halus",
    },
    excerpt: {
      en: "Sensitivity, redness, enlarged pores and unstable skin? See the visible change after using the Micro Nano Mist.",
      zh: "困扰于敏感、泛红、毛孔粗大与肌肤不稳定？用了微纳米能量水，带来肉眼可见的改变。",
      ms: "Sensitif, kemerahan, liang besar dan kulit tidak stabil? Lihat perubahan ketara selepas Micro Nano Mist.",
    },
  },
  {
    code: "DQiN8NIEnv1",
    type: "post",
    permalink: "https://www.instagram.com/p/DQiN8NIEnv1/",
    image: "/products/pore-refining-serum.png",
    date: "2025-11-02",
    category: {
      en: "Before & After",
      zh: "真实见证",
      ms: "Sebelum & Selepas",
    },
    title: {
      en: "7 days to a smoother forehead",
      zh: "7 天奇迹：告别痘痕",
      ms: "7 hari ke dahi lebih licin",
    },
    excerpt: {
      en: "In just seven days, inflammation and acne marks on the forehead visibly improved — smoother, clearer, more even skin.",
      zh: "短短 7 天，额头上的炎症与痘痕显著改善，肌肤变得更加平滑、清透。",
      ms: "Dalam tujuh hari, keradangan dan parut jerawat di dahi bertambah baik dengan ketara — lebih licin dan sekata.",
    },
  },
  {
    code: "DQeOR4NkooI",
    type: "post",
    permalink: "https://www.instagram.com/p/DQeOR4NkooI/",
    image: "/products/cell-repair-powder.png",
    date: "2025-10-31",
    category: { en: "Skin Science", zh: "肌肤科学", ms: "Sains Kulit" },
    title: {
      en: "Rebuilding the skin barrier",
      zh: "深度修复，重建屏障根基",
      ms: "Membina semula penghalang kulit",
    },
    excerpt: {
      en: "Our Intensive Restoration Powder uses a medical-grade micro-peptide system to repair damaged cells at the source.",
      zh: "深度修复系列采用医学级小分子活性肽修复系统，以微米级渗透技术精准修复受损细胞。",
      ms: "Intensive Restoration Powder kami menggunakan sistem mikro-peptida gred perubatan untuk membaiki sel rosak dari punca.",
    },
  },
  {
    code: "DQI87sKEqe4",
    type: "post",
    permalink: "https://www.instagram.com/p/DQI87sKEqe4/",
    image: "/products/hydro-sensi-concentre.png",
    date: "2025-10-23",
    category: { en: "Testimonial", zh: "肌肤见证", ms: "Testimoni" },
    title: {
      en: "A real skin transformation",
      zh: "肌肤转变见证",
      ms: "Transformasi kulit sebenar",
    },
    excerpt: {
      en: "Sensitive, red, congested skin? The Intensive Restoration Serum is designed to repair damaged cells and restore healthy skin.",
      zh: "敏感、泛红、阻塞？专为敏感堵塞设计的修复精华，深层修复受损细胞，重返健康肌。",
      ms: "Kulit sensitif, merah, tersumbat? Serum ini direka untuk membaiki sel rosak dan memulihkan kulit sihat.",
    },
  },
  {
    code: "DQGLwCfEqDZ",
    type: "post",
    permalink: "https://www.instagram.com/p/DQGLwCfEqDZ/",
    image: "/renders/atelier.jpg",
    date: "2025-10-22",
    category: { en: "Journal", zh: "品牌手记", ms: "Jurnal" },
    title: {
      en: "Perfect is healthy skin",
      zh: "完美，是肌肤的健康状态",
      ms: "Sempurna ialah kulit sihat",
    },
    excerpt: {
      en: "True beauty embraces your skin's real texture and glow. We're devoted to restoring skin to health and vitality.",
      zh: "真正的美，是能够拥抱肌肤真实的纹理与光泽。我们致力于让你的肌肤恢复健康与活力。",
      ms: "Kecantikan sejati memeluk tekstur dan seri sebenar kulit anda. Kami komited memulihkan kulit kepada kesihatan dan vitaliti.",
    },
  },
];

export const seedBundles: SeedBundle[] = [
  {
    slug: "brightening-ritual",
    productSlugs: ["oxy-bright-serum", "youth-ha-moisturiser", "uv-shield-spf35"],
    priceRM: "RM559",
    wasRM: "RM654",
    saveRM: "RM95",
    graphic: "/products/oxy-bright-serum.png",
  },
  {
    slug: "hydration-ritual",
    productSlugs: [
      "hydro-moist-serum",
      "hyaluronate-moisturiser",
      "aqua-concentrate-mask",
    ],
    priceRM: "RM439",
    wasRM: "RM514",
    saveRM: "RM75",
    graphic: "/products/hydro-moist-serum.png",
  },
  {
    slug: "anti-aging-ritual",
    productSlugs: [
      "antioxidant-serum",
      "antioxidant-cream",
      "eye-treatment-creme",
    ],
    priceRM: "RM639",
    wasRM: "RM744",
    saveRM: "RM105",
    graphic: "/products/antioxidant-serum.png",
  },
];
