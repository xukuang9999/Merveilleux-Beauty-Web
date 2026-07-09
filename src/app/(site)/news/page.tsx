import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/settings";
import { Container, SectionHeading, Button } from "@/components/ui";
import Reveal from "@/components/Reveal";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/content";
import { getDict, getLocale } from "@/i18n/server";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description:
    "Skin science, new launches and real results from Mérvéilléux — straight from our Instagram @merveilleuxskincare_sbn.",
};

export default async function NewsPage() {
  if (!(await isFeatureEnabled("news"))) notFound();
  const [news, dict, locale] = await Promise.all([
    getNews(),
    getDict(),
    getLocale(),
  ]);
  const n = dict.news;
  const [featured, ...rest] = news;

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow={n.eyebrow} title={n.title} description={n.intro} />
            <Button href={site.instagram} variant="outline" external className="shrink-0">
              {n.followUs}
            </Button>
          </Reveal>
        </Container>
      </section>

      {news.length === 0 ? (
        <Container className="py-20">
          <p className="text-center text-mid">{n.empty}</p>
        </Container>
      ) : (
        <Container className="py-16">
          {/* Featured latest post + first two beside it */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal variant="left">
              <NewsCard
                item={featured}
                locale={locale}
                viewLabel={n.viewPost}
                featured
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {rest.slice(0, 2).map((item, i) => (
                <Reveal key={item.code} variant="right" delay={i * 100}>
                  <NewsCard item={item} locale={locale} viewLabel={n.viewPost} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* The rest */}
          {rest.length > 2 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(2).map((item, i) => (
                <Reveal key={item.code} variant="up" delay={(i % 3) * 90}>
                  <NewsCard item={item} locale={locale} viewLabel={n.viewPost} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      )}

      {/* FOLLOW CTA */}
      <section className="pb-24">
        <Container>
          <Reveal variant="zoom">
            <div className="relative overflow-hidden rounded-[2px] border border-gold/30 bg-onyx-glow p-10 text-center sm:p-14">
              <p className="eyebrow mb-3">{n.handle}</p>
              <h2 className="mx-auto max-w-2xl font-serif text-3xl font-light leading-tight text-charcoal sm:text-4xl">
                {n.followCta}
              </h2>
              <div className="mt-7 flex justify-center">
                <Button href={site.instagram} variant="gold" external>
                  {n.followUs}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
