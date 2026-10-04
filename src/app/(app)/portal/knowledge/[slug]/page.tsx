import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole, isAdminTier } from "@/lib/auth";
import { getKbArticle, getAdminKbArticle } from "@/lib/kb";
import Markdown from "@/components/Markdown";
import { getDict } from "@/i18n/server";

export default async function KbArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const user = await requireRole(["distributor", "admin", "master_admin"]);
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const preview = query.preview === "1" && isAdminTier(user.role);
  const [article, dict] = await Promise.all([
    preview ? getAdminKbArticle(slug) : getKbArticle(slug),
    getDict(),
  ]);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href={preview ? "/admin/kb" : "/portal/knowledge"}
        className="text-sm text-mid hover:text-charcoal"
      >
        {dict.knowledge.backToKb}
      </Link>
      {preview && article.published === false && (
        <p className="mt-4 rounded-xl border border-line bg-champagne/40 p-3 text-sm text-bronze">
          {dict.admin.hidden}
        </p>
      )}
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
