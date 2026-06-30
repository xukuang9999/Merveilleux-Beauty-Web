import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { products, users, enquiries, kbArticles } from "@/db/schema";
import { DashHeading, StatCard, Panel } from "@/components/dash";

export default async function AdminPage() {
  await requireRole(["admin"]);
  const [prod, usr, enq, kb] = await Promise.all([
    db.select().from(products),
    db.select().from(users),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),
    db.select().from(kbArticles),
  ]);
  const distributors = usr.filter((u) => u.role === "distributor").length;

  return (
    <>
      <DashHeading
        eyebrow="Admin"
        title="Control centre"
        subtitle="Manage products, content, distributors and enquiries."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard value={prod.length} label="Products" />
        <StatCard value={usr.length} label="Users" />
        <StatCard value={distributors} label="经销商" />
        <StatCard value={enq.length} label="Enquiries" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminLink href="/admin/products" icon="💄" label="Products" />
        <AdminLink href="/admin/kb" icon="📚" label="Knowledge Base" />
        <AdminLink href="/admin/progress" icon="📈" label="Training Progress" />
        <AdminLink href="/admin/users" icon="👤" label="Users & Roles" />
        <AdminLink href="/admin/enquiries" icon="✉️" label="Enquiries" />
        <AdminLink href="/" icon="🌐" label="View live site" />
      </div>

      <Panel title="Recent enquiries" className="mt-5">
        {enq.length === 0 ? (
          <p className="text-sm text-mid">
            No enquiries yet. New contact-form submissions appear here.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {enq.slice(0, 5).map((e) => (
              <li key={e.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-charcoal">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-rose-light/50 px-2.5 py-0.5 text-[11px] font-medium text-rose-deep">
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
          className="mt-4 inline-block text-sm font-medium text-rose-deep underline"
        >
          View all enquiries →
        </Link>
      </Panel>

      <p className="mt-6 text-xs text-mid">
        Knowledge base: {kb.length} articles ·{" "}
        {kb.filter((k) => k.published).length} published.
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
      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:border-rose-light"
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
