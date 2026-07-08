import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Markdown from "@/components/Markdown";
import { getArticle, getArticles } from "@/lib/content";
import { getDict } from "@/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArticle(slug);
  if (!art) return { title: "Skincare Tips" };
  return { title: art.title, description: art.excerpt };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, all, dict] = await Promise.all([
    getArticle(slug),
    getArticles(),
    getDict(),
  ]);
  if (!article) notFound();

  const b = dict.blog;
  const related = all.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <Container className="py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm text-mid transition-colors hover:text-charcoal"
        >
          {b.backToBlog}
        </Link>
        <p className="eyebrow mt-4">{article.category}</p>
        <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-charcoal sm:text-4xl">
          {article.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-mid"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="mt-6 rounded-[2px] border border-line bg-porcelain p-6 sm:p-8">
          <Markdown content={article.body} />
        </div>
      </article>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="eyebrow mb-6 text-center">{b.relatedTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((art, i) => (
              <Reveal key={art.slug} variant="up" delay={i * 80}>
                <Link
                  href={`/blog/${art.slug}`}
                  className="flex h-full flex-col rounded-[2px] border border-line bg-porcelain p-5 transition-all duration-300 hover:-translate-y-1 hover:border-champagne"
                >
                  <p className="eyebrow">{art.category}</p>
                  <h3 className="mt-2 font-serif text-lg leading-snug text-charcoal">
                    {art.title}
                  </h3>
                  <span className="mt-3 text-[13px] font-medium text-bronze">
                    {b.readArticle}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
