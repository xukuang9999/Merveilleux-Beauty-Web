"use server";

import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/server";
import { securityCopy } from "./security-copy";
import { consumeRateLimits } from "./rate-limit";
import { authBuckets } from "./rate-limit-core";
import { MAX_PASSWORD_BYTES } from "./auth-core";
import { isLegacyDemoCredential } from "./demo-users";
import {
  createUser,
  createSession,
  findUserByEmail,
  verifyPassword,
  destroySession,
  roleHome,
  DUMMY_PASSWORD_HASH,
} from "./auth";

export type AuthState = { error?: string; retryAfterSeconds?: number } | undefined;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function textField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

function validPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128 && Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES;
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const copy = securityCopy(await getLocale());
  const name = textField(formData, "name").trim();
  const email = textField(formData, "email")
    .trim()
    .toLowerCase();
  const password = textField(formData, "password");
  // SECURITY: never trust a client-supplied role. Self-registration always
  // creates a `customer`. A "Join as 经销商" intent is recorded as a pending
  // application that an admin promotes via the Users screen.
  const wantsDistributor = textField(formData, "role") === "distributor";

  if (name.length < 2 || name.length > 200) return { error: copy.nameInvalid };
  if (email.length > 254 || !EMAIL_RE.test(email)) return { error: copy.emailInvalid };
  if (!validPassword(password)) return { error: copy.passwordInvalid };

  const quota = await consumeRateLimits(authBuckets("register", email));
  if (!quota.available) return { error: copy.accountsUnavailable };
  if (!quota.allowed) return { error: copy.authLimited, retryAfterSeconds: quota.retryAfterSeconds };

  let exists = null;
  try {
    exists = await findUserByEmail(email);
  } catch {
    return { error: copy.accountsUnavailable };
  }
  if (exists) return { error: copy.accountExists };

  let home: string;
  try {
    const user = await createUser({
      name,
      email,
      password,
      role: "customer",
      status: wantsDistributor ? "pending" : "active",
    });
    await createSession(user.id);
    home = roleHome[user.role];
  } catch {
    return { error: copy.createFailed };
  }
  redirect(home);
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const copy = securityCopy(await getLocale());
  const email = textField(formData, "email")
    .trim()
    .toLowerCase();
  const password = textField(formData, "password");
  // Bound inputs before any database or password-hashing work.
  if (email.length > 254 || !EMAIL_RE.test(email) || !validPassword(password)) {
    return { error: copy.credentialsInvalid };
  }
  const quota = await consumeRateLimits(authBuckets("login", email));
  if (!quota.available) return { error: copy.accountsUnavailable };
  if (!quota.allowed) return { error: copy.authLimited, retryAfterSeconds: quota.retryAfterSeconds };

  let user;
  // Retained legacy seed rows are unusable at their published default password.
  // Rotated accounts remain accessible, and existing rows are never deleted.
  if (process.env.NODE_ENV === "production" && isLegacyDemoCredential(email, password)) {
    return { error: copy.credentialsInvalid };
  }
  try {
    user = await findUserByEmail(email);
  } catch {
    return { error: copy.accountsUnavailable };
  }
  // Constant-time-ish: always run a verification even when the user is absent,
  // so response latency doesn't reveal whether an email is registered.
  let ok;
  try {
    ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  } catch {
    return { error: copy.accountsUnavailable };
  }
  if (!user || !ok) {
    return { error: copy.credentialsInvalid };
  }
  try {
    await createSession(user.id);
  } catch {
    return { error: copy.accountsUnavailable };
  }
  redirect(roleHome[user.role]);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
