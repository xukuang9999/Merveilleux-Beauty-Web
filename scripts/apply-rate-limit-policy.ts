import "../src/db/load-env";
import { readFileSync } from "node:fs";
import postgres from "postgres";

async function main() {
  const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required for database policy updates.");
  const connection = postgres(url, { prepare: false, max: 1, connect_timeout: 10, onnotice: () => {} });
  try {
    await connection.unsafe(readFileSync("src/db/migrations/20261004_rate_limit_buckets.sql", "utf8"));
    console.log("Shared rate-limit storage installed with backend-only access.");
  } finally {
    await connection.end();
  }
}

main().catch(() => {
  console.error("Could not apply the rate-limit storage policy. Check the database connection and owner permissions.");
  process.exitCode = 1;
});
