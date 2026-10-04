// Pure crypto helpers — NO Next.js imports, safe to use in standalone
// scripts (seed) and in the app alike.
import {
  randomBytes,
  createHash,
  scrypt,
  timingSafeEqual,
} from "crypto";

export const MAX_PASSWORD_BYTES = 512;

function derivePassword(pw: string, salt: string): Promise<Buffer> {
  if (Buffer.byteLength(pw, "utf8") > MAX_PASSWORD_BYTES) {
    return Promise.reject(new RangeError("Password exceeds the maximum length."));
  }
  return new Promise((resolve, reject) => {
    scrypt(pw, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
}

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const dk = (await derivePassword(pw, salt)).toString("hex");
  return `${salt}:${dk}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(stored)) return false;
  const [salt, key] = stored.split(":");
  const dk = await derivePassword(pw, salt);
  const kb = Buffer.from(key, "hex");
  return kb.length === dk.length && timingSafeEqual(kb, dk);
}

export function generateSessionToken(): string {
  return randomBytes(24).toString("base64url");
}

export function sessionTokenToId(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
