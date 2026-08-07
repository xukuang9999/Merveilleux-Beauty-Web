import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button, Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import PriceBlock from "@/components/PriceBlock";
import { getProducts } from "@/lib/content";
import { productDetails } from "@/lib/seed-data";
import { productCategories } from "@/lib/categories";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the Merveilleux Beauty collection — French-formulated serums, moisturiser, cleanser, essence, sunscreen, eye cream and masks.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, dict, sp] = await Promise.all([
    getProducts(),
    getDict(),
    searchParams,
  ]);
  const d = dict.products;

  // Only categories that actually have (published) products appear in the nav;
  // empty ones auto-hide. Shown in the canonical order from categories.ts.
  const present = productCategories.filter((c) =>
    products.some((p) => p.category === c.slug),
  );
  const active = present.some((c) => c.slug === sp.category)
    ? sp.category!
    : null;
  const shown = active ? products.filter((p) => p.category === active) : products;

  const pill = (on: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
      on
        ? "bg-charcoal text-cream"
        : "border border-line text-mid hover:border-gold/50 hover:text-charcoal"
    }`;

  return (
    <>
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={d.eyebrow} title={d.title} description={d.desc} />
        </Container>
      </section>

      {present.length > 1 && (
        <Container className="pt-10">
          <nav
            aria-label="Product categories"
            className="flex flex-wrap items-center gap-2"
          >
            <Link href="/products" className={pill(active === null)}>
              {d.allCategories}
            </Link>
            {present.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={pill(active === c.slug)}
              >
                {d.categories[c.slug as keyof typeof d.categories]}
              </Link>
            ))}
          </nav>
        </Container>
      )}

      <Container className="py-16">
        <div className="space-y-20">
          {shown.map((p, i) => (
            <Reveal key={p.slug} variant={i % 2 === 1 ? "right" : "left"}>
            <article
              id={p.slug}
              className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2"
            >
              <div
                className={`relative mx-auto w-full max-w-sm ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="relative aspect-[5/6]">
                  <Image
                    src={p.graphic}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                  {p.type}
                </p>
                <h2 className="mt-2 font-serif text-4xl font-medium text-charcoal">
                  {p.name}
                </h2>

                <div className="mt-6 flex flex-wrap items-start gap-x-10 gap-y-3">
                  <PriceBlock
                    priceRM={p.priceRM}
                    priceRMEast={p.priceRMEast}
                    labels={{
                      priceLabel: d.priceLabel,
                      west: d.priceWest,
                      east: d.priceEast,
                    }}
                  />
                  {productDetails[p.slug]?.size && (
                    <div>
                      <p className="eyebrow mb-1">{d.size}</p>
                      <p className="text-charcoal">
                        {productDetails[p.slug]!.size}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <Button href={`/products/${p.slug}`}>
                    {d.clickForDetails}
                  </Button>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2px] p-10 text-center text-cream sm:p-14">
            <Image
              src="/renders/atelier.jpg"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="ken-burns object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-umber/75" />
            <h2 className="relative font-serif text-3xl font-light sm:text-4xl">
              {d.deckTitle}
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-cream/80">{d.deckBody}</p>
            <div className="relative mt-7 flex justify-center">
              <Button href="/contact" variant="gold">
                {dict.common.getInTouch}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
