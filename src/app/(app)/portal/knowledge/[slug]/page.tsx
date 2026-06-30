import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getKbArticle } from "@/lib/kb";
import Markdown from "@/components/Markdown";

export default async function KbArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole(["distributor", "admin"]);
  const { slug } = await params;
  const article = await getKbArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/portal/knowledge"
        className="text-sm text-mid hover:text-charcoal"
      >
        ← Back to knowledge base
      </Link>
      <p className="eyebrow mt-4">{article.category}</p>
      <h1 className="mt-2 font-serif text-3xl font-medium text-charcoal sm:text-4xl">
        {article.title}
      </h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {article.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-mid"
          >
            #{t}
          </span>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
        <Markdown content={article.body} />
      </div>
    </article>
  );
}
