"use server";

import { db } from "@/db";
import { enquiries } from "@/db/schema";

export type EnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const INTERESTS = [
  "Become a Distributor",
  "Product enquiry",
  "Wholesale / B2B",
  "Other",
];

export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{ ok: boolean }> {
  // Reject before connecting when persistence is unavailable.
  if (!process.env.DATABASE_URL?.trim()) return { ok: false };
  // Validation
  if (!input.name?.trim() || !input.message?.trim()) return { ok: false };
  if (!EMAIL_RE.test(input.email?.trim() || "")) return { ok: false };
  const interest = INTERESTS.includes(input.interest) ? input.interest : "Other";
  try {
    await db.insert(enquiries).values({
      name: input.name.trim().slice(0, 200),
      email: input.email.trim().slice(0, 200),
      phone: input.phone?.trim().slice(0, 60) || null,
      interest,
      message: input.message.trim().slice(0, 4000),
    });
    return { ok: true };
  } catch {
    // The client offers a direct WhatsApp handoff when persistence fails.
    return { ok: false };
  }
}
