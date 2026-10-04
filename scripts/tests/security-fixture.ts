import postgres from "postgres";
import { readFileSync } from "node:fs";
import { hashPassword } from "../../src/lib/auth-core";

/** Local regression credentials only; these are unrelated to production accounts. */
export const FIXTURE_PASSWORDS: Record<string, string> = {
  "master@merveilleux.test": "MercAuditMaster!2026-10",
  "admin@merveilleux.test": "MercAuditAdmin!2026-10",
  "distributor@merveilleux.test": "MercAuditDistributor!2026-10",
  "customer@merveilleux.test": "MercAuditCustomer!2026-10",
};

export function fixtureDatabaseUrl(value = process.env.DATABASE_URL): string {
  if (!value) throw new Error("The isolated fixture DATABASE_URL is required.");
  const url = new URL(value);
  if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.port !== "55441" || url.pathname !== "/merc_audit" || url.username !== "merc_audit") {
    throw new Error("This helper only accepts the isolated Merc audit database on localhost:55441.");
  }
  return value;
}

async function main() {
  const connection = postgres(fixtureDatabaseUrl(), { prepare: false, max: 1 });
  try {
    await connection.unsafe(readFileSync("src/db/migrations/20261004_rate_limit_buckets.sql", "utf8"));
    await connection.begin(async (tx) => {
      for (const [email, password] of Object.entries(FIXTURE_PASSWORDS)) {
        const hash = await hashPassword(password);
        await tx`update users set password_hash=${hash} where email=${email}`;
      }
    });
    console.log("Isolated fixture only: limiter table installed; four demo password hashes rotated.");
  } finally { await connection.end(); }
}

if (process.argv[1]?.endsWith("security-fixture.ts")) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
