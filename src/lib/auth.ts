import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions, type User } from "@/db/schema";
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  sessionTokenToId,
} from "./auth-core";

const COOKIE = "mb_session";
const DAY = 1000 * 60 * 60 * 24;
const SESSION_TTL = 30 * DAY;

export type Role = User["role"];

export { hashPassword, verifyPassword };

// ---- Users ------------------------------------------------------

// A fixed valid hash to compare against when an account doesn't exist, so login
// takes ~constant time regardless of whether the email is registered.
export const DUMMY_PASSWORD_HASH = hashPassword("merveilleux-dummy-password");

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role?: Role;
  status?: "active" | "pending";
}): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      email: input.email.toLowerCase().trim(),
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
      role: input.role ?? "customer",
      status: input.status ?? "active",
    })
    .returning();
  return user;
}

/** Revoke all sessions for a user (e.g. on role change). */
export async function deleteUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0] ?? null;
}

// ---- Sessions ---------------------------------------------------

const tokenToId = sessionTokenToId;

export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const id = tokenToId(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL);
  await db.insert(sessions).values({ id, userId, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, tokenToId(token)));
  }
  jar.delete(COOKIE);
}

/** Resolve the signed-in user for this request (cached), or null. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const id = tokenToId(token);
  try {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);
    if (!session) return null;
    if (session.expiresAt.getTime() < Date.now()) {
      await db.delete(sessions).where(eq(sessions.id, id));
      return null;
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    return user ?? null;
  } catch {
    // DB unavailable (e.g. before Turso is configured) — treat as signed-out.
    return null;
  }
});

// ---- Guards (for server components / layouts) ------------------

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/account");
  return user;
}

// ---- Admin tiers ------------------------------------------------
// `admin` and `master_admin` share the admin console; master_admin adds
// appearance / feature-flags / site-copy / media / user management on top.
// Keep these helpers as the single source of truth for tier checks so
// enforcement stays centralized (never gate on the raw role string).

/** True for either admin tier (normal admin OR master admin). */
export function isAdminTier(role: Role): boolean {
  return role === "admin" || role === "master_admin";
}

/** True only for the top-level master admin. */
export function isMasterAdmin(role: Role): boolean {
  return role === "master_admin";
}

/** Guard: allow both admin tiers. Master inherits everything admin can do. */
export function requireAdmin(): Promise<User> {
  return requireRole(["admin", "master_admin"]);
}

/** Guard: allow master admin only (appearance, flags, copy, media, users). */
export function requireMasterAdmin(): Promise<User> {
  return requireRole(["master_admin"]);
}

export const roleHome: Record<Role, string> = {
  customer: "/account",
  distributor: "/portal",
  admin: "/admin",
  master_admin: "/admin",
};
