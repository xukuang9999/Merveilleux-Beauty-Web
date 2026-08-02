import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Postgres connection string:
// - DATABASE_URL when configured — Supabase (prod) or local Postgres (dev).
// - When unset, we point at an unreachable local address so queries REJECT
//   quickly instead of hanging. Public content then falls back to the curated
//   seed (see src/lib/content.ts) and the app never hard-crashes on boot.
//   Accounts / training / admin stay inert until a DB is configured.
const connectionString = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as {
  __pg?: ReturnType<typeof postgres>;
};

function makeClient() {
  return postgres(connectionString ?? "postgres://nodb@127.0.0.1:1/nodb", {
    // Required for Supabase's transaction-mode pooler (PgBouncer, port 6543):
    // it doesn't support prepared statements. Harmless on a direct/local conn.
    prepare: false,
    // Fail FAST on an unreachable/misconfigured DB. Our reads are wrapped in
    // try/catch and fall back to the curated seed — but a try/catch only catches
    // an *error*, not a *hang*. A short connect timeout (well under Next's 60s
    // per-page static-generation limit, even across retries) turns a stalled
    // connection into a prompt rejection, so a DB blip can never hang the build.
    connect_timeout: connectionString ? 8 : 2,
    // Belt-and-braces: also bound query execution server-side.
    connection: { statement_timeout: 8000 },
    // Release idle connections promptly — friendly to the shared pooler and to
    // serverless instances that come and go.
    idle_timeout: 20,
    // postgres-js prints connection notices to stderr by default; silence them.
    onnotice: () => {},
  });
}

// Reuse the client across HMR reloads in dev; a fresh one per cold start in prod.
const client = globalForDb.__pg ?? makeClient();
if (process.env.NODE_ENV !== "production") globalForDb.__pg = client;

export const db = drizzle(client, { schema });
export { schema };

/** True when a real Postgres connection is configured (vs the no-DB fallback). */
export const hasRemoteDb = Boolean(connectionString);
