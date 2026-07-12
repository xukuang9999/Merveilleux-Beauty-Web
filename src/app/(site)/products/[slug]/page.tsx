import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container, SectionHeading, Stars } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProduct, getProducts, getTestimonials } from "@/lib/content";
import { productDetails } from "@/lib/seed-data";
import { whatsappLink } from "@/lib/data";
import { getLocale, getDict } from "@/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product" };
  return { title: p.name, description: p.tagline };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts, testimonials, locale, dict] = await Promise.all([
    getProduct(slug),
    getProducts(),
    getTestimonials(),
    getLocale(),
    getDict(),
  ]);
  if (!product) notFound();

  const d = dict.products;
  const detail = productDetails[slug];
  const steps = detail?.howToUse[locale] ?? detail?.howToUse.en ?? [];
  const categoryLabel = detail
    ? d.categories[detail.category as keyof typeof d.categories]
    : undefined;

  // Related: same category first, then fill from the rest of the range.
  const sameCat = allProducts.filter(
    (p) => p.slug !== slug && productDetails[p.slug]?.category === detail?.category,
  );
  const others = allProducts.filter(
    (p) => p.slug !== slug && !sameCat.some((s) => s.slug === p.slug),
  );
  const related = [...sameCat, ...others].slice(0, 4);

  const enquiryMsg = `Hi Merveilleux Beauty, I'd like to enquire about ${product.name} (${product.priceRM}).`;

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line">
        <Container className="py-10 sm:py-14">
          <Link
            href="/products"
            className="text-sm text-mid transition-colors hover:text-charcoal"
          >
            {d.backToProducts}
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <Reveal variant="left">
              <div className="relative mx-auto aspect-[5/6] w-full max-w-sm">
                <Image
                  src={product.graphic}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-contain"
                  priority
                />
              </div>
            </Reveal>

            <Reveal variant="right">
              <div className="flex flex-wrap items-center gap-3">
                {categoryLabel && (
                  <span className="rounded-full border border-line bg-porcelain px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                    {categoryLabel}
                  </span>
                )}
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                  {product.type}
                </p>
              </div>
              <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 text-lg italic text-bronze">
                {product.tagline}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <p className="eyebrow mb-1">{d.priceLabel}</p>
                  <p className="font-serif text-2xl text-charcoal">
                    {product.priceRM}
                  </p>
                </div>
                {detail?.size && (
                  <div>
                    <p className="eyebrow mb-1">{d.size}</p>
                    <p className="text-charcoal">{detail.size}</p>
                  </div>
                )}
              </div>

              {detail?.skinTypes?.length ? (
                <div className="mt-6">
                  <p className="eyebrow mb-2">{d.suitableFor}</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.skinTypes.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-gold-light px-3 py-1 text-xs font-medium text-amber"
                      >
                        {d.skinTypeLabels[k as keyof typeof d.skinTypeLabels]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={whatsappLink(enquiryMsg)} variant="gold" external>
                  {d.enquireNow}
                </Button>
                <Button href="/contact" variant="outline">
                  {dict.common.contactUs}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* OVERVIEW + INGREDIENTS + BENEFITS */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <h2 className="eyebrow mb-3">{d.overview}</h2>
            <p className="text-base leading-relaxed text-mid">
              {product.description}
            </p>

            {steps.length > 0 && (
              <div className="mt-10">
                <h2 className="eyebrow mb-4">{d.howToUse}</h2>
                <ol className="space-y-4">
                  {steps.map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/60 font-serif text-sm text-bronze">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed text-charcoal">
                        {s}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Reveal>

          <Reveal variant="right">
            <div className="rounded-[2px] border border-line bg-porcelain p-7">
              <h3 className="eyebrow mb-3">{d.keyIngredients}</h3>
              <ul className="space-y-1.5">
                {product.keyIngredients.map((ing) => (
                  <li key={ing} className="text-sm text-charcoal">
                    {ing}
                  </li>
                ))}
              </ul>
              <h3 className="eyebrow mb-3 mt-7">{d.benefits}</h3>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-charcoal"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Before / after — placeholder until client photography is loaded */}
            <div className="mt-5 rounded-[2px] border border-dashed border-line bg-cream/60 p-6">
              <h3 className="eyebrow mb-2">{d.resultsTitle}</h3>
              <p className="text-sm leading-relaxed text-mid">{d.resultsNote}</p>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* REVIEWS */}
      {testimonials.length > 0 && (
        <section className="border-y border-line bg-porcelain/60 py-16">
          <Container>
            <div className="mb-8 flex items-center gap-3">
              <Stars />
              <SectionHeading title={d.reviewsTitle} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {testimonials.slice(0, 2).map((t, i) => (
                <Reveal key={t.name} variant={i === 0 ? "left" : "right"}>
                  <figure className="rounded-[2px] border border-line bg-porcelain p-7">
                    <Stars count={t.rating} />
                    <blockquote className="mt-4 font-serif text-lg leading-snug text-charcoal">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-medium text-charcoal">{t.name}</span>
                      <span className="text-mid"> · {t.role}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <Container className="py-16">
          <Reveal>
            <SectionHeading eyebrow={d.eyebrow} title={d.relatedTitle} />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} variant="up" delay={i * 80}>
                <ProductCard product={p} discoverLabel={dict.common.explore} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
