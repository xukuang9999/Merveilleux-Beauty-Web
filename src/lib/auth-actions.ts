"use server";

import { redirect } from "next/navigation";
import {
  createUser,
  createSession,
  findUserByEmail,
  verifyPassword,
  destroySession,
  roleHome,
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
  const asRole = String(formData.get("role") || "customer");
  const role = asRole === "distributor" ? "distributor" : "customer";

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
    const user = await createUser({ name, email, password, role });
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
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }
  await createSession(user.id);
  redirect(roleHome[user.role]);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
