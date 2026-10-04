import assert from "node:assert/strict";
import { catalogueProducts } from "../src/lib/catalogue-products";
import { seedBundles, seedModules } from "../src/lib/seed-data";
import { normalizeLegacyBundle, normalizeLegacyProductCopy } from "../src/lib/catalogue-compat";
import { localizedMetadata } from "../src/lib/seo";
import zh from "../src/i18n/content/zh";
import ms from "../src/i18n/content/ms";
import { localizeQuiz } from "../src/i18n/content/quiz";
import enDict from "../src/i18n/dictionaries/en";
import zhDict from "../src/i18n/dictionaries/zh";
import msDict from "../src/i18n/dictionaries/ms";

const slugs = catalogueProducts.map((p) => p.slug).sort();
for (const [locale, pack] of Object.entries({ zh, ms })) {
  assert.deepEqual(Object.keys(pack.products).sort(), slugs, `${locale}: catalogue coverage`);
  for (const p of catalogueProducts) {
    const translated = pack.products[p.slug];
    assert.ok(translated.description && translated.tagline && translated.benefits.length, `${locale}: ${p.slug}`);
    if (p.howToUse?.length) assert.equal(translated.howToUse?.length, p.howToUse.length, `${locale}: usage ${p.slug}`);
    assert.doesNotMatch(JSON.stringify(translated), /Grace|before publishing|待与|品牌方最终确认/);
  }
}
assert.deepEqual(ms.products["blemish-serum"].keyIngredients, ["Niacinamide", "Chamomile Extract"]);
assert.deepEqual(ms.products["ultrafine-cleansing-gel"].keyIngredients,
  catalogueProducts.find((p) => p.slug === "ultrafine-cleansing-gel")!.keyIngredients);
for (const category of Object.keys(enDict.products.categories)) {
  const key = category as keyof typeof enDict.products.categories;
  assert.notEqual(msDict.products.categories[key], enDict.products.categories[key], `BM category ${key}`);
}
for (const dict of [enDict, zhDict, msDict]) assert.doesNotMatch(JSON.stringify(dict.home.heroReel), /SPF50/);

let questions = 0;
for (const trainingModule of seedModules) {
  const original = trainingModule.quiz.map((q, id) => ({ ...q, id: `${trainingModule.ord}:${id}` }));
  for (const locale of ["en", "zh", "ms"] as const) {
    const translated = localizeQuiz(trainingModule.ord, original, locale);
    assert.equal(translated.length, original.length);
    translated.forEach((q, index) => {
      assert.equal(q.id, original[index].id);
      assert.equal(q.answerIndex, original[index].answerIndex);
      assert.equal(q.options.length, original[index].options.length);
      if (locale !== "en") assert.notEqual(q.question, original[index].question);
    });
    const reversed = localizeQuiz(trainingModule.ord, [...original].reverse(), locale);
    assert.deepEqual(reversed.map((q) => q.question), translated.map((q) => q.question).reverse());
  }
  questions += original.length;
}
const customized = [{ id: 999, question: seedModules[0].quiz[0].question, options: ["Custom A", "Custom B"], answerIndex: 0 }];
assert.deepEqual(localizeQuiz(1, customized, "zh"), customized, "Customized options must not get unrelated translations");

for (const bundle of seedBundles) {
  const retail = bundle.productSlugs.reduce((sum, slug) => {
    const product = catalogueProducts.find((p) => p.slug === slug);
    assert.ok(product, `Missing bundle component ${slug}`);
    assert.match(product.priceRM, /^RM\d+$/);
    return sum + Number(product.priceRM.slice(2));
  }, 0);
  assert.equal(Number(bundle.wasRM.slice(2)), retail);
  assert.equal(Number(bundle.saveRM.slice(2)), retail - Number(bundle.priceRM.slice(2)));
}
const oldBundle = { ...seedBundles[0], productSlugs: ["oxy-bright-serum", "youth-ha-moisturiser", "uv-shield-spf35"], wasRM: "RM654", saveRM: "RM95" };
assert.deepEqual(normalizeLegacyBundle(oldBundle), seedBundles[0]);
const customBundle = { ...oldBundle, priceRM: "RM500", wasRM: "RM700", saveRM: "RM200" };
assert.equal(normalizeLegacyBundle(customBundle).wasRM, "RM700", "Custom pricing stays intact");
const brightening = catalogueProducts.find((p) => p.slug === "brightening-plus-hydrating-trial-set")!;
const oldProduct = { ...brightening, description: "Includes a trial item; the third item is to be confirmed with Grace.", sizeLabel: "3 items" };
assert.equal(normalizeLegacyProductCopy(oldProduct).sizeLabel, null);
const approved = { ...brightening, description: "Approved current product description", sizeLabel: "3 items" };
assert.equal(normalizeLegacyProductCopy(approved).sizeLabel, "3 items");

for (const locale of ["en", "zh", "ms"] as const) {
  const p = catalogueProducts[1];
  const result = localizedMetadata({ locale, title: p.name, description: p.tagline, path: `/products/${p.slug}`, image: p.graphic });
  const graph = result.openGraph!;
  assert.ok(typeof graph.title === "string" && graph.title.startsWith(p.name));
  assert.equal(graph.description, p.tagline);
  assert.equal(graph.url, `/products/${p.slug}`);
  assert.equal(graph.locale, `${locale}_MY`);
  assert.deepEqual(graph.images, [{ url: p.graphic, alt: p.name }]);
}
console.log(`Content checks passed: 44 products × ZH/BM; 13 usage sets × ZH/BM; ${questions} quizzes × 3 locales; 3 bundles; legacy/custom copy and metadata.`);
