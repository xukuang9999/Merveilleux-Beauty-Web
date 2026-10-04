import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { getAnthropic, buildSystem, MODEL } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { isFeatureEnabled } from "@/lib/settings";
import { getLocale } from "@/i18n/server";
import { securityCopy } from "@/lib/security-copy";
import { readChatPayload, ChatPayloadError } from "@/lib/chat-request";
import { chatBuckets } from "@/lib/rate-limit-core";
import { consumeRateLimits } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;
const VISITOR_COOKIE = "mb_chat_visitor";

function errorResponse(message: string, status: number, retryAfterSeconds?: number) {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
    },
  });
}

export async function POST(req: NextRequest) {
  const copy = securityCopy(await getLocale());
  let payload;
  try {
    payload = await readChatPayload(req);
  } catch (error) {
    const status = error instanceof ChatPayloadError ? error.status : 400;
    return errorResponse(status === 413 ? copy.tooLarge : copy.badRequest, status);
  }
  const { mode, messages } = payload;
  if (mode === "customer" && !(await isFeatureEnabled("aiChat"))) return errorResponse(copy.chatUnavailable, 403);
  const user = await getCurrentUser();
  if ((mode === "consult" || mode === "training") && !user) return errorResponse(copy.unauthorized, 401);
  if (mode === "training" && user && !["distributor", "admin", "master_admin"].includes(user.role)) return errorResponse(copy.forbidden, 403);

  // An unconfigured advisor remains unavailable without touching quota storage.
  const anthropic = getAnthropic();
  if (!anthropic) return errorResponse(copy.chatUnavailable, 503);
  const jar = await cookies();
  const previousVisitor = jar.get(VISITOR_COOKIE)?.value;
  const visitor = previousVisitor && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(previousVisitor) ? previousVisitor : randomUUID();
  // Session/opaque visitor quota plus aggregate minute/hour/day spend caps.
  // Caller-controlled IP headers cannot create another quota bucket.
  const quota = await consumeRateLimits(chatBuckets(user ? `user:${user.id}` : `visitor:${visitor}`));
  if (!quota.available) return errorResponse(copy.chatUnavailable, 503, quota.retryAfterSeconds);
  if (!quota.allowed) return errorResponse(copy.limited, 429, quota.retryAfterSeconds);
  if (!user && visitor !== previousVisitor) jar.set(VISITOR_COOKIE, visitor, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 86_400 });

  let system;
  try { system = await buildSystem(mode); }
  catch { return errorResponse(copy.chatUnavailable, 503); }
  const encoder = new TextEncoder();
  let cancelled = false;
  let abort: (() => void) | undefined;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const run = anthropic.messages.stream({ model: MODEL, max_tokens: 900, system, messages }, { signal: req.signal });
        abort = () => run.abort();
        run.on("text", (text) => { if (!cancelled) controller.enqueue(encoder.encode(text)); });
        await run.finalMessage();
      } catch {
        if (!cancelled && !req.signal.aborted) controller.enqueue(encoder.encode(`\n\n(${copy.responseFailed})`));
      } finally { if (!cancelled) controller.close(); }
    },
    cancel() { cancelled = true; abort?.(); },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
