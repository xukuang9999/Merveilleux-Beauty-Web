import type { ChatMode } from "./ai";

export const MAX_CHAT_BODY_BYTES = 64 * 1024;
export const MAX_CHAT_MESSAGES = 12;
export const MAX_CHAT_CONTENT_LENGTH = 4000;
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatPayload = { mode: ChatMode; messages: ChatMessage[] };

export class ChatPayloadError extends Error {
  constructor(public status: 400 | 413) {
    super("Invalid chat payload.");
  }
}

/** Limit the stream before parsing JSON; slicing after req.json() is too late. */
export async function readChatPayload(req: Request): Promise<ChatPayload> {
  if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new ChatPayloadError(400);
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_CHAT_BODY_BYTES) throw new ChatPayloadError(413);
  const reader = req.body?.getReader();
  if (!reader) throw new ChatPayloadError(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CHAT_BODY_BYTES) { await reader.cancel(); throw new ChatPayloadError(413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  let body: unknown;
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch { throw new ChatPayloadError(400); }
  return validateChatPayload(body);
}

export function validateChatPayload(body: unknown): ChatPayload {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ChatPayloadError(400);
  const value = body as Record<string, unknown>;
  if (!["customer", "consult", "training"].includes(value.mode as string)) throw new ChatPayloadError(400);
  if (!Array.isArray(value.messages) || value.messages.length < 1 || value.messages.length > MAX_CHAT_MESSAGES) throw new ChatPayloadError(400);
  const messages: ChatMessage[] = value.messages.map((raw: unknown) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new ChatPayloadError(400);
    const message = raw as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string" || !message.content.trim()) throw new ChatPayloadError(400);
    if (message.content.length > MAX_CHAT_CONTENT_LENGTH) throw new ChatPayloadError(413);
    return { role: message.role, content: message.content };
  });
  if (messages.at(-1)?.role !== "user") throw new ChatPayloadError(400);
  return { mode: value.mode as ChatMode, messages };
}
