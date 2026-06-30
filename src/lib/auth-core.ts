// Pure crypto helpers — NO Next.js imports, safe to use in standalone
// scripts (seed) and in the app alike.
import {
  randomBytes,
  createHash,
  scryptSync,
  timingSafeEqual,
} from "crypto";

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const dk = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${dk}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const dk = scryptSync(pw, salt, 64);
  const kb = Buffer.from(key, "hex");
  return kb.length === dk.length && timingSafeEqual(kb, dk);
}

export function generateSessionToken(): string {
  return randomBytes(24).toString("base64url");
}

export function sessionTokenToId(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
