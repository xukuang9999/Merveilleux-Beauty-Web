import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { DashHeading, Panel } from "@/components/dash";

export default async function AdminEnquiriesPage() {
  await requireRole(["admin"]);
  const rows = await db
    .select()
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt));

  return (
    <>
      <DashHeading
        eyebrow="Admin · Leads"
        title="Enquiries"
        subtitle="Contact-form submissions from the website."
      />
      <Panel>
        {rows.length === 0 ? (
          <p className="text-sm text-mid">
            No enquiries yet. Submissions from the Contact page appear here.
          </p>
        ) : (
          <div className="divide-y divide-line">
            {rows.map((e) => (
              <div key={e.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-charcoal">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-rose-light/50 px-2.5 py-0.5 text-[11px] font-medium text-rose-deep">
                    {e.interest}
                  </span>
                </div>
                <p className="mt-1 text-xs text-mid">
                  <a
                    href={`mailto:${e.email}`}
                    className="hover:text-charcoal hover:underline"
                  >
                    {e.email}
                  </a>
                  {e.phone ? ` · ${e.phone}` : ""}
                  {" · "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-mid">{e.message}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
