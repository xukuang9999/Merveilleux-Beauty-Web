"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  requireMasterAdmin,
  deleteUserSessions,
  type Role,
} from "./auth";
import { db } from "@/db";
import {
  products,
  users,
  kbArticles,
  featureFlags,
  siteSettings,
  siteCopy,
  promotions,
  mediaAssets,
} from "@/db/schema";
import { deleteStoredImage } from "./media";
import { isMediaInUse } from "./media-usage";
import { COPY_ITEMS } from "./copy-registry";
import { getDictionary } from "@/i18n/server";
import { locales } from "@/i18n/config";
import {
  FEATURE_KEYS,
  type FeatureKey,
  COLOR_TOKENS,
  FONT_SERIF_OPTIONS,
  FONT_SANS_OPTIONS,
  APPEARANCE_KEY,
  type Appearance,
  type ColorTokenKey,
} from "./settings";

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
    category: String(formData.get("category") || "").trim(),
    tagline: String(formData.get("tagline") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    keyIngredients: toList(formData.get("keyIngredients")),
    benefits: toList(formData.get("benefits")),
    priceRM: String(formData.get("priceRM") || "").trim(),
    graphic:
      String(formData.get("graphic") || "").trim() ||
      "/products/oxy-bright-serum.png",
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

// Promotions are admin-tier (both admin and master). Localised title/desc/tag
// are collected per-locale from the form and stored as JSON.
export async function savePromotion(formData: FormData) {
  await ensureAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const perLocale = (prefix: string): Record<string, string> => {
    const o: Record<string, string> = {};
    for (const l of locales) o[l] = String(formData.get(`${prefix}_${l}`) || "").trim();
    return o;
  };

  const title = perLocale("title");
  const description = perLocale("desc");
  const tagObj = perLocale("tag");
  const tag = locales.some((l) => tagObj[l]) ? tagObj : null;

  const values = {
    slug: String(formData.get("slug") || "").trim(),
    title,
    description,
    tag,
    priceRM: String(formData.get("priceRM") || "").trim(),
    wasRM: String(formData.get("wasRM") || "").trim(),
    saveRM: String(formData.get("saveRM") || "").trim(),
    graphic:
      String(formData.get("graphic") || "").trim() ||
      "/products/oxy-bright-serum.png",
    productSlugs: toList(formData.get("productSlugs")),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (!values.slug || !title.en) return; // require slug + English title

  if (id) {
    await db.update(promotions).set(values).where(eq(promotions.id, id));
  } else {
    await db.insert(promotions).values(values);
  }
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

export async function deletePromotion(formData: FormData) {
  await ensureAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(promotions).where(eq(promotions.id, id));
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

// Deleting media (removing the underlying file/blob too) is master-only.
// Uploading is admin-tier and handled by the /api/admin/media route.
export async function deleteMediaAsset(formData: FormData) {
  await requireMasterAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset) return;
  // Guard: never delete an asset still referenced by a product or promotion
  // (the UI hides the delete button for these; this enforces it server-side).
  if (await isMediaInUse(asset.url)) return;
  await deleteStoredImage(asset.pathname, asset.url);
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  revalidatePath("/admin/media");
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

// Appearance (brand colours + fonts) is master-only. Values are validated
// server-side (hex colours, allowlisted fonts) before they can drive the
// site-wide CSS variables, so nothing user-supplied reaches the DOM raw.
const HEX = /^#[0-9a-fA-F]{6}$/;

export async function saveAppearance(formData: FormData) {
  await requireMasterAdmin();

  const colors = {} as Record<ColorTokenKey, string>;
  for (const t of COLOR_TOKENS) {
    const v = String(formData.get(`color_${t.key}`) || "").trim();
    colors[t.key] = HEX.test(v) ? v : t.default; // invalid → back to default
  }

  const serif = String(formData.get("fontSerif") || "");
  const sans = String(formData.get("fontSans") || "");
  const appearance: Appearance = {
    colors,
    fontSerif: FONT_SERIF_OPTIONS[serif] ? serif : "cormorant",
    fontSans: FONT_SANS_OPTIONS[sans] ? sans : "dmSans",
  };

  await db
    .insert(siteSettings)
    .values({ key: APPEARANCE_KEY, value: appearance, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: appearance, updatedAt: new Date() },
    });

  revalidatePath("/", "layout");
  revalidatePath("/admin/appearance");
}

export async function resetAppearance() {
  await requireMasterAdmin();
  await db.delete(siteSettings).where(eq(siteSettings.key, APPEARANCE_KEY));
  revalidatePath("/", "layout");
  revalidatePath("/admin/appearance");
}

// Editable page copy is master-only. Each (field, locale) is edited in its own
// input; a value equal to the dictionary default (or blank) removes the
// override so the field falls back — the table only stores real overrides.
export async function saveCopy(formData: FormData) {
  await requireMasterAdmin();

  for (const item of COPY_ITEMS) {
    for (const locale of locales) {
      const raw = String(formData.get(`${item.key}__${locale}`) ?? "").trim();
      const def = item.resolve(getDictionary(locale)).trim();

      if (!raw || raw === def) {
        await db
          .delete(siteCopy)
          .where(
            and(eq(siteCopy.key, item.key), eq(siteCopy.locale, locale)),
          );
      } else {
        await db
          .insert(siteCopy)
          .values({ key: item.key, locale, value: raw, updatedAt: new Date() })
          .onConflictDoUpdate({
            target: [siteCopy.key, siteCopy.locale],
            set: { value: raw, updatedAt: new Date() },
          });
      }
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}
