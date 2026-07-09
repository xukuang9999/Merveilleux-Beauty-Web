"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  requireMasterAdmin,
  deleteUserSessions,
  type Role,
} from "./auth";
import { db } from "@/db";
import { products, users, kbArticles, featureFlags } from "@/db/schema";
import { FEATURE_KEYS, type FeatureKey } from "./settings";

async function ensureAdmin() {
  return requireAdmin();
}

function toList(v: FormDataEntryValue | null): string[] {
  return String(v || "")
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function saveProduct(formData: FormData) {
  await ensureAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const values = {
    slug: String(formData.get("slug") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    type: String(formData.get("type") || "").trim(),
    tagline: String(formData.get("tagline") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    keyIngredients: toList(formData.get("keyIngredients")),
    benefits: toList(formData.get("benefits")),
    priceRM: String(formData.get("priceRM") || "").trim(),
    graphic:
      String(formData.get("graphic") || "").trim() ||
      "/products/oxy-bright-serum.jpg",
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (!values.slug || !values.name) return;
  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    await db.insert(products).values(values);
  }
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  await ensureAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function setUserRole(formData: FormData) {
  // Only master admins manage accounts / roles.
  await requireMasterAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  if (!["customer", "distributor", "admin", "master_admin"].includes(role)) {
    return;
  }

  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!target) return;

  // Guard against master-admin lockout: never demote the last master admin
  // (this also blocks the sole master from demoting themselves).
  if (target.role === "master_admin" && role !== "master_admin") {
    const masters = await db
      .select()
      .from(users)
      .where(eq(users.role, "master_admin"));
    if (masters.length <= 1) return;
  }

  await db
    .update(users)
    .set({
      role: role as Role,
      // Promotion clears any pending application.
      status: role === "customer" ? target.status : "active",
    })
    .where(eq(users.id, id));

  // A role change invalidates the user's existing sessions (forces re-login
  // so their new permissions take effect immediately).
  if (target.role !== role) await deleteUserSessions(id);

  revalidatePath("/admin/users");
}

export async function toggleKbPublished(formData: FormData) {
  await ensureAdmin();
  const id = Number(formData.get("id"));
  const current = formData.get("published") === "true";
  await db
    .update(kbArticles)
    .set({ published: !current })
    .where(eq(kbArticles.id, id));
  revalidatePath("/admin/kb");
}

// Feature flags are master-only. Toggling one revalidates the root layout so
// nav / footer / widgets across the whole site pick up the change.
export async function setFeatureFlag(formData: FormData) {
  await requireMasterAdmin();
  const key = String(formData.get("key"));
  if (!(FEATURE_KEYS as readonly string[]).includes(key)) return;
  const enabled = formData.get("enabled") === "true";

  await db
    .insert(featureFlags)
    .values({ key: key as FeatureKey, enabled, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: featureFlags.key,
      set: { enabled, updatedAt: new Date() },
    });

  revalidatePath("/", "layout");
  revalidatePath("/admin/features");
}
