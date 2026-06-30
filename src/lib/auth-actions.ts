"use server";

import { redirect } from "next/navigation";
import {
  createUser,
  createSession,
  findUserByEmail,
  verifyPassword,
  destroySession,
  roleHome,
  DUMMY_PASSWORD_HASH,
} from "./auth";

export type AuthState = { error?: string } | undefined;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  // SECURITY: never trust a client-supplied role. Self-registration always
  // creates a `customer`. A "Join as 经销商" intent is recorded as a pending
  // application that an admin promotes via the Users screen.
  const wantsDistributor = String(formData.get("role") || "") === "distributor";

  if (name.length < 2) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  let exists = null;
  try {
    exists = await findUserByEmail(email);
  } catch {
    return {
      error:
        "Accounts are unavailable — the database isn't configured yet. Please try again later.",
    };
  }
  if (exists) return { error: "An account with this email already exists." };

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
    return { error: "Could not create your account. Please try again." };
  }
  redirect(home);
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  let user;
  try {
    user = await findUserByEmail(email);
  } catch {
    return {
      error: "Sign-in is unavailable — the database isn't configured yet.",
    };
  }
  // Constant-time-ish: always run a verification even when the user is absent,
  // so response latency doesn't reveal whether an email is registered.
  let ok = false;
  if (user) {
    ok = verifyPassword(password, user.passwordHash);
  } else {
    verifyPassword(password, DUMMY_PASSWORD_HASH); // decoy work
  }
  if (!user || !ok) {
    return { error: "Invalid email or password." };
  }
  await createSession(user.id);
  redirect(roleHome[user.role]);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
