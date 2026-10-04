/**
 * Add missing curated content without deleting users, sessions or admin edits.
 * Demo users require SEED_DEMO_USERS=1 and a local non-production database.
 * For a new real database, supply BOOTSTRAP_ADMIN_EMAIL/PASSWORD explicitly.
 */
import "./load-env";
import { db } from "./index";
import { users, products, testimonials, faqs, trainingModules, quizQuestions, kbArticles, promotions, siteSettings } from "./schema";
import { hashPassword } from "../lib/auth-core";
import { getSeedPolicy } from "./seed-policy";
import { DEMO_USERS } from "../lib/demo-users";
import { contentStateKey } from "../lib/content-state";
import { seedProducts, seedTestimonials, seedFaqs, seedModules, seedKbArticles, seedBundles } from "../lib/seed-data";
import enDict from "../i18n/dictionaries/en";
import zhDict from "../i18n/dictionaries/zh";
import msDict from "../i18n/dictionaries/ms";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

async function main() {
  // This validation must precede the first write, including content inserts.
  const policy = getSeedPolicy(process.env);
  console.log("Adding missing Merveilleux Beauty seed content…");
  await db.transaction(async (tx) => {
    // Serialize seeds/bootstrap across CLI instances without racing the owner check.
    await tx.execute(sql`select pg_advisory_xact_lock(74652673)`);
    if (policy.bootstrap) {
      const [master] = await tx.select({ id: users.id }).from(users).where(eq(users.role, "master_admin")).limit(1);
      if (!master) {
        const [existing] = await tx.select({ id: users.id }).from(users).where(eq(users.email, policy.bootstrap.email)).limit(1);
        if (existing) throw new Error("Bootstrap email already belongs to an account; no role or password was changed.");
        await tx.insert(users).values({
          id: randomUUID(), email: policy.bootstrap.email, name: policy.bootstrap.name,
          passwordHash: await hashPassword(policy.bootstrap.password), role: "master_admin", status: "active",
        });
      }
    }
    if (policy.demoUsers) {
      for (const demo of DEMO_USERS) {
        await tx.insert(users).values({ id: randomUUID(), email: demo.email, name: demo.name, role: demo.role, passwordHash: await hashPassword(demo.password) }).onConflictDoNothing();
      }
    }

    // Initialized catalogues belong to the admin, including deliberately empty ones.
    const states = await tx.select({ key: siteSettings.key, value: siteSettings.value }).from(siteSettings);
    const initialized = new Set(states.filter((state) => state.value === true).map((state) => state.key));
    if (!initialized.has(contentStateKey("products")) && seedProducts.length) await tx.insert(products).values(seedProducts.map((product) => ({ ...product, published: true }))).onConflictDoNothing();
    if (!(await tx.select({ id: testimonials.id }).from(testimonials).limit(1)).length && seedTestimonials.length) await tx.insert(testimonials).values(seedTestimonials);
    if (!(await tx.select({ id: faqs.id }).from(faqs).limit(1)).length && seedFaqs.length) await tx.insert(faqs).values(seedFaqs);
    if (!initialized.has(contentStateKey("kb")) && seedKbArticles.length) await tx.insert(kbArticles).values(seedKbArticles).onConflictDoNothing();
    if (!initialized.has(contentStateKey("promotions")) && seedBundles.length) await tx.insert(promotions).values(seedBundles.map((bundle, index) => ({
      slug: bundle.slug,
      title: { en: enDict.promotions.bundles[index].title, zh: zhDict.promotions.bundles[index].title, ms: msDict.promotions.bundles[index].title },
      description: { en: enDict.promotions.bundles[index].desc, zh: zhDict.promotions.bundles[index].desc, ms: msDict.promotions.bundles[index].desc },
      tag: { en: enDict.promotions.bundles[index].tag, zh: zhDict.promotions.bundles[index].tag, ms: msDict.promotions.bundles[index].tag },
      priceRM: bundle.priceRM, wasRM: bundle.wasRM, saveRM: bundle.saveRM, graphic: bundle.graphic,
      productSlugs: bundle.productSlugs, sortOrder: index, published: true,
    }))).onConflictDoNothing();
    for (const kind of ["products", "kb", "promotions"] as const) {
      await tx.insert(siteSettings).values({ key: contentStateKey(kind), value: true }).onConflictDoUpdate({ target: siteSettings.key, set: { value: true, updatedAt: new Date() } });
    }

    for (const trainingModule of seedModules) {
      const [existing] = await tx.select({ id: trainingModules.id }).from(trainingModules).where(eq(trainingModules.ord, trainingModule.ord)).limit(1);
      if (existing) continue;
      const [inserted] = await tx.insert(trainingModules).values({
        ord: trainingModule.ord, icon: trainingModule.icon, title: trainingModule.title, cnTitle: trainingModule.cnTitle,
        summary: trainingModule.summary, lessons: trainingModule.lessons, durationMins: trainingModule.durationMins,
      }).returning({ id: trainingModules.id });
      if (trainingModule.quiz.length) await tx.insert(quizQuestions).values(trainingModule.quiz.map((question) => ({ moduleId: inserted.id, question: question.question, options: question.options, answerIndex: question.answerIndex })));
    }
  });
  console.log("✓ Seed complete. Existing accounts, sessions and content were preserved.");
  if (policy.demoUsers) console.log("Local demo accounts enabled explicitly.");
}

main().then(() => process.exit(0)).catch((error) => {
  // Do not log environment values or supplied bootstrap credentials.
  console.error(error instanceof Error ? error.message : "Seed failed.");
  process.exit(1);
});
