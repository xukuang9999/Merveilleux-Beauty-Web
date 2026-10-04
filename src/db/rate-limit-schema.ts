import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Backend-only quotas. RLS denies client roles; the database owner bypasses it. */
export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  hits: integer("hits").notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [index("rate_limit_buckets_reset_at_idx").on(table.resetAt)]).enableRLS();
