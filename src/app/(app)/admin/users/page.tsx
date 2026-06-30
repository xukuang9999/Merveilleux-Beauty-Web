import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setUserRole } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";
import { getDict } from "@/i18n/server";

const ROLES = ["customer", "distributor", "admin"] as const;

export default async function AdminUsersPage() {
  const me = await requireRole(["admin"]);
  const [rows, dict] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    getDict(),
  ]);
  const d = dict.admin;

  return (
    <>
      <DashHeading
        eyebrow={d.usersEyebrow}
        title={d.usersTitle}
        subtitle={d.usersSub}
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
                    <span className="text-xs text-mid">{d.you}</span>
                  )}
                  {u.status === "pending" && (
                    <span className="ml-2 rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-semibold text-amber">
                      {d.applied}
                    </span>
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
                  {d.update}
                </button>
              </form>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
