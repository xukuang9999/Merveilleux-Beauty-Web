import { Button, Container, SectionHeading, Stars, Divider } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import HeroAvatar from "@/components/HeroAvatar";
import Reveal from "@/components/Reveal";
import Petals from "@/components/Petals";
import Marquee from "@/components/Marquee";
import Image from "next/image";
import { getProducts, getTestimonials } from "@/lib/content";
import { seedModules } from "@/lib/seed-data";
import { getLocale, getDict, fmt } from "@/i18n/server";
import { localizeModule } from "@/i18n/content";

const valuePropIcons = ["🌿", "🔬", "🤝"];
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
  const [products, testimonials, locale, dict] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getLocale(),
    getDict(),
  ]);
  const d = dict.home;
  const featured = products.slice(0, 4);
  const modules = seedModules
    .slice(0, 4)
    .map((m) => localizeModule(m, locale));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Petals count={8} />
        <Image
          src="/graphics/pattern.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden
          className="pointer-events-none absolute -right-10 top-10 -z-10 w-[420px] opacity-40"
        />
        <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-8">
          <div className="rise">
            <p className="eyebrow mb-5">{d.heroEyebrow}</p>
            <h1 className="font-serif text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl">
              {d.heroTitleBefore}
              <span className="gradient-text italic">{d.heroTitleHighlight}</span>
              .
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-mid">
              {d.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products">{d.exploreRange}</Button>
              <Button href="/contact" variant="outline">
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
            className="h-11 w-auto opacity-70"
          />
        </div>
      </section>

      {/* INGREDIENT MARQUEE */}
      <section className="border-y border-line bg-white/50 py-6">
        <Marquee items={ingredients} />
      </section>

      {/* VALUE PROPS */}
      <section className="border-b border-line bg-white/60">
        <Container className="grid gap-8 py-14 sm:grid-cols-3">
          {d.valueProps.map((v, i) => (
            <Reveal key={i} delay={i * 120} className="text-center sm:text-left">
              <span className="text-2xl">{valuePropIcons[i]}</span>
              <h3 className="mt-3 font-serif text-xl text-charcoal">{v.title}</h3>
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

      {/* BRAND STATEMENT */}
      <section className="animate-gradient bg-gradient-to-br from-charcoal via-plum to-charcoal py-24 text-cream">
        <Container className="text-center">
          <Divider />
          <Reveal variant="fade">
            <p className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-light leading-snug sm:text-4xl">
              {d.brandQuoteBefore}
              <span className="italic text-gold">{d.brandQuoteHighlight}</span>
              {d.brandQuoteAfter}
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.2em] text-cream/50">
              {d.brandPromise}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* TESTIMONIALS TEASER */}
      <section className="py-20">
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
                <figure className="rounded-2xl border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(74,48,64,0.4)]">
                  <Stars count={t.rating} />
                  <blockquote className="mt-4 font-serif text-xl leading-snug text-charcoal">
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
          <div className="mt-8 text-center">
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
            <div className="relative overflow-hidden rounded-3xl border border-rose-light bg-gradient-to-br from-rose-light/40 to-gold-light/40 p-10 sm:p-14">
              <Petals count={6} />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <p className="eyebrow mb-3">{d.ctaEyebrow}</p>
                  <h2 className="font-serif text-3xl font-medium leading-tight text-charcoal sm:text-4xl">
                    {d.ctaTitle}
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-mid">
                    {fmt(d.ctaBody, { n: seedModules.length })}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href="/register?as=distributor">{d.applyToJoin}</Button>
                    <Button href="/training" variant="outline">
                      {d.seeTraining}
                    </Button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {modules.map((m) => (
                    <li
                      key={m.ord}
                      className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/70 px-4 py-3 transition-transform duration-300 hover:translate-x-1"
                    >
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {m.title}
                        </p>
                        <p className="text-xs text-mid">{m.cnTitle}</p>
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
