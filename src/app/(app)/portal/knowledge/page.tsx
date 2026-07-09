import { requireRole } from "@/lib/auth";
import { getKbArticles } from "@/lib/kb";
import { DashHeading } from "@/components/dash";
import KbBrowser from "@/components/KbBrowser";
import { getDict } from "@/i18n/server";

export default async function KnowledgePage() {
  await requireRole(["distributor", "admin", "master_admin"]);
  const [articles, dict] = await Promise.all([getKbArticles(), getDict()]);
  const d = dict.knowledge;

  return (
    <>
      <DashHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.sub} />

      <div className="mb-5 rounded-2xl border border-purple/20 bg-purple-light/40 p-4 text-sm text-charcoal">
        💡 {d.tip}
      </div>

      <KbBrowser
        dict={d}
        articles={articles.map((a) => ({
          slug: a.slug,
          title: a.title,
          category: a.category,
          excerpt: a.excerpt,
          tags: a.tags,
        }))}
      />
    </>
  );
}
