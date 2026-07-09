import { Button, Container, SectionHeading, Stars, Divider } from "@/components/ui";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Counter from "@/components/Counter";
import Image from "next/image";
import { getProducts, getTestimonials } from "@/lib/content";
import { getFeatureFlags } from "@/lib/settings";
import { seedModules } from "@/lib/seed-data";
import { site } from "@/lib/data";
import { getDict } from "@/i18n/server";

const ingredients = [
  "Vitamin C",
  "Hyaluronic Acid",
  "Niacinamide",
  "Ceramides",
  "Centella Asiatica",
  "Squalane",
  "Panthenol B5",
  "SPF50+ PA++++",
  "Polyglutamic Acid",
];

export default async function Home() {
  const [products, testimonials, dict, flags] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getDict(),
    getFeatureFlags(),
  ]);
  const d = dict.home;
  const years = new Date().getFullYear() - Number(site.established);
  const stats = [
    { value: years, suffix: "+", label: d.statsYears },
    { value: products.length, suffix: "", label: d.statsFormulas },
    { value: seedModules.length, suffix: "", label: d.statsModules },
    { value: 3, suffix: "", label: d.statsLanguages },
  ];
  return (
    <>
      {/* HERO — cinematic scroll-scrubbed walkthrough of the flagship boutique.
          Scrolling scrubs the clip reception → threshold → consultation →
          treatment suites → relaxation, with copy anchored to each key frame. */}
      <ScrollVideoHero
        eyebrow={d.heroEyebrow}
        titleBefore={d.heroTitleBefore}
        titleHighlight={d.heroTitleHighlight}
        body={d.heroBody}
        exploreLabel={d.exploreRange}
        joinLabel={d.becomeDistributor}
        lovedBy={d.lovedBy}
        scrollHint={d.heroReel.scrollHint}
        chapters={d.heroReel.chapters}
      />

      {/* Dissolve bridge — the boutique footage melts up into the page so the
          film and the content below read as one continuous scroll, not a video
          you finish and then a wall of text. The negative margin overlaps the
          hero's final frames; the gradient fades them into the page. */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 -mt-[42vh] h-[42vh] bg-gradient-to-b from-transparent via-porcelain/40 to-porcelain"
      />

      {/* INGREDIENT MARQUEE */}
      <section className="relative z-10 border-b border-line bg-porcelain/60 py-6">
        <Marquee items={ingredients} />
      </section>

      {/* VALUE PROPS — numbered like suite doors */}
      <section className="border-b border-line bg-porcelain/50">
        <Container className="grid gap-10 py-16 sm:grid-cols-3">
          {d.valueProps.map((v, i) => (
            <Reveal key={i} delay={i * 130} className="text-center sm:text-left">
              <p className="flex items-baseline justify-center gap-3 sm:justify-start">
                <span className="font-serif text-3xl font-light text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px w-10 self-center bg-gold/50" />
              </p>
              <h3 className="mt-3 font-serif text-xl font-light text-charcoal">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mid">{v.body}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* STATS — marble band */}
      <section className="bg-marble border-y border-line">
        <Container className="grid grid-cols-2 gap-8 py-14 text-center lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 110}>
              <p className="font-serif text-5xl font-light text-bronze">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-mid">
                {s.label}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* FLAGSHIP RENDER REEL — drifting views of the boutique */}
      <section
        className="overflow-hidden border-b border-line bg-porcelain/40 py-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-marquee gap-5 pr-5"
          style={{ ["--marquee-duration" as string]: "60s" }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 gap-5">
              {[
                "corridor",
                "suites",
                "vanity",
                "staircase",
                "atelier",
                "portraits",
                "nook",
                "marble-sign",
              ].map((r) => (
                <div
                  key={r}
                  className="arch-frame-tight relative h-60 w-44 shrink-0 overflow-hidden border border-line sm:h-72 sm:w-52"
                >
                  <Image
                    src={`/renders/${r}.jpg`}
                    alt=""
                    fill
                    sizes="208px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STATEMENT — over the bronze water-feature render */}
      <section className="relative overflow-hidden py-24 text-cream">
        <Image
          src="/renders/water-wall.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="ken-burns object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-umber/72" />
        <div
          aria-hidden
          className="water-wall absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{ backgroundColor: "transparent" }}
        />
        <div
          aria-hidden
          className="halo pointer-events-none absolute -top-72 left-1/2 h-[640px] w-[640px] -translate-x-1/2 opacity-40"
        />
        <Container className="relative text-center">
          <Divider />
          <Reveal variant="fade">
            <p className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-light leading-snug sm:text-4xl">
              {d.brandQuoteBefore}
              <span className="italic text-[#c8b389]">{d.brandQuoteHighlight}</span>
              {d.brandQuoteAfter}
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.35em] text-cream/50">
              {d.brandPromise}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* FLAGSHIP EXPERIENCE — the Dataran Sunway facade */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <Reveal variant="left">
            <SectionHeading
              eyebrow={d.flagshipEyebrow}
              title={d.flagshipTitle}
              description={d.flagshipBody}
            />
            <ul className="mt-8 space-y-5">
              {d.flagshipPoints.map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-serif text-lg font-light leading-6 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium tracking-wide text-charcoal">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-mid">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
              {d.flagshipLocation}
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="outline">
                {d.flagshipCta}
              </Button>
            </div>
          </Reveal>

          {/* The real Dataran Sunway facade render + interior views */}
          <Reveal variant="right">
            <div className="mx-auto grid w-full max-w-md grid-cols-[1.15fr_1fr] items-end gap-4">
              <div className="arch-frame relative aspect-[570/1100] overflow-hidden border border-gold/40 shadow-[0_36px_70px_-38px_rgba(69,61,49,0.6)]">
                <Image
                  src="/renders/facade.jpg"
                  alt="Bellesenze @ Dataran Sunway — flagship facade"
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="ken-burns object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="arch-frame-tight relative h-44 overflow-hidden border border-line shadow-[0_24px_50px_-30px_rgba(69,61,49,0.55)] sm:h-52">
                  <Image
                    src="/renders/suites.jpg"
                    alt="Private treatment suites"
                    fill
                    sizes="200px"
                    className="ken-burns object-cover"
                    style={{ animationDelay: "-6s" }}
                  />
                </div>
                <div className="arch-frame-tight relative h-44 overflow-hidden border border-line shadow-[0_24px_50px_-30px_rgba(69,61,49,0.55)] sm:h-52">
                  <Image
                    src="/renders/atelier.jpg"
                    alt="Product atelier"
                    fill
                    sizes="200px"
                    className="ken-burns object-cover"
                    style={{ animationDelay: "-12s" }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>


      {/* TESTIMONIALS TEASER */}
      {flags.testimonials && (
      <section className="border-t border-line py-20">
        <Container>
          <Reveal>
            <SectionHeading
              center
              eyebrow={d.testimonialsEyebrow}
              title={d.testimonialsTitle}
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonials.slice(0, 2).map((t, i) => (
              <Reveal key={t.name} variant={i === 0 ? "left" : "right"}>
                <figure className="bg-marble rounded-[2px] border border-line p-8 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(69,61,49,0.5)]">
                  <Stars count={t.rating} />
                  <blockquote className="mt-4 font-serif text-xl font-light leading-snug text-charcoal">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-medium text-charcoal">{t.name}</span>
                    <span className="text-mid"> · {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/testimonials" variant="outline">
              {d.readMoreStories}
            </Button>
          </div>
        </Container>
      </section>
      )}
    </>
  );
}
