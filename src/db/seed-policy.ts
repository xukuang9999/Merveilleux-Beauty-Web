type SeedEnvironment = Record<string, string | undefined>;
export type SeedPolicy = {
  demoUsers: boolean;
  bootstrap: { email: string; name: string; password: string } | null;
};

/** Validate before any DB writes. Demo credentials can only target loopback DBs. */
export function getSeedPolicy(env: SeedEnvironment): SeedPolicy {
  if (!env.DATABASE_URL?.trim()) throw new Error("DATABASE_URL is required to seed a database.");
  const url = new URL(env.DATABASE_URL.trim());
  const local = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname.toLowerCase());
  const demoUsers = env.SEED_DEMO_USERS === "1";
  if (demoUsers && (env.NODE_ENV === "production" || !local)) {
    throw new Error("Demo users are only permitted on a local development database.");
  }
  const email = env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = env.BOOTSTRAP_ADMIN_NAME?.trim() || "Site Owner";
  if (!email && !password) return { demoUsers, bootstrap: null };
  if (!email || !password) throw new Error("Supply both BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD.");
  if (email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("The bootstrap email must be valid.");
  if (password.length < 12 || password.length > 128 || Buffer.byteLength(password, "utf8") > 512) throw new Error("The bootstrap password must contain 12–128 characters.");
  if (name.length < 2 || name.length > 200) throw new Error("The bootstrap name must contain 2–200 characters.");
  return { demoUsers, bootstrap: { email, name, password } };
}
