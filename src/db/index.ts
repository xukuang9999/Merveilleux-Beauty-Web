import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import * as schema from "./schema";

// Resolve the DB URL:
// - TURSO_DATABASE_URL when configured (dev or prod)
// - a local file in dev (writable)
// - in-memory in prod when no Turso is set, so the serverless runtime never
//   crashes on the read-only filesystem (content falls back to curated seed)
function resolveUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  // On Vercel's read-only serverless filesystem a file DB crashes; use
  // in-memory so the app stays up (content falls back to curated seed).
  // Accounts / training / admin stay inert until Turso is configured.
  if (process.env.VERCEL) {
    console.warn(
      "[merveilleux] No TURSO_DATABASE_URL set — using in-memory DB. " +
        "Public pages use seed fallback; accounts/training/admin are disabled until Turso is configured.",
    );
    return ":memory:";
  }
  return "file:./local.db";
}

const authToken = process.env.TURSO_AUTH_TOKEN;

const globalForDb = globalThis as unknown as { __libsql?: Client };

function makeClient(): Client {
  try {
    return createClient({ url: resolveUrl(), authToken });
  } catch {
    // Last-resort fallback so the app never hard-crashes at startup.
    return createClient({ url: ":memory:" });
  }
}

const client = globalForDb.__libsql ?? makeClient();
if (process.env.NODE_ENV !== "production") globalForDb.__libsql = client;

export const db = drizzle(client, { schema });
export { schema };

/** True when a real Turso connection is configured (vs local/in-memory). */
export const hasRemoteDb = Boolean(process.env.TURSO_DATABASE_URL);
