import "./src/db/load-env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/db/schema.ts", "./src/db/rate-limit-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations use the DIRECT connection (Supabase port 5432) when set — the
    // transaction pooler (6543) isn't suited to DDL. Falls back to DATABASE_URL,
    // which is correct for local Postgres (no separate pooler there).
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "",
  },
});
