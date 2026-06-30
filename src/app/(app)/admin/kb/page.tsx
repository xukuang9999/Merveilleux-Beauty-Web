import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { kbArticles } from "@/db/schema";
import { toggleKbPublished } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";

export default async function AdminKbPage() {
  await requireRole(["admin"]);
  const rows = await db
    .select()
    .from(kbArticles)
    .orderBy(asc(kbArticles.sortOrder));

  return (
    <>
      <DashHeading
        eyebrow="Admin · 知识库"
        title="Knowledge base"
        subtitle="The skincare knowledge base powering the 经销商 portal and the AI assistant."
      />
      <Panel>
        <div className="divide-y divide-line">
          {rows.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-charcoal">{a.title}</p>
                <p className="text-xs text-mid">{a.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/portal/knowledge/${a.slug}`}
                  className="text-xs font-medium text-rose-deep hover:underline"
                >
                  View
                </Link>
                <form action={toggleKbPublished}>
                  <input type="hidden" name="id" value={a.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(a.published)}
                  />
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.published
                        ? "bg-green-light text-green"
                        : "bg-cream text-mid"
                    }`}
                  >
                    {a.published ? "Published" : "Hidden"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-mid">
          Tip: KB content is seeded from the curated library. Click a status to
          show/hide an article.
        </p>
      </Panel>
    </>
  );
}
