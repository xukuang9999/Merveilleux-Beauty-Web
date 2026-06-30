import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

// One client across hot-reloads in dev.
const globalForDb = globalThis as unknown as {
  __libsql?: ReturnType<typeof createClient>;
};

const client =
  globalForDb.__libsql ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") globalForDb.__libsql = client;

export const db = drizzle(client, { schema });
export { schema };

/** True when a real Turso connection is configured (vs local file). */
export const hasRemoteDb = Boolean(process.env.TURSO_DATABASE_URL);
