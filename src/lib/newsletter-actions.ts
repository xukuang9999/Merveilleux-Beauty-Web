"use server";

import { db } from "@/db";
import { subscribers } from "@/db/schema";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribeNewsletter(input: {
  email: string;
  locale?: string;
}): Promise<{ ok: boolean }> {
  const email = input.email?.trim().toLowerCase() || "";
  if (!process.env.DATABASE_URL?.trim() || !EMAIL_RE.test(email) || email.length > 200) return { ok: false };
  try {
    await db
      .insert(subscribers)
      .values({ email: email.slice(0, 200), locale: input.locale ?? null })
      .onConflictDoNothing();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
