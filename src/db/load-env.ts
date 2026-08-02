/**
 * Load environment variables for the standalone DB CLI scripts.
 *
 * Next.js loads .env files automatically, but drizzle-kit (db:push) and tsx
 * (db:seed / db:import) do not — and unlike the old SQLite setup there is no
 * `file:./local.db` fallback, so these tools now genuinely need DATABASE_URL.
 *
 * No-op when DATABASE_URL is already set (e.g. passed inline for a one-off run).
 *
 * Two ways to target a specific database:
 *   • ENV_FILE=.env.supabase npm run db:push   — load that env file first.
 *   • In that file, provide SUPABASE_DB_{PASSWORD,USER,HOST} and the pooler
 *     connection URLs are assembled here (password URL-encoded), so only the
 *     password ever needs to be pasted.
 */
import { existsSync } from "node:fs";

// 1) Explicit override file (used to target production Supabase).
const explicit = process.env.ENV_FILE;
if (explicit && existsSync(explicit)) {
  process.loadEnvFile(explicit);
}

// 2) Assemble Supabase pooler URLs from a password + host + user, so only the
//    password must be entered and special characters are encoded safely.
if (
  !process.env.DATABASE_URL &&
  process.env.SUPABASE_DB_PASSWORD &&
  process.env.SUPABASE_DB_HOST &&
  process.env.SUPABASE_DB_USER
) {
  const user = process.env.SUPABASE_DB_USER;
  const host = process.env.SUPABASE_DB_HOST;
  const pw = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
  // Transaction pooler (6543) for the app; session pooler (5432) for migrations.
  process.env.DATABASE_URL = `postgresql://${user}:${pw}@${host}:6543/postgres`;
  process.env.DIRECT_DATABASE_URL = `postgresql://${user}:${pw}@${host}:5432/postgres`;
}

// 3) Otherwise fall back to the default dev env files — but not when an explicit
//    ENV_FILE was given (we don't want the local dev DB to shadow the target).
if (!process.env.DATABASE_URL && !explicit) {
  for (const file of [".env.development.local", ".env.local", ".env"]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
      if (process.env.DATABASE_URL) break;
    }
  }
}
