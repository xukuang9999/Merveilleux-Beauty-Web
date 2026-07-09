/**
 * Seed the database with curated content + demo accounts.
 * Local:  npm run db:seed            (uses file:./local.db)
 * Turso:  npm run db:seed:remote     (reads .env.local for TURSO_*)
 */
import { db } from "./index";
import {
  users,
  products,
  testimonials,
  faqs,
  trainingModules,
  quizQuestions,
  kbArticles,
  sessions,
  trainingProgress,
} from "./schema";
import { hashPassword } from "../lib/auth-core";
import {
  seedProducts,
  seedTestimonials,
  seedFaqs,
  seedModules,
  seedKbArticles,
} from "../lib/seed-data";
import { randomUUID } from "crypto";

async function main() {
  console.log("Seeding Merveilleux Beauty database…");

  // Clear (order respects FKs)
  await db.delete(trainingProgress);
  await db.delete(quizQuestions);
  await db.delete(trainingModules);
  await db.delete(products);
  await db.delete(testimonials);
  await db.delete(faqs);
  await db.delete(kbArticles);
  await db.delete(sessions);
  await db.delete(users);

  // Users (demo credentials — change in production!)
  const demoUsers = [
    {
      id: randomUUID(),
      email: "master@merveilleux.test",
      name: "Grace Phua",
      passwordHash: hashPassword("master1234"),
      role: "master_admin" as const,
    },
    {
      id: randomUUID(),
      email: "admin@merveilleux.test",
      name: "Site Admin",
      passwordHash: hashPassword("admin1234"),
      role: "admin" as const,
    },
    {
      id: randomUUID(),
      email: "distributor@merveilleux.test",
      name: "Aisyah R.",
      passwordHash: hashPassword("dist1234"),
      role: "distributor" as const,
    },
    {
      id: randomUUID(),
      email: "customer@merveilleux.test",
      name: "Mei Ling",
      passwordHash: hashPassword("cust1234"),
      role: "customer" as const,
    },
  ];
  await db.insert(users).values(demoUsers);

  // Catalog
  await db.insert(products).values(seedProducts);
  await db.insert(testimonials).values(seedTestimonials);
  await db.insert(faqs).values(seedFaqs);
  await db.insert(kbArticles).values(seedKbArticles);

  // Training modules + quiz questions
  for (const m of seedModules) {
    const [mod] = await db
      .insert(trainingModules)
      .values({
        ord: m.ord,
        icon: m.icon,
        title: m.title,
        cnTitle: m.cnTitle,
        summary: m.summary,
        lessons: m.lessons,
        durationMins: m.durationMins,
      })
      .returning();
    await db.insert(quizQuestions).values(
      m.quiz.map((q) => ({
        moduleId: mod.id,
        question: q.question,
        options: q.options,
        answerIndex: q.answerIndex,
      })),
    );
  }

  console.log("✓ Seed complete.");
  console.log("  Products:", seedProducts.length);
  console.log("  Modules:", seedModules.length);
  console.log("  KB articles:", seedKbArticles.length);
  console.log("\n  Demo logins:");
  console.log("   master@merveilleux.test / master1234  (master admin)");
  console.log("   admin@merveilleux.test / admin1234  (admin)");
  console.log("   distributor@merveilleux.test / dist1234  (经销商)");
  console.log("   customer@merveilleux.test / cust1234  (customer)");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
