import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getModules, getUserProgress } from "@/lib/training";
import { DashHeading, StatCard, Panel } from "@/components/dash";

export default async function PortalPage() {
  const user = await requireRole(["distributor", "admin"]);
  const [modules, progress] = await Promise.all([
    getModules(),
    getUserProgress(user.id),
  ]);
  const completed = progress.filter((p) => p.completed).length;
  const total = modules.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;

  return (
    <>
      <DashHeading
        eyebrow="经销商 Portal"
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle="Everything you need to learn the brand, sell with confidence, and serve customers brilliantly."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard value={`${completed}/${total}`} label="Modules done" />
        <StatCard value={`${pct}%`} label="Progress" />
        <StatCard value={70} label="Pass mark" />
        <StatCard value={allDone ? "✓" : "—"} label="Certified" />
      </div>

      {allDone && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green/30 bg-green-light/60 px-5 py-4">
          <span className="text-2xl">🎉</span>
          <p className="text-sm text-charcoal">
            All modules complete! Your in-person training booking link is ready —
            our coordinator (PIC) has been notified.
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <PortalLink
          href="/portal/training"
          icon="🎓"
          title="Training"
          desc="Work through the modules and pass each quiz."
        />
        <PortalLink
          href="/portal/knowledge"
          icon="📚"
          title="Knowledge Base"
          desc="Skincare cases, ingredient guides and usage tips."
        />
        <PortalLink
          href="/portal/assistant"
          icon="✨"
          title="AI Coach & Consult"
          desc="Your AI training coach and skincare consultant."
        />
      </div>

      <Panel title="Continue your training" className="mt-5">
        <ul className="divide-y divide-line">
          {modules.map((m) => {
            const p = progress.find((x) => x.moduleId === m.id);
            return (
              <li
                key={m.id}
                className="flex items-center justify-between gap-4 py-3"
              >
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
                      Best {p.score}%
                    </span>
                  ) : (
                    <span className="text-mid">Not started</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <Link
          href="/portal/training"
          className="mt-4 inline-block text-sm font-medium text-rose-deep underline"
        >
          Go to training →
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
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-rose-light"
    >
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-serif text-xl text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-mid">{desc}</p>
      <span className="mt-3 inline-block text-sm font-medium text-rose-deep">
        Open →
      </span>
    </Link>
  );
}
