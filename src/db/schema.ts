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
  role: text("role", { enum: ["customer", "distributor", "admin"] })
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
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
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

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type TrainingModule = typeof trainingModules.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type KbArticle = typeof kbArticles.$inferSelect;
