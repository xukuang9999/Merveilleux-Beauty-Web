import Anthropic from "@anthropic-ai/sdk";
import { getProducts, getFaqs } from "./content";
import { getKbArticles } from "./kb";

export type ChatMode = "customer" | "consult" | "training";

// Model used for all AI calls (customer service, consult, training coach).
export const MODEL = "claude-sonnet-4-6";

export function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

async function productContext(): Promise<string> {
  const ps = await getProducts();
  return ps
    .map(
      (p) =>
        `- ${p.name} — ${p.type} (${p.priceRM}). "${p.tagline}". ${p.description} Key ingredients: ${p.keyIngredients.join(", ")}. Benefits: ${p.benefits.join(", ")}.`,
    )
    .join("\n");
}

async function faqContext(): Promise<string> {
  const fs = await getFaqs();
  return fs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
}

async function kbContext(): Promise<string> {
  const ks = await getKbArticles();
  return ks.map((k) => `### ${k.title} (${k.category})\n${k.body}`).join("\n\n");
}

const PERSONA =
  "You are Margaux, the warm, elegant AI beauty advisor for Merveilleux Beauty — an OEM French-style skincare brand serving Malaysia and SEA. Always reply in the SAME language the user writes in (English, Bahasa Melayu, or Chinese 中文). Keep replies concise, friendly and on-brand. Recommend ONLY products from the Merveilleux range provided. Never make medical or disease-treatment claims; for skin conditions, gently advise seeing a professional and always recommend a 24-hour patch test for new products. If you are unsure, say so honestly.";

export async function buildSystem(mode: ChatMode): Promise<string> {
  const products = await productContext();

  if (mode === "training") {
    const kb = await kbContext();
    return (
      PERSONA +
      "\n\nROLE: You are now the AI TRAINING COACH for Merveilleux 经销商 (distributors). Help them learn and apply: company culture, distributor policy, product knowledge, SOP, sales scripts and social-media SOP. Coach them, quiz them when asked, and give practical sales guidance and objection-handling grounded in the materials below. For orders/pricing, point them to official channels." +
      `\n\n=== PRODUCT CATALOG ===\n${products}\n\n=== KNOWLEDGE BASE ===\n${kb}`
    );
  }

  if (mode === "consult") {
    const kb = await kbContext();
    return (
      PERSONA +
      "\n\nROLE: You are now the AI SKINCARE CONSULTANT. Ask brief clarifying questions about skin type, concerns and goals if needed, then recommend a tailored routine using ONLY the Merveilleux range, in the correct order (Cleanse → Essence Toner → Serum → Eye → Cream → SPF in the morning). Briefly explain why each step helps, set realistic timelines, and remind them to patch-test." +
      `\n\n=== PRODUCT CATALOG ===\n${products}\n\n=== KNOWLEDGE BASE ===\n${kb}`
    );
  }

  // customer (public)
  const faqs = await faqContext();
  return (
    PERSONA +
    "\n\nROLE: You are the website's customer-service advisor. Help visitors with product questions, simple skincare routines, and how to become a 经销商 (distributor). For orders, exact pricing confirmation, or distributor sign-up, encourage them to register an account, use the Contact page, or message on WhatsApp." +
    `\n\n=== PRODUCT CATALOG ===\n${products}\n\n=== FAQ ===\n${faqs}`
  );
}
