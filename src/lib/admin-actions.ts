"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin, deleteUserSessions, type Role } from "./auth";
import { db } from "@/db";
import { products, users, kbArticles } from "@/db/schema";

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
  const me = await ensureAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  if (!["customer", "distributor", "admin"].includes(role)) return;

  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!target) return;

  // Guard against admin lockout: can't demote yourself or the last admin.
  if (target.role === "admin" && role !== "admin") {
    if (target.id === me.id) return;
    const admins = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"));
    if (admins.length <= 1) return;
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
