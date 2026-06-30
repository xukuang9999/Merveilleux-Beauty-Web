import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setUserRole } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";

const ROLES = ["customer", "distributor", "admin"] as const;

export default async function AdminUsersPage() {
  const me = await requireRole(["admin"]);
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <>
      <DashHeading
        eyebrow="Admin · People"
        title="Users & roles"
        subtitle="Promote customers to 经销商, or grant admin access."
      />
      <Panel>
        <div className="divide-y divide-line">
          {rows.map((u) => (
            <div
              key={u.id}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {u.name}{" "}
                  {u.id === me.id && (
                    <span className="text-xs text-mid">(you)</span>
                  )}
                </p>
                <p className="text-xs text-mid">{u.email}</p>
              </div>
              <form action={setUserRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select
                  name="role"
                  defaultValue={u.role}
                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-rose-deep"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-medium text-cream hover:bg-plum">
                  Update
                </button>
              </form>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
