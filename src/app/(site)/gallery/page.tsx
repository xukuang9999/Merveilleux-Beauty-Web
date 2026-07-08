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

  const flagshipRenders: {
    src: string;
    caption: string;
    portrait?: boolean;
  }[] = [
    { src: "facade", caption: g.rooms.facade, portrait: true },
    { src: "reception", caption: g.rooms.reception },
    { src: "counter", caption: g.rooms.counter },
    { src: "corridor", caption: g.rooms.corridor, portrait: true },
    { src: "water-wall", caption: g.rooms.waterWall },
    { src: "suites", caption: g.rooms.suites },
    { src: "staircase", caption: g.rooms.staircase, portrait: true },
    { src: "atelier", caption: g.rooms.atelier },
    { src: "theatre", caption: g.rooms.theatre },
    { src: "vanity", caption: g.rooms.vanity, portrait: true },
    { src: "portraits", caption: g.rooms.portraits },
    { src: "lounge", caption: g.rooms.lounge },
    { src: "marble-sign", caption: g.rooms.marbleSign, portrait: true },
    { src: "nook", caption: g.rooms.nook },
  ];

  return (
    <>
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={g.eyebrow}
              title={g.flagshipTitle}
              description={g.flagshipIntro}
            />
          </Reveal>
        </Container>
      </section>

      {/* Flagship renders — masonry of proposal views */}
      <Container className="py-16">
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {flagshipRenders.map((r, i) => (
            <Reveal key={r.src} variant="up" delay={(i % 3) * 80}>
              <figure className="group relative overflow-hidden rounded-[2px] border border-line break-inside-avoid">
                <div
                  className={`relative w-full ${
                    r.portrait ? "aspect-[7/10]" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={`/renders/${r.src}.jpg`}
                    alt={r.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-umber/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-[11px] font-medium uppercase tracking-[0.22em] text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {r.caption}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="border-t border-line bg-porcelain/40 py-16">
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
                className="group block overflow-hidden rounded-[2px] border border-line bg-porcelain"
              >
                <div className="relative aspect-[5/6] overflow-hidden bg-onyx-glow">
                  <Image
                    src={p.graphic}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold">
                    {p.type}
                  </p>
                  <h3 className="mt-1 font-serif text-lg leading-tight text-charcoal">
                    {p.name}
                  </h3>
                  <span className="mt-2 inline-block text-[13px] font-medium text-bronze opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
