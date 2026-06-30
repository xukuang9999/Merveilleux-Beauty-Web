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

export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{ ok: boolean }> {
  // Basic validation
  if (!input.name?.trim() || !input.email?.trim() || !input.message?.trim()) {
    return { ok: false };
  }
  try {
    await db.insert(enquiries).values({
      name: input.name.trim().slice(0, 200),
      email: input.email.trim().slice(0, 200),
      phone: input.phone?.trim().slice(0, 60) || null,
      interest: input.interest.slice(0, 80),
      message: input.message.trim().slice(0, 4000),
    });
    return { ok: true };
  } catch {
    // DB not configured (e.g. before Turso) — the WhatsApp handoff still works.
    return { ok: false };
  }
}
