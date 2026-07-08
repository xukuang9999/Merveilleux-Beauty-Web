import { Button, Container, SectionHeading, Stars, Divider } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import NewsCard from "@/components/NewsCard";
import HeroAvatar from "@/components/HeroAvatar";
import Reveal from "@/components/Reveal";
import Petals from "@/components/Petals";
import Marquee from "@/components/Marquee";
import Counter from "@/components/Counter";
import Image from "next/image";
import { getProducts, getTestimonials, getNews } from "@/lib/content";
import { seedModules } from "@/lib/seed-data";
import { site } from "@/lib/data";
import { getLocale, getDict, fmt } from "@/i18n/server";
import { localizeModule } from "@/i18n/content";

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
  const [products, testimonials, news, locale, dict] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getNews(3),
    getLocale(),
    getDict(),
  ]);
  const d = dict.home;
  const featured = products.slice(0, 4);
  const modules = seedModules
    .slice(0, 4)
    .map((m) => localizeModule(m, locale));
  const years = new Date().getFullYear() - Number(site.established);
  const stats = [
    { value: years, suffix: "+", label: d.statsYears },
    { value: products.length, suffix: "", label: d.statsFormulas },
    { value: seedModules.length, suffix: "", label: d.statsModules },
    { value: 3, suffix: "", label: d.statsLanguages },
  ];
  return (
    <>
      {/* HERO — backlit-onyx wall, halo ceiling light, drifting motes */}
      <section className="bg-onyx-glow relative overflow-hidden">
        <Petals count={9} />
        {/* halo cove-light rings */}
        <div
          aria-hidden
          className="halo pointer-events-none absolute -top-64 left-1/2 h-[560px] w-[560px] -translate-x-1/2"
        />
        <div
          aria-hidden
          className="halo pointer-events-none absolute -top-72 left-1/2 h-[720px] w-[720px] -translate-x-1/2 opacity-60"
          style={{ animationDelay: "-3.5s" }}
        />
        {/* vertical backlit slits, as in the panelled walls */}
        <div aria-hidden className="light-slit absolute inset-y-14 left-8 hidden md:block" />
        <div
          aria-hidden
          className="light-slit absolute inset-y-24 left-12 hidden md:block"
          style={{ animationDelay: "-2.2s" }}
        />
        <div
          aria-hidden
          className="light-slit absolute inset-y-16 right-10 hidden md:block"
          style={{ animationDelay: "-1.4s" }}
        />

        <Container className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-8">
          <div className="rise">
            <p className="wordmark track-in text-xl text-bronze sm:text-2xl">
              Mérvéilléux
            </p>
            <p className="mt-2.5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.55em] text-gold">
              <span aria-hidden className="rule-draw h-px w-12 bg-gold/70" />
              Premium
              <span aria-hidden className="rule-draw h-px w-12 bg-gold/70" />
            </p>
            <h1 className="mt-7 font-serif text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl">
              {d.heroTitleBefore}
              <span className="gradient-text italic">{d.heroTitleHighlight}</span>
              .
            </h1>
            <p className="mt-3 eyebrow">{d.heroEyebrow}</p>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-mid">
              {d.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products">{d.exploreRange}</Button>
              <Button href="/join" variant="outline">
                {d.becomeDistributor}
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <Stars />
              <p className="text-sm text-mid">{d.lovedBy}</p>
            </div>
          </div>

          <div className="rise-2">
            <HeroAvatar dict={dict.chat} />
          </div>
        </Container>

        <div className="pointer-events-none flex justify-center pb-6">
          <Image
            src="/graphics/scroll-cue.svg"
            alt=""
            aria-hidden
            width={28}
            height={46}
            className="float-slow h-11 w-auto opacity-70"
          />
        </div>
      </section>

      {/* INGREDIENT MARQUEE */}
      <section className="border-y border-line bg-porcelain/60 py-6">
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

      {/* PRODUCTS */}
      <section className="py-20">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow={d.collectionEyebrow}
              title={d.collectionTitle}
              description={d.collectionDesc}
            />
            <Button href="/products" variant="outline" className="shrink-0">
              {fmt(d.viewAllProducts, { n: products.length })}
            </Button>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} variant="up" delay={i * 90}>
                <ProductCard product={p} discoverLabel={dict.common.explore} />
              </Reveal>
            ))}
          </div>
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

      {/* NEWS / JOURNAL — latest from Instagram */}
      {news.length > 0 && (
        <section className="border-t border-line bg-porcelain/40 py-20">
          <Container>
            <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow={dict.news.eyebrow}
                title={dict.news.homeTitle}
                description={dict.news.homeIntro}
              />
              <Button href="/news" variant="outline" className="shrink-0">
                {dict.news.allUpdates}
              </Button>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {news.map((item, i) => (
                <Reveal key={item.code} variant="up" delay={i * 90}>
                  <NewsCard
                    item={item}
                    locale={locale}
                    viewLabel={dict.news.viewPost}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* TESTIMONIALS TEASER */}
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

      {/* JOIN / TRAINING CTA */}
      <section className="pb-24">
        <Container>
          <Reveal variant="zoom">
            <div className="relative overflow-hidden rounded-[2px] border border-gold/30 p-10 sm:p-14">
              <Image
                src="/renders/theatre-wide.jpg"
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-porcelain/85" />
              <Petals count={6} />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <p className="eyebrow mb-3">{d.ctaEyebrow}</p>
                  <h2 className="font-serif text-3xl font-light leading-tight text-charcoal sm:text-4xl">
                    {d.ctaTitle}
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-mid">
                    {fmt(d.ctaBody, { n: seedModules.length })}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href="/join">{d.applyToJoin}</Button>
                    <Button href="/training" variant="outline">
                      {d.seeTraining}
                    </Button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {modules.map((m) => (
                    <li
                      key={m.ord}
                      className="flex items-center gap-3 rounded-[2px] border border-line bg-porcelain/80 px-4 py-3 transition-transform duration-300 hover:translate-x-1"
                    >
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {m.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
