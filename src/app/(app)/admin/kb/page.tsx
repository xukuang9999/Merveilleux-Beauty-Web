import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { kbArticles } from "@/db/schema";
import { toggleKbPublished } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";
import { getDict } from "@/i18n/server";

export default async function AdminKbPage() {
  await requireAdmin();
  const [rows, dict] = await Promise.all([
    db.select().from(kbArticles).orderBy(asc(kbArticles.sortOrder)),
    getDict(),
  ]);
  const d = dict.admin;

  return (
    <>
      <DashHeading
        eyebrow={d.kbEyebrow}
        title={d.kbTitle}
        subtitle={d.kbSub}
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
                  className="text-xs font-medium text-bronze hover:underline"
                >
                  {d.view}
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
                    {a.published ? d.published : d.hidden}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-mid">{d.kbTip}</p>
      </Panel>
    </>
  );
}
