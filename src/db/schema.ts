import {
  sqliteTable,
  text,
  integer,
  unique,
} from "drizzle-orm/sqlite-core";

// ---- Auth -------------------------------------------------------

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "distributor", "admin", "master_admin"] })
    .notNull()
    .default("customer"),
  status: text("status", { enum: ["active", "pending"] })
    .notNull()
    .default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // sha-256 hash of the session token
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// ---- Catalog / content -----------------------------------------

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  keyIngredients: text("key_ingredients", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  benefits: text("benefits", { mode: "json" }).$type<string[]>().notNull(),
  priceRM: text("price_rm").notNull(),
  graphic: text("graphic").notNull(),
  // Canonical category slug (see src/lib/categories.ts); "" = uncategorised.
  category: text("category").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  // DB-only products (created in the admin) default to unpublished — they only
  // appear on the storefront once explicitly published. Seed products are
  // seeded as published; see src/db/seed.ts.
  published: integer("published", { mode: "boolean" }).notNull().default(false),

  // ---- Catalogue-extraction fields (see src/db/import-extracted.ts) --------
  // Source classification: product | treatment | bundle. Distinct from `type`,
  // which is a free-text display label ("Silk Treatment Mask", "Trial Set").
  // Nullable — the pre-existing dev rows predate this column.
  kind: text("kind", { enum: ["product", "treatment", "bundle"] }),
  // Editorial/lifecycle state from the source card (e.g. "available"), separate
  // from `published` (storefront visibility). Defaulted so db:push is safe.
  status: text("status").notNull().default("available"),
  // Marketing grouping from the source cards (e.g. "Eye Care", "Silk Mask").
  // Distinct from `category` (the canonical storefront filter slug); "" = none.
  collection: text("collection").notNull().default(""),
  // Pack/size label as printed on the card (e.g. "3 items", "30ml"); null = n/a.
  sizeLabel: text("size"),
  // Bundle / trial-set contents — one line per item. Null for single products.
  contents: text("contents", { mode: "json" }).$type<string[]>(),
  // Compliance-sensitive marketing claims flagged during extraction, for review.
  claimsFlagged: text("claims_flagged", { mode: "json" }).$type<string[]>(),
  // Directions for use — one step per line.
  howToUse: text("how_to_use", { mode: "json" }).$type<string[]>(),
  // Provenance: Telegram / manifest message ids this card was extracted from.
  sourceMsgIds: text("source_msg_ids", { mode: "json" }).$type<string[]>(),
  // Additional gallery images (public URLs). `graphic` stays the primary image.
  photos: text("photos", { mode: "json" }).$type<string[]>(),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---- Training (Workstream A) ------------------------------------

export const trainingModules = sqliteTable("training_modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ord: integer("ord").notNull(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  cnTitle: text("cn_title").notNull(),
  summary: text("summary").notNull(),
  lessons: text("lessons", { mode: "json" }).$type<string[]>().notNull(),
  durationMins: integer("duration_mins").notNull().default(30),
});

export const quizQuestions = sqliteTable("quiz_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: integer("module_id")
    .notNull()
    .references(() => trainingModules.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: text("options", { mode: "json" }).$type<string[]>().notNull(),
  answerIndex: integer("answer_index").notNull(),
});

export const trainingProgress = sqliteTable(
  "training_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: integer("module_id")
      .notNull()
      .references(() => trainingModules.id, { onDelete: "cascade" }),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    score: integer("score").notNull().default(0),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (t) => [unique().on(t.userId, t.moduleId)],
);

// ---- Knowledge base (Workstream C) ------------------------------

export const kbArticles = sqliteTable("kb_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

// ---- Leads ------------------------------------------------------

export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interest: text("interest").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  locale: text("locale"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---- Site administration (master admin) ------------------------

// Feature flags — show/hide site features. A missing row means "use the
// coded default" (see src/lib/settings.ts), so the table only stores overrides.
export const featureFlags = sqliteTable("feature_flags", {
  key: text("key").primaryKey(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Generic key/value store for site settings (e.g. the "appearance" JSON blob:
// brand colours + font choices). Absent keys fall back to coded defaults.
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Uploaded media (product photos, marketing material). Stores the public URL
// plus the backend pathname (Vercel Blob key, or the local /products path in
// dev) so an asset can be located/deleted later.
export const mediaAssets = sqliteTable("media_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  kind: text("kind").notNull().default("image"),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Per-locale overrides for editable page copy. One row per (key, locale);
// a missing row falls back to the dictionary default. One language per locale
// is enforced by editing each locale in its own field (see /admin/content).
export const siteCopy = sqliteTable(
  "site_copy",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    key: text("key").notNull(),
    locale: text("locale").notNull(),
    value: text("value").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [unique().on(t.key, t.locale)],
);

// Promotions / bundles — admin-managed. Localised copy (title/description/tag)
// is stored per-locale as JSON; a missing locale falls back to English.
export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<Record<string, string>>().notNull(),
  description: text("description", { mode: "json" })
    .$type<Record<string, string>>()
    .notNull(),
  tag: text("tag", { mode: "json" }).$type<Record<string, string>>(),
  priceRM: text("price_rm").notNull(),
  wasRM: text("was_rm").notNull(),
  saveRM: text("save_rm").notNull(),
  graphic: text("graphic").notNull(),
  productSlugs: text("product_slugs", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

export type User = typeof users.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type TrainingModule = typeof trainingModules.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type KbArticle = typeof kbArticles.$inferSelect;
