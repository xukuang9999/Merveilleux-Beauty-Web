// ============================================================
// Curated seed content for Merveilleux Beauty.
// Source of truth for DB seeding AND the public-page fallback
// (used when the database isn't reachable). No DB imports here.
//
// NOTE: the "Merveilleux Beauty" brand has no first-party catalogue
// online; this is curated, brand-appropriate content for an OEM
// French-style line tuned for the Malaysian / SEA climate.
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

export const seedProducts: SeedProduct[] = [
  {
    slug: "radiance-serum",
    name: "Radiance Serum",
    type: "Brightening Vitamin C Concentrate",
    tagline: "A weightless drop of luminosity",
    description:
      "A stabilised vitamin-C and niacinamide concentrate that targets the dullness, dark spots and post-acne marks tropical skin knows best. Ferulic acid backs up the antioxidant defence against sun and pollution, while a low-molecular hyaluronic complex keeps the finish dewy, never sticky.",
    keyIngredients: [
      "10% Stabilised Vitamin C",
      "Ferulic Acid",
      "Niacinamide",
      "Hyaluronic Acid",
    ],
    benefits: [
      "Brightens & evens skin tone",
      "Fades dark spots & post-acne marks",
      "Antioxidant defence against UV & pollution",
      "Lightweight, layers under SPF",
    ],
    priceRM: "RM168",
    graphic: "/graphics/product-radiance-serum.svg",
    sortOrder: 1,
  },
  {
    slug: "hydra-essence-serum",
    name: "Hydra Essence Serum",
    type: "Hyaluronic + B5 Plumping Serum",
    tagline: "Bouncy, quenched, all day",
    description:
      "Three molecular weights of hyaluronic acid drench skin at every depth while polyglutamic acid seals it in and panthenol (B5) calms a stressed barrier. Built for air-conditioning and humidity alike, it delivers the plumped, glass-skin hydration that holds from morning to night.",
    keyIngredients: [
      "Multi-weight Hyaluronic Acid",
      "Polyglutamic Acid",
      "Panthenol (Vitamin B5)",
    ],
    benefits: [
      "Deep, layered hydration that lasts",
      "Plumps fine dehydration lines",
      "Reinforces the moisture barrier",
      "Dewy glass-skin finish",
    ],
    priceRM: "RM148",
    graphic: "/graphics/product-hydra-essence-serum.svg",
    sortOrder: 2,
  },
  {
    slug: "velvet-cream",
    name: "Velvet Cream",
    type: "Ceramide Barrier Moisturiser",
    tagline: "Cushioned comfort, all day",
    description:
      "A breathable French-style cream built on a ceramide complex (NP/AP/EOP), squalane and Centella Asiatica that rebuilds the skin barrier and soothes redness without the heavy, sweaty finish hot weather punishes. Rich enough for night, light enough for humid days.",
    keyIngredients: [
      "Ceramides (NP/AP/EOP)",
      "Squalane",
      "Centella Asiatica",
      "Shea Butter",
    ],
    benefits: [
      "Repairs the moisture barrier",
      "Soothes redness & sensitivity",
      "24-hour hydration",
      "Non-greasy, climate-friendly finish",
    ],
    priceRM: "RM158",
    graphic: "/graphics/product-velvet-cream.svg",
    sortOrder: 3,
  },
  {
    slug: "pure-cleanser",
    name: "Pure Cleanser",
    type: "Gentle Amino-Acid Cleanser",
    tagline: "A clean slate, never stripped",
    description:
      "A pH-balanced amino-acid gel that dissolves makeup, sunscreen and city grime without stripping the barrier. French chamomile and panthenol keep skin calm and supple, making it a daily fit for sensitive and combination skin in humid climates.",
    keyIngredients: [
      "Amino-Acid Surfactants",
      "French Chamomile",
      "Panthenol (B5)",
      "Glycerin",
    ],
    benefits: [
      "Deep yet gentle clean",
      "Removes makeup, oil & SPF",
      "Calms & maintains pH balance",
      "Non-stripping, no tightness",
    ],
    priceRM: "RM89",
    graphic: "/graphics/product-pure-cleanser.svg",
    sortOrder: 4,
  },
  {
    slug: "essence-toner",
    name: "Essence Toner",
    type: "Hydrating Essence Toner",
    tagline: "The first step to glass skin",
    description:
      "A weightless watery essence-toner that floods skin with thermal-style spring water, low-weight hyaluronic acid and 2% niacinamide the moment cleansing ends. Preps and boosts the absorption of everything that follows, refining the look of pores and evening tone over time.",
    keyIngredients: [
      "Spring / Thermal Water",
      "Low-weight Hyaluronic Acid",
      "Niacinamide 2%",
      "Betaine",
    ],
    benefits: [
      "Instant multi-depth hydration",
      "Preps skin for serum & cream",
      "Refines the look of pores",
      "Evens tone with use",
    ],
    priceRM: "RM98",
    graphic: "/graphics/product-essence-toner.svg",
    sortOrder: 5,
  },
  {
    slug: "sun-shield-spf50",
    name: "Sun Shield SPF50+",
    type: "Invisible Daily Sun Serum PA++++",
    tagline: "Protection you'll actually reapply",
    description:
      "A skincare-first sun serum: broad-spectrum SPF50+ PA++++ that melts in invisibly with zero white cast — essential for medium-to-deep skin tones — and no greasy film. Niacinamide and hyaluronic acid work underneath, so daily protection doubles as a hydrating, brightening step.",
    keyIngredients: [
      "Hybrid UV Filters (SPF50+ PA++++)",
      "Niacinamide",
      "Hyaluronic Acid",
      "Centella Asiatica",
    ],
    benefits: [
      "Broad-spectrum SPF50+ PA++++",
      "No white cast, no greasy film",
      "Lightweight serum texture",
      "Hydrates & brightens while it protects",
    ],
    priceRM: "RM118",
    graphic: "/graphics/product-sun-shield-spf50.svg",
    sortOrder: 6,
  },
  {
    slug: "eye-revive-cream",
    name: "Eye Revive Cream",
    type: "Brightening Eye Treatment",
    tagline: "Brighter, smoother, wide awake",
    description:
      "A cooling, fast-absorbing eye cream that targets the three concerns shoppers ask for most — puffiness, dark circles and fine lines. Caffeine de-puffs, peptides and niacinamide brighten and smooth, and hyaluronic acid keeps the delicate eye area cushioned.",
    keyIngredients: [
      "Caffeine",
      "Peptides (Matrixyl-type)",
      "Niacinamide",
      "Hyaluronic Acid",
    ],
    benefits: [
      "De-puffs & reduces eye-bag look",
      "Brightens dark circles",
      "Smooths fine lines & crow's feet",
      "Cooling, fast-absorbing",
    ],
    priceRM: "RM138",
    graphic: "/graphics/product-eye-revive-cream.svg",
    sortOrder: 7,
  },
  {
    slug: "hydra-bomb-mask",
    name: "Hydra Bomb Mask",
    type: "Hydrating Sheet Mask · Box of 5",
    tagline: "A 15-minute hydration reset",
    description:
      "A drenched biocellulose sheet that delivers an intense hydration surge in 15 minutes — the pre-event, post-sun, tired-skin rescue. Hyaluronic acid, spring water, panthenol and allantoin calm and quench for an instant glow.",
    keyIngredients: [
      "Hyaluronic Acid",
      "Spring / Thermal Water",
      "Panthenol",
      "Allantoin",
    ],
    benefits: [
      "Intense 15-minute hydration surge",
      "Calms post-sun & post-flight skin",
      "Instant pre-event glow",
      "Soothing biocellulose sheet",
    ],
    priceRM: "RM98 / box of 5",
    graphic: "/graphics/product-hydra-bomb-mask.svg",
    sortOrder: 8,
  },
];

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
      "My skin has never looked this even. Three weeks with the Radiance Serum and my dark spots are visibly lighter. Customers ask me what I'm using every week.",
    name: "Aisyah R.",
    role: "经销商 · Kuala Lumpur",
    rating: 5,
    sortOrder: 1,
  },
  {
    quote:
      "The Velvet Cream is the first moisturiser that calmed my eczema-prone skin. The OEM quality genuinely rivals the luxury brands I used to pay triple for.",
    name: "Mei Ling T.",
    role: "Customer · Penang",
    rating: 5,
    sortOrder: 2,
  },
  {
    quote:
      "As a distributor, the brand trust this website builds makes selling effortless. Clients see the products are real, French-grade, and beautifully made.",
    name: "Nurul H.",
    role: "经销商 · Johor Bahru",
    rating: 5,
    sortOrder: 3,
  },
  {
    quote:
      "Glass skin is real. The Essence Toner plus serum routine gave me the dewy finish I'd only seen in adverts. I've repurchased four times.",
    name: "Priya S.",
    role: "Customer · Selangor",
    rating: 5,
    sortOrder: 4,
  },
  {
    quote:
      "Sun Shield is the only SPF50 my customers with deeper skin tones will wear daily — truly no white cast. It sells itself once they try a sample.",
    name: "Farah K.",
    role: "经销商 · Shah Alam",
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
    question: "What does OEM French beauty actually mean?",
    answer:
      "Our formulas are developed and manufactured to French cosmetic standards by established OEM laboratories, then released under the Merveilleux Beauty name. You get luxury-grade formulation without the luxury-brand markup.",
    sortOrder: 1,
  },
  {
    category: "Products",
    question: "Are the products suitable for sensitive skin?",
    answer:
      "Yes. Our cleanser, essence and cream are pH-balanced and fragrance-considerate, formulated with soothing actives like Centella Asiatica and Allantoin. We always recommend a 24-hour patch test before first use.",
    sortOrder: 2,
  },
  {
    category: "Skincare",
    question: "In what order should I apply the products?",
    answer:
      "Cleanse → Essence Toner → Serum (Radiance or Hydra Essence) → Eye Revive → Velvet Cream. In the morning finish with Sun Shield SPF50+. At night, the cream seals everything in.",
    sortOrder: 3,
  },
  {
    category: "Skincare",
    question: "How long until I see results?",
    answer:
      "Hydration and texture improvements are often visible within days. Tone and dark-spot results from the Radiance Serum typically appear over 4–8 weeks of consistent use.",
    sortOrder: 4,
  },
  {
    category: "Distributor",
    question: "How do I become a Merveilleux 经销商?",
    answer:
      "Register an account and send us an enquiry, or message us on WhatsApp. Approved distributors complete our online training programme (6 modules) and an in-person session before they begin selling.",
    sortOrder: 5,
  },
  {
    category: "Distributor",
    question: "Is there training and support for distributors?",
    answer:
      "Absolutely. Every 经销商 gets access to our structured training portal, an ongoing skincare knowledge base, and an AI assistant for product guidance and skincare consultations — plus human team support.",
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
    summary: "Brand story, vision, mission and the values behind Merveilleux.",
    lessons: [
      "Our origin & brand story",
      "Vision, mission & values",
      "What 'Merveilleux' stands for",
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
          "French cosmetic standards (OEM)",
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
    title: "经销商 Policy",
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
        question: "Before selling, a new 经销商 must…",
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
    summary: "OEM formulations, ingredients, benefits and usage routines.",
    lessons: [
      "The product range in depth",
      "Key ingredients & benefits",
      "Building a routine for customers",
    ],
    durationMins: 40,
    quiz: [
      {
        question: "Which product is the brightening vitamin C concentrate?",
        options: [
          "Velvet Cream",
          "Radiance Serum",
          "Pure Cleanser",
          "Hydra Bomb Mask",
        ],
        answerIndex: 1,
      },
      {
        question: "What is the correct routine order?",
        options: [
          "Cream → Serum → Cleanser",
          "Cleanse → Essence → Serum → Cream",
          "Serum → Cleanse → Essence",
          "Mask → Cleanse → Toner",
        ],
        answerIndex: 1,
      },
      {
        question: "Velvet Cream repairs the barrier mainly with…",
        options: ["Alcohol", "Ceramides & squalane", "Fragrance", "Clay"],
        answerIndex: 1,
      },
      {
        question: "Sun Shield SPF50+ is notable because it…",
        options: [
          "Leaves a heavy white cast",
          "Has no white cast and a light serum texture",
          "Replaces moisturiser entirely",
          "Is only for night use",
        ],
        answerIndex: 1,
      },
      {
        question: "Which finishes a morning routine?",
        options: ["Sun Shield SPF50+", "Hydra Bomb Mask", "Pure Cleanser", "Nothing"],
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
      "A 3-step routine for uneven tone and stubborn post-acne marks in tropical skin.",
    body: "**Concern:** Uneven tone, sun-induced dark spots and lingering post-acne marks — extremely common in our climate.\n\n**Why it happens:** UV exposure and inflammation (e.g. after acne) trigger excess melanin. Without daily SPF, marks fade slowly and new ones form.\n\n**Recommended routine:**\n1. **Pure Cleanser** morning & night.\n2. **Radiance Serum** (vitamin C + niacinamide) every morning on clean skin.\n3. **Velvet Cream** to lock in.\n4. **Sun Shield SPF50+** every single morning — non-negotiable for fading marks.\n\n**Timeline:** Expect visible evening of tone in 4–8 weeks with consistent SPF. Set this expectation with customers up front.\n\n**Pro tip:** The number-one reason brightening 'doesn't work' is skipping sunscreen. Sell the serum and the SPF together.",
    tags: ["pigmentation", "vitamin c", "spf", "post-acne"],
    sortOrder: 1,
  },
  {
    slug: "dehydrated-vs-dry-skin",
    title: "Dehydrated vs dry skin — and how to fix each",
    category: "Skincare Cases",
    excerpt:
      "They feel similar but need different solutions. Here's how to tell them apart.",
    body: "**Dehydrated skin** lacks *water*. It can look dull, feel tight, and show fine 'crepey' lines — even on oily skin. **Dry skin** lacks *oil* (lipids); it flakes and feels rough.\n\n**For dehydration:** layer water-based hydration. **Essence Toner** → **Hydra Essence Serum** (multi-weight hyaluronic + polyglutamic acid) → seal with **Velvet Cream**.\n\n**For dryness:** prioritise barrier lipids — **Velvet Cream** (ceramides + squalane), and avoid over-cleansing.\n\n**Both at once?** Very common in air-conditioned offices. Use the full hydration layering plus the cream.\n\n**Counter-intuitive tip:** oily, breakout-prone skin is often *dehydrated*. Don't strip it — hydrate it, and oil production usually calms down.",
    tags: ["hydration", "dry skin", "hyaluronic acid", "barrier"],
    sortOrder: 2,
  },
  {
    slug: "sensitive-skin-redness",
    title: "Calming sensitive, reactive skin",
    category: "Skincare Cases",
    excerpt: "A gentle, barrier-first approach for redness and reactivity.",
    body: "**Concern:** Stinging, redness, reacting to many products.\n\n**Principle:** Less is more. Repair the barrier first, introduce actives slowly.\n\n**Routine:**\n1. **Pure Cleanser** (amino-acid, French chamomile) — never strip.\n2. **Velvet Cream** with Centella Asiatica to soothe and rebuild.\n3. **Sun Shield SPF50+** — sensitive skin burns and reacts faster.\n\n**Hold off on:** strong vitamin C or exfoliating acids until the barrier is calm. Introduce Radiance Serum every other day once stable.\n\n**Always:** patch-test new products for 24 hours behind the ear or on the inner arm.",
    tags: ["sensitive", "redness", "centella", "barrier"],
    sortOrder: 3,
  },
  {
    slug: "ingredient-niacinamide",
    title: "Ingredient guide: Niacinamide",
    category: "Ingredient Glossary",
    excerpt: "The multitasker in Radiance Serum, Essence Toner and Sun Shield.",
    body: "**What it is:** Vitamin B3, one of the best-studied skincare actives.\n\n**What it does:** regulates oil, strengthens the barrier, visibly brightens tone, and calms redness. Well-tolerated by most skin types.\n\n**In our range:** featured in **Radiance Serum**, **Essence Toner** (2%) and **Sun Shield SPF50+**.\n\n**Pairs well with:** hyaluronic acid, vitamin C, SPF.\n\n**Talking point for customers:** 'a gentle all-rounder that brightens and balances without irritation.'",
    tags: ["niacinamide", "ingredients", "oil control", "brightening"],
    sortOrder: 4,
  },
  {
    slug: "ingredient-hyaluronic-acid",
    title: "Ingredient guide: Hyaluronic acid",
    category: "Ingredient Glossary",
    excerpt: "Why molecular weight matters for real hydration.",
    body: "**What it is:** a humectant that binds water to skin.\n\n**Molecular weight matters:** high-weight HA hydrates the surface; low-weight HA reaches deeper layers. **Hydra Essence Serum** uses *multiple* weights for hydration at every depth, plus polyglutamic acid to lock it in.\n\n**Use tip:** apply to slightly damp skin, then seal with **Velvet Cream** so the water doesn't evaporate in dry, air-conditioned air.\n\n**Myth-buster:** in very dry environments, HA alone can feel tight — that's why sealing with a cream matters.",
    tags: ["hyaluronic acid", "hydration", "ingredients"],
    sortOrder: 5,
  },
  {
    slug: "spf-the-most-important-step",
    title: "Why SPF is the most important step",
    category: "Customer FAQ",
    excerpt: "The single biggest lever for tone, ageing and protecting results.",
    body: "**Short version:** sunscreen protects every other result you've paid for.\n\n**Why daily, even indoors:** UVA passes through windows and contributes to pigmentation and ageing. In our climate, UV is high year-round.\n\n**Our pick:** **Sun Shield SPF50+ PA++++** — a serum-light texture with no white cast (great for medium-to-deep tones), so customers actually reapply.\n\n**How much:** about two finger-lengths for the face and neck; reapply through the day when outdoors.\n\n**Sales angle:** pair SPF with any brightening purchase — without it, brightening results stall.",
    tags: ["spf", "sun protection", "faq"],
    sortOrder: 6,
  },
  {
    slug: "building-a-routine",
    title: "How to build a simple, effective routine",
    category: "Product Usage Guide",
    excerpt: "The correct order, AM and PM, using the Merveilleux range.",
    body: "**Order = thinnest to thickest, then SPF last in the morning.**\n\n**Morning:**\n1. Pure Cleanser\n2. Essence Toner\n3. Radiance Serum\n4. Eye Revive Cream\n5. Velvet Cream\n6. Sun Shield SPF50+\n\n**Night:**\n1. Pure Cleanser\n2. Essence Toner\n3. Hydra Essence Serum\n4. Eye Revive Cream\n5. Velvet Cream\n\n**Weekly:** Hydra Bomb Mask 1–2× for a hydration boost.\n\n**Keep it realistic:** a routine the customer will actually follow beats a perfect one they abandon. Start with cleanse + serum + cream + SPF, then build.",
    tags: ["routine", "usage", "how-to"],
    sortOrder: 7,
  },
  {
    slug: "oily-acne-prone-tropical",
    title: "Case: Oily, breakout-prone skin in humidity",
    category: "Skincare Cases",
    excerpt: "Control shine and breakouts without stripping the barrier.",
    body: "**Concern:** Midday shine, congestion and breakouts in hot, humid weather.\n\n**Key insight:** stripping oily skin makes it produce *more* oil. Hydrate and balance instead.\n\n**Routine:**\n1. **Pure Cleanser** AM & PM (don't over-wash).\n2. **Essence Toner** with niacinamide to balance oil.\n3. **Hydra Essence Serum** for oil-free hydration.\n4. A light layer of **Velvet Cream**.\n5. **Sun Shield SPF50+** (non-greasy, won't clog).\n\n**Add:** Radiance Serum in the morning to fade post-acne marks.\n\n**Tell customers:** consistency beats harsh scrubbing. Expect calmer skin over a few weeks.",
    tags: ["oily skin", "acne", "niacinamide", "humidity"],
    sortOrder: 8,
  },
];

export const PASS_MARK = 70;
