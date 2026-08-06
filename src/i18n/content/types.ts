// Content translation overlays. Keyed by stable identifiers so the data-access
// layer can merge the right language onto the canonical (English) DB content.
export type ProductT = {
  name?: string; // localized product name (e.g. Chinese); omit to keep the canonical English name
  type: string;
  tagline: string;
  description: string;
  keyIngredients: string[];
  benefits: string[];
  // Optional: omit to fall back to the canonical English value.
  contents?: string[]; // what's in a set / bundle, one line per item
  howToUse?: string[]; // application steps, one line per step
};
export type TestimonialT = { quote: string; role: string };
export type FaqT = { category: string; question: string; answer: string };
export type ModuleT = { title: string; summary: string; lessons: string[] };
export type KbT = { title: string; category: string; excerpt: string; body: string };

export type ContentPack = {
  products: Record<string, ProductT>; // by slug
  testimonials: Record<string, TestimonialT>; // by name
  faqs: Record<number, FaqT>; // by 0-based position in sorted list
  modules: Record<number, ModuleT>; // by module `ord`
  kb: Record<string, KbT>; // by slug
};

export const emptyPack: ContentPack = {
  products: {},
  testimonials: {},
  faqs: {},
  modules: {},
  kb: {},
};
