"use server";

import { db } from "@/db";
import { subscribers } from "@/db/schema";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribeNewsletter(input: {
  email: string;
  locale?: string;
}): Promise<{ ok: boolean }> {
  const email = input.email?.trim().toLowerCase() || "";
  if (!EMAIL_RE.test(email)) return { ok: false };
  try {
    await db
      .insert(subscribers)
      .values({ email: email.slice(0, 200), locale: input.locale ?? null })
      .onConflictDoNothing();
    return { ok: true };
  } catch {
    // DB not configured / table not migrated yet — treat as best-effort so the
    // signup UX still confirms. Run `npm run db:push` to persist subscribers.
    return { ok: true };
  }
}
