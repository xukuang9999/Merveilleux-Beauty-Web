import { sql } from "drizzle-orm";
import { db, hasRemoteDb } from "@/db";
import { rateLimitBuckets } from "@/db/rate-limit-schema";
import type { RateLimitBucket, RateLimitResult } from "./rate-limit-core";

const UNAVAILABLE: RateLimitResult = { available: false, allowed: false, retryAfterSeconds: 30 };

/** Atomic shared quotas: a DB/storage failure must never enable paid work. */
export async function consumeRateLimits(buckets: RateLimitBucket[]): Promise<RateLimitResult> {
  if (!hasRemoteDb || buckets.length === 0) return UNAVAILABLE;
  try {
    return await db.transaction(async (tx) => {
      // Consistent lock ordering avoids deadlocks when multiple instances race.
      for (const bucket of [...buckets].sort((a, b) => a.key.localeCompare(b.key))) {
        if (!Number.isSafeInteger(bucket.limit) || bucket.limit < 1 || !Number.isSafeInteger(bucket.windowMs) || bucket.windowMs < 1) {
          throw new Error("Invalid quota policy.");
        }
        const expired = sql`${rateLimitBuckets.resetAt} <= now()`;
        const resetsAt = sql`now() + ${bucket.windowMs} * interval '1 millisecond'`;
        const [row] = await tx.insert(rateLimitBuckets).values({
          key: bucket.key,
          hits: 1,
          resetAt: resetsAt,
        }).onConflictDoUpdate({
          target: rateLimitBuckets.key,
          set: {
            hits: sql`case when ${expired} then 1 else least(${rateLimitBuckets.hits} + 1, ${bucket.limit + 1}) end`,
            resetAt: sql`case when ${expired} then ${resetsAt} else ${rateLimitBuckets.resetAt} end`,
          },
        }).returning({ hits: rateLimitBuckets.hits, resetAt: rateLimitBuckets.resetAt });
        if (row.hits > bucket.limit) {
          return { available: true, allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000)) };
        }
      }
      return { available: true, allowed: true, retryAfterSeconds: 0 };
    });
  } catch {
    return UNAVAILABLE;
  }
}
