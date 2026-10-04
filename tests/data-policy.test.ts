import assert from "node:assert/strict";
import test from "node:test";
import { seedProducts, seedKbArticles, seedBundles } from "../src/lib/seed-data";
import {
  pickContentLocale,
  publishedContent,
  validPromotionReferences,
} from "../src/lib/content-state";
import { hasRemoteDb, withDbDeadline } from "../src/db";
import { getFeatureFlags, getAppearance, getCopyOverrides } from "../src/lib/settings";

test("hiding a catalogue product removes it rather than restoring its seed version", () => {
  const withdrawn = seedProducts[0].slug;
  const database = seedProducts.map((p) => ({ ...p, published: p.slug !== withdrawn }));
  const visible = publishedContent(database, true, seedProducts);
  assert.equal(visible.length, seedProducts.length - 1);
  assert.ok(!visible.some((p) => p.slug === withdrawn));
});

test("deleting/renaming a catalogue row does not restore an absent seed product", () => {
  const original = seedProducts[0];
  const database = [{ ...original, slug: `${original.slug}-renamed`, published: true }];
  assert.deepEqual(publishedContent(database, true, seedProducts).map((p) => p.slug), [database[0].slug]);
});

test("an initialized catalogue remains empty after its last record is deleted", () => {
  assert.deepEqual(publishedContent([], true, seedProducts), []);
  assert.deepEqual(publishedContent([], true, seedBundles), []);
});

test("a genuinely uninitialized catalogue still supplies the full curated range", () => {
  assert.equal(seedProducts.length, 44);
  assert.deepEqual(publishedContent([], false, seedProducts), seedProducts);
});

test("hiding every KB article does not expose the seed library again", () => {
  const hidden = seedKbArticles.map((p) => ({ ...p, published: false }));
  assert.deepEqual(publishedContent(hidden, true, seedKbArticles), []);
});

test("blank and whitespace promotion translations fall back to English", () => {
  assert.equal(pickContentLocale({ en: "English title", zh: "", ms: "  " }, "zh"), "English title");
  assert.equal(pickContentLocale({ en: "English title", zh: "", ms: "  " }, "ms"), "English title");
  assert.equal(pickContentLocale({ en: "English title", zh: "中文标题" }, "zh"), "中文标题");
});

test("a promotion cannot reference missing, withdrawn, duplicate or zero products", () => {
  const published = new Set(["cleanser", "serum"]);
  assert.equal(validPromotionReferences(["cleanser", "serum"], published), true);
  assert.equal(validPromotionReferences(["cleanser", "old-moisturiser"], published), false);
  assert.equal(validPromotionReferences(["cleanser", "cleanser"], published), false);
  assert.equal(validPromotionReferences([], published), false);
});

test("every fallback bundle resolves to current catalogue products", () => {
  const published = new Set(seedProducts.map((p) => p.slug));
  for (const bundle of seedBundles) {
    assert.equal(validPromotionReferences(bundle.productSlugs, published), true, bundle.slug);
  }
});

test("a database read queued indefinitely rejects at the application deadline", async () => {
  await assert.rejects(
    withDbDeadline(new Promise<never>(() => {}), 20),
    /Database read timed out/,
  );
  assert.equal(await withDbDeadline(Promise.resolve("available"), 20), "available");
});

test("unconfigured settings remain immediate after repeated concurrent reads", { skip: hasRemoteDb }, async () => {
  const started = performance.now();
  const results = await Promise.all(Array.from({ length: 24 }, async () => ({
    flags: await getFeatureFlags(),
    appearance: await getAppearance(),
    overrides: await getCopyOverrides("en"),
  })));
  assert.ok(performance.now() - started < 1_000, "unconfigured readers waited for a database");
  assert.equal(results[0].flags.promotions, false);
  assert.equal(results[0].appearance.fontSans, "dmSans");
  assert.equal(results[0].overrides.size, 0);
});
