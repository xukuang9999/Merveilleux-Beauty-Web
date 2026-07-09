import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { users, trainingProgress, trainingModules } from "@/db/schema";
import { DashHeading, Panel } from "@/components/dash";
import { getDict } from "@/i18n/server";

export default async function AdminProgressPage() {
  await requireAdmin();
  const [allUsers, progress, modules, dict] = await Promise.all([
    db.select().from(users),
    db.select().from(trainingProgress),
    db.select().from(trainingModules),
    getDict(),
  ]);
  const d = dict.admin;
  const total = modules.length;
  const distributors = allUsers.filter(
    (u) => u.role === "distributor" || u.role === "admin",
  );

  return (
    <>
      <DashHeading
        eyebrow={d.progressEyebrow}
        title={d.progressTitle}
        subtitle={d.progressSub}
      />
      <Panel>
        {distributors.length === 0 ? (
          <p className="text-sm text-mid">{d.noDistributors}</p>
        ) : (
          <div className="space-y-4">
            {distributors.map((u) => {
              const mine = progress.filter((p) => p.userId === u.id);
              const done = mine.filter((p) => p.completed).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <div key={u.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-charcoal">
                      {u.name}{" "}
                      <span className="text-xs text-mid">({u.email})</span>
                    </span>
                    <span className="text-mid">
                      {done}/{total} ·{" "}
                      {done === total && total > 0 ? (
                        <span className="font-semibold text-green">
                          {d.certified}
                        </span>
                      ) : (
                        `${pct}%`
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-champagne/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-bronze to-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </>
  );
}
