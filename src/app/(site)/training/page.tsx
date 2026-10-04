import { localizedPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Button, Container, SectionHeading, Divider } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { seedModules, PASS_MARK } from "@/lib/seed-data";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getDict, fmt } from "@/i18n/server";
import { localizeModule } from "@/i18n/content";

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata("training");
}

export default async function TrainingPage() {
  const [user, locale, dict] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getDict(),
  ]);
  const d = dict.training;
  const isDistributor =
    user &&
    (user.role === "distributor" ||
      user.role === "admin" ||
      user.role === "master_admin");
  const modules = seedModules.map((m) => localizeModule(m, locale));

  const stats: { num?: number; text?: string; label: string }[] = [
    { num: seedModules.length, label: d.statModules },
    { num: PASS_MARK, text: "%", label: d.statPass },
    { text: d.statWindowValue, label: d.statWindow },
    { text: "AI", label: d.statCoach },
  ];

  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-champagne/30 to-gold-light/30 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={d.eyebrow} title={d.title} description={d.desc} />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                variant="up"
                delay={i * 100}
                className="rounded-[2px] border border-line bg-porcelain/70 px-5 py-6 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-serif text-4xl text-bronze">
                  {s.num != null ? (
                    <Counter value={s.num} suffix={s.text ?? ""} />
                  ) : (
                    s.text
                  )}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-mid">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {isDistributor ? (
              <Button href="/portal/training">{d.goToTraining}</Button>
            ) : (
              <>
                <Button href="/register?as=distributor">{d.registerAs}</Button>
                <Button href="/login" variant="outline">
                  {d.loginToStart}
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mb-10 rounded-[2px] border border-blue/20 bg-blue-light/40 p-5 text-sm text-charcoal">
          <span className="font-medium text-blue">{d.loginRequired}</span>{" "}
          {d.loginRequiredBody}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((m, i) => (
            <Reveal
              key={m.ord}
              variant={i % 2 === 0 ? "left" : "right"}
              delay={(i % 2) * 80}
              className="rounded-[2px] border border-line bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-[0_18px_40px_-24px_rgba(69,61,49,0.4)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{m.icon}</span>
                <span className="rounded-full bg-gold-light px-3 py-1 text-[11px] font-semibold text-amber">
                  {fmt(d.moduleN, { n: m.ord })}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-charcoal">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{m.summary}</p>
              <ul className="mt-4 space-y-1.5">
                {m.lessons.map((l) => (
                  <li
                    key={l}
                    className="flex items-start gap-2 text-[13px] text-charcoal"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bronze" />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-xs text-mid">
                {fmt(d.quizPreview, { min: m.durationMins, q: m.quiz.length })}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Divider />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-mid">
            {d.completionNote}
          </p>
        </div>
      </Container>
    </>
  );
}
