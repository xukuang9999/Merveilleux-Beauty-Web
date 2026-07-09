import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, SectionHeading, Divider } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getCopy } from "@/lib/settings";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Merveilleux — an OEM French-standard skincare house by Bellesenze Group, made in Malaysia since 2014.",
};

export default async function AboutPage() {
  const [dict, copy] = await Promise.all([getDict(), getCopy()]);
  const a = dict.about;

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={copy("about.eyebrow", a.eyebrow)}
              title={copy("about.title", a.title)}
              description={copy("about.intro", a.intro)}
            />
          </Reveal>
        </Container>
      </section>

      {/* STORY */}
      <Container className="py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="relative">
              <div className="arch-frame relative aspect-[4/5] overflow-hidden border border-gold/40 shadow-[0_36px_70px_-38px_rgba(69,61,49,0.55)]">
                <Image
                  src="/renders/counter.jpg"
                  alt="Mérvéilléux Premium reception counter"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="ken-burns object-cover"
                />
              </div>
              <div className="arch-frame-tight absolute -bottom-6 -right-3 hidden h-48 w-36 overflow-hidden border-2 border-cream shadow-[0_28px_50px_-24px_rgba(69,61,49,0.6)] sm:block">
                <Image
                  src="/renders/lounge.jpg"
                  alt="Reception lounge"
                  fill
                  sizes="144px"
                  className="ken-burns object-cover"
                  style={{ animationDelay: "-8s" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal variant="right">
            <h2 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">
              {a.storyTitle}
            </h2>
            <div className="mt-5 space-y-4">
              {a.story.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-mid">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>

      {/* VALUES */}
      <section className="border-y border-line bg-porcelain/60 py-16">
        <Container>
          <Reveal>
            <SectionHeading center eyebrow={a.eyebrow} title={a.valuesTitle} />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {a.values.map((v, i) => (
              <Reveal key={i} variant="up" delay={i * 110}>
                <div className="h-full rounded-[2px] border border-line bg-porcelain p-7">
                  <span className="font-serif text-3xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-xl text-charcoal">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mid">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* STATS */}
      <Container className="py-16">
        <Reveal variant="fade">
          <Divider />
          <p className="mt-4 text-center eyebrow">{a.statsTitle}</p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {a.stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-4xl text-charcoal sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-mid">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <Reveal variant="zoom">
            <div className="rounded-[2px] water-wall relative overflow-hidden p-10 text-center text-cream sm:p-14">
              <h2 className="font-serif text-3xl font-light sm:text-4xl">
                {a.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-cream/70">{a.ctaBody}</p>
              <div className="mt-7 flex justify-center">
                <Button href="/join" variant="gold">
                  {a.ctaButton}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
