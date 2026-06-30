import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getKbArticles } from "@/lib/kb";
import { DashHeading } from "@/components/dash";
import KbBrowser from "@/components/KbBrowser";

export default async function KnowledgePage() {
  await requireRole(["distributor", "admin"]);
  const articles = await getKbArticles();

  return (
    <>
      <DashHeading
        eyebrow="知识库 · Knowledge Base"
        title="Skincare knowledge base"
        subtitle="Case studies, ingredient guides and usage tips to help you advise customers with confidence."
      />

      <div className="mb-5 rounded-2xl border border-purple/20 bg-purple-light/40 p-4 text-sm text-charcoal">
        💡 Tip: need a quick answer? Ask the{" "}
        <Link href="/portal/assistant" className="font-medium text-purple underline">
          AI Coach
        </Link>{" "}
        — it&apos;s trained on this knowledge base.
      </div>

      <KbBrowser
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
