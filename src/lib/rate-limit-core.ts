import { createHash } from "node:crypto";

export type RateLimitBucket = { key: string; limit: number; windowMs: number };
export type RateLimitResult = { available: boolean; allowed: boolean; retryAfterSeconds: number };

/** Headers claiming a client IP are deliberately excluded from quota identity. */
export function quotaKey(scope: string, identity: string): string {
  return `${scope}:${createHash("sha256").update(identity).digest("hex")}`;
}

export function authBuckets(kind: "login" | "register", email: string): RateLimitBucket[] {
  return [
    { key: `0:auth:${kind}:minute`, limit: kind === "login" ? 120 : 10, windowMs: 60_000 },
    { key: `0:auth:${kind}:hour`, limit: kind === "login" ? 1200 : 60, windowMs: 3_600_000 },
    { key: quotaKey(`1:auth:${kind}:account`, email.trim().toLowerCase()), limit: kind === "login" ? 5 : 3, windowMs: kind === "login" ? 900_000 : 3_600_000 },
  ];
}

export function chatBuckets(identity: string): RateLimitBucket[] {
  return [
    { key: "0:chat:minute", limit: 120, windowMs: 60_000 },
    { key: "0:chat:hour", limit: 1000, windowMs: 3_600_000 },
    { key: "0:chat:day", limit: 3000, windowMs: 86_400_000 },
    { key: quotaKey("1:chat:visitor", identity), limit: 15, windowMs: 60_000 },
  ];
}
