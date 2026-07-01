import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/content";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual look at the Merveilleux collection — clean formulas and considered design.",
};

export default async function GalleryPage() {
  const [products, dict] = await Promise.all([getProducts(), getDict()]);
  const g = dict.gallery;

  return (
    <>
      <section className="border-b border-line bg-white/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow={g.eyebrow} title={g.title} description={g.intro} />
          </Reveal>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} variant="up" delay={(i % 4) * 70}>
              <Link
                href={`/products/${p.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-cream to-rose-light/30">
                  <Image
                    src={p.graphic}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold">
                    {p.type}
                  </p>
                  <h3 className="mt-1 font-serif text-lg leading-tight text-charcoal">
                    {p.name}
                  </h3>
                  <span className="mt-2 inline-block text-[13px] font-medium text-rose-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {g.viewProduct}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
