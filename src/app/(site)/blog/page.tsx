import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getArticles } from "@/lib/content";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Skincare Tips",
  description:
    "Practical skincare tips, routines and ingredient guides from the Merveilleux team.",
};

export default async function BlogPage() {
  const [articles, dict] = await Promise.all([getArticles(), getDict()]);
  const b = dict.blog;

  return (
    <>
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow={b.eyebrow} title={b.title} description={b.intro} />
          </Reveal>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((art, i) => (
            <Reveal key={art.slug} variant="up" delay={(i % 3) * 80}>
              <Link
                href={`/blog/${art.slug}`}
                className="flex h-full flex-col rounded-[2px] border border-line bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-[0_18px_40px_-24px_rgba(69,61,49,0.4)]"
              >
                <p className="eyebrow">{art.category}</p>
                <h2 className="mt-2 font-serif text-xl leading-snug text-charcoal">
                  {art.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mid">
                  {art.excerpt}
                </p>
                <span className="mt-4 text-[13px] font-medium text-bronze">
                  {b.readArticle}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <Reveal variant="fade">
            <div className="rounded-[2px] water-wall relative overflow-hidden p-10 text-center text-cream sm:p-14">
              <h2 className="font-serif text-3xl font-light sm:text-4xl">
                {b.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-cream/70">{b.ctaBody}</p>
              <div className="mt-7 flex justify-center">
                <Button href="/contact" variant="gold">
                  {dict.common.contactUs}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
