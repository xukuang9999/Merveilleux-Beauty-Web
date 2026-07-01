import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/content";
import { seedBundles } from "@/lib/seed-data";
import { whatsappLink } from "@/lib/data";
import { getDict, fmt } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Promotions & Bundles",
  description:
    "Save with curated Merveilleux skincare sets — brightening, hydration and complete-routine bundles.",
};

export default async function PromotionsPage() {
  const [products, dict] = await Promise.all([getProducts(), getDict()]);
  const p = dict.promotions;
  const nameBySlug = new Map(products.map((pr) => [pr.slug, pr.name]));

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-white/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.intro} />
          </Reveal>
        </Container>
      </section>

      {/* BUNDLES */}
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {seedBundles.map((b, i) => {
            const copy = p.bundles[i];
            const items = b.productSlugs.map((s) => nameBySlug.get(s) ?? s);
            return (
              <Reveal key={b.slug} variant="up" delay={i * 100}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-cream to-rose-light/30">
                    <Image
                      src={b.graphic}
                      alt={copy.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-6"
                    />
                    {copy.tag && (
                      <span className="absolute left-4 top-4 rounded-full bg-charcoal px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-cream">
                        {copy.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-2xl text-charcoal">
                      {copy.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mid">
                      {copy.desc}
                    </p>

                    <p className="eyebrow mb-2 mt-5">{p.includes}</p>
                    <ul className="space-y-1.5">
                      {items.map((n) => (
                        <li
                          key={n}
                          className="flex items-start gap-2 text-sm text-charcoal"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-deep" />
                          {n}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-end gap-3">
                      <span className="font-serif text-3xl text-charcoal">
                        {b.priceRM}
                      </span>
                      <span className="pb-1 text-sm text-mid line-through">
                        {fmt(p.wasLabel, { price: b.wasRM })}
                      </span>
                    </div>
                    <span className="mt-1 inline-block w-fit rounded-full bg-green-light px-2.5 py-0.5 text-xs font-medium text-green">
                      {fmt(p.save, { amount: b.saveRM })}
                    </span>

                    <div className="mt-6">
                      <Button
                        href={whatsappLink(
                          `Hi Merveilleux Beauty, I'd like to enquire about the ${copy.title} (${b.priceRM}).`,
                        )}
                        variant="gold"
                        external
                        className="w-full"
                      >
                        {p.enquire}
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>

      {/* NOTE */}
      <section className="pb-24">
        <Container>
          <Reveal variant="fade">
            <div className="rounded-3xl border border-gold/30 bg-gold-light/40 p-8 text-center sm:p-10">
              <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
                {p.noteTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mid">
                {p.noteBody}
              </p>
              <div className="mt-6 flex justify-center">
                <Button href="/join">{dict.nav.joinUs}</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
