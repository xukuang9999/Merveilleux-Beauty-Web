import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/content";
import { getDict, fmt } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the Merveilleux Beauty collection — OEM French-formulated serums, moisturiser, cleanser, essence, sunscreen, eye cream and masks.",
};

export default async function ProductsPage() {
  const [products, dict] = await Promise.all([getProducts(), getDict()]);
  const d = dict.products;

  return (
    <>
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={d.eyebrow} title={d.title} description={d.desc} />
        </Container>
      </section>

      <Container className="py-16">
        <div className="space-y-20">
          {products.map((p, i) => (
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
                <div className="arch-frame relative aspect-[5/6] overflow-hidden border border-line bg-onyx-glow shadow-[0_28px_60px_-36px_rgba(69,61,49,0.5)]">
                  <Image
                    src={p.graphic}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                    {p.type}
                  </p>
                  <span className="rounded-full bg-gold-light px-2.5 py-0.5 text-xs font-medium text-amber">
                    {p.priceRM}
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-4xl font-medium text-charcoal">
                  {p.name}
                </h2>
                <p className="mt-1 text-lg italic text-bronze">{p.tagline}</p>
                <p className="mt-5 text-base leading-relaxed text-mid">
                  {p.description}
                </p>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow mb-3">{d.keyIngredients}</h3>
                    <ul className="space-y-1.5">
                      {p.keyIngredients.map((ing) => (
                        <li key={ing} className="text-sm text-charcoal">
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="eyebrow mb-3">{d.benefits}</h3>
                    <ul className="space-y-1.5">
                      {p.benefits.map((b) => (
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
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={`/products/${p.slug}`}>{d.viewDetails}</Button>
                  <Button href="/contact" variant="outline">
                    {fmt(d.enquireAbout, { name: p.name })}
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
