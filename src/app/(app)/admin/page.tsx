import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { products, users, enquiries, kbArticles } from "@/db/schema";
import { DashHeading, StatCard, Panel } from "@/components/dash";
import { getDict, fmt } from "@/i18n/server";

export default async function AdminPage() {
  await requireRole(["admin"]);
  const [prod, usr, enq, kb, dict] = await Promise.all([
    db.select().from(products),
    db.select().from(users),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),
    db.select().from(kbArticles),
    getDict(),
  ]);
  const d = dict.admin;
  const distributors = usr.filter((u) => u.role === "distributor").length;

  return (
    <>
      <DashHeading
        eyebrow={d.eyebrowDashboard}
        title={d.dashboardTitle}
        subtitle={d.dashboardSub}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard value={prod.length} label={d.statProducts} />
        <StatCard value={usr.length} label={d.statUsers} />
        <StatCard value={distributors} label={d.statDistributors} />
        <StatCard value={enq.length} label={d.statEnquiries} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminLink href="/admin/products" icon="💄" label={d.linkProducts} />
        <AdminLink href="/admin/kb" icon="📚" label={d.linkKb} />
        <AdminLink href="/admin/progress" icon="📈" label={d.linkProgress} />
        <AdminLink href="/admin/users" icon="👤" label={d.linkUsers} />
        <AdminLink href="/admin/enquiries" icon="✉️" label={d.linkEnquiries} />
        <AdminLink href="/" icon="🌐" label={d.viewLiveSite} />
      </div>

      <Panel title={d.recentEnquiries} className="mt-5">
        {enq.length === 0 ? (
          <p className="text-sm text-mid">{d.noEnquiries}</p>
        ) : (
          <ul className="divide-y divide-line">
            {enq.slice(0, 5).map((e) => (
              <li key={e.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-charcoal">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-champagne/50 px-2.5 py-0.5 text-[11px] font-medium text-bronze">
                    {e.interest}
                  </span>
                </div>
                <p className="mt-1 text-xs text-mid">
                  {e.email}
                  {e.phone ? ` · ${e.phone}` : ""}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-mid">{e.message}</p>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/admin/enquiries"
          className="mt-4 inline-block text-sm font-medium text-bronze underline"
        >
          {d.viewAllEnquiries}
        </Link>
      </Panel>

      <p className="mt-6 text-xs text-mid">
        {fmt(d.kbSummary, {
          total: kb.length,
          published: kb.filter((k) => k.published).length,
        })}
      </p>
    </>
  );
}

function AdminLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:border-champagne"
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
