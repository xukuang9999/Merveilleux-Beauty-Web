import { NextRequest } from "next/server";
import { getAnthropic, buildSystem, MODEL, type ChatMode } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

type IncomingMessage = { role: "user" | "assistant"; content: string };

const MODES: ChatMode[] = ["customer", "consult", "training"];

export async function POST(req: NextRequest) {
  let body: { mode?: string; messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const mode: ChatMode = MODES.includes(body.mode as ChatMode)
    ? (body.mode as ChatMode)
    : "customer";

  // Training coach is for distributors/admin only.
  if (mode === "training") {
    const user = await getCurrentUser();
    if (!user || (user.role !== "distributor" && user.role !== "admin")) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const anthropic = getAnthropic();
  if (!anthropic) {
    const msg =
      "✨ Our AI advisor isn't switched on yet — the site owner just needs to add an ANTHROPIC_API_KEY. In the meantime, please reach us via the Contact page or WhatsApp and a real person will help you right away.";
    return new Response(msg, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const system = await buildSystem(mode);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const run = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 900,
          system,
          messages,
        });
        run.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await run.finalMessage();
      } catch {
        controller.enqueue(
          encoder.encode(
            "\n\n(Sorry — I had trouble responding just now. Please try again, or contact us on WhatsApp.)",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
