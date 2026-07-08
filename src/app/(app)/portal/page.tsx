import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getModules, getUserProgress } from "@/lib/training";
import { DashHeading, StatCard, Panel } from "@/components/dash";
import { getDict, fmt } from "@/i18n/server";

export default async function PortalPage() {
  const user = await requireRole(["distributor", "admin"]);
  const [modules, progress, dict] = await Promise.all([
    getModules(),
    getUserProgress(user.id),
    getDict(),
  ]);
  const d = dict.portal;
  const completed = progress.filter((p) => p.completed).length;
  const total = modules.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;

  return (
    <>
      <DashHeading
        eyebrow={d.eyebrow}
        title={fmt(d.welcome, { name: user.name.split(" ")[0] })}
        subtitle={d.sub}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard value={`${completed}/${total}`} label={d.statModulesDone} />
        <StatCard value={`${pct}%`} label={d.statProgress} />
        <StatCard value={70} label={d.statPass} />
        <StatCard value={allDone ? "✓" : "—"} label={d.statCertified} />
      </div>

      {allDone && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green/30 bg-green-light/60 px-5 py-4">
          <span className="text-2xl">🎉</span>
          <p className="text-sm text-charcoal">{d.allDone}</p>
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <PortalLink
          href="/portal/training"
          icon="🎓"
          title={d.linkTrainingTitle}
          desc={d.linkTrainingDesc}
          open={d.open}
        />
        <PortalLink
          href="/portal/knowledge"
          icon="📚"
          title={d.linkKbTitle}
          desc={d.linkKbDesc}
          open={d.open}
        />
        <PortalLink
          href="/portal/assistant"
          icon="✨"
          title={d.linkAiTitle}
          desc={d.linkAiDesc}
          open={d.open}
        />
      </div>

      <Panel title={d.continueTraining} className="mt-5">
        <ul className="divide-y divide-line">
          {modules.map((m) => {
            const p = progress.find((x) => x.moduleId === m.id);
            return (
              <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-3">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-sm font-medium text-charcoal">
                    {m.title}
                  </span>
                </span>
                <span className="text-xs">
                  {p?.completed ? (
                    <span className="rounded-full bg-green-light px-3 py-1 font-semibold text-green">
                      ✓ {p.score}%
                    </span>
                  ) : p ? (
                    <span className="rounded-full bg-amber-light px-3 py-1 font-semibold text-amber">
                      {fmt(d.best, { n: p.score })}
                    </span>
                  ) : (
                    <span className="text-mid">{d.notStarted}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <Link
          href="/portal/training"
          className="mt-4 inline-block text-sm font-medium text-bronze underline"
        >
          {d.goToTraining}
        </Link>
      </Panel>
    </>
  );
}

function PortalLink({
  href,
  icon,
  title,
  desc,
  open,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  open: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-champagne"
    >
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-serif text-xl text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-mid">{desc}</p>
      <span className="mt-3 inline-block text-sm font-medium text-bronze">
        {open}
      </span>
    </Link>
  );
}
