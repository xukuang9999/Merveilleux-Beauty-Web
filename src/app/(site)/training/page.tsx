import type { Metadata } from "next";
import { Button, Container, SectionHeading, Divider } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { seedModules, PASS_MARK } from "@/lib/seed-data";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "经销商 Training Programme",
  description:
    "The Merveilleux Beauty distributor training programme — structured modules on brand, products, policy and SOP, each ending with a quiz, plus an AI training coach.",
};

const stats: { num?: number; text?: string; label: string }[] = [
  { num: seedModules.length, label: "Training modules" },
  { num: PASS_MARK, text: "%", label: "Pass mark per quiz" },
  { text: "2 wks", label: "Completion window" },
  { text: "AI", label: "Training coach" },
];

export default async function TrainingPage() {
  const user = await getCurrentUser();
  const isDistributor =
    user && (user.role === "distributor" || user.role === "admin");

  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-rose-light/30 to-gold-light/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Workstream A · 经销商 Onboarding"
            title="The Merveilleux Training Portal"
            description="Every distributor completes a structured, self-paced programme — with progress tracking, quizzes and an AI coach — before their in-person session."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                variant="up"
                delay={i * 100}
                className="rounded-2xl border border-line bg-white/70 px-5 py-6 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-serif text-4xl text-rose-deep">
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
              <Button href="/portal/training">Go to your training →</Button>
            ) : (
              <>
                <Button href="/register?as=distributor">
                  Register as 经销商
                </Button>
                <Button href="/login" variant="outline">
                  Log in to start
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mb-10 rounded-2xl border border-blue/20 bg-blue-light/40 p-5 text-sm text-charcoal">
          <span className="font-medium text-blue">Login required.</span> The
          interactive training — video lessons, 20-question quizzes, saved
          progress, certificates and your AI training coach — lives inside the
          secure 经销商 portal. Here&apos;s what you&apos;ll cover:
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {seedModules.map((m, i) => (
            <Reveal
              key={m.ord}
              variant={i % 2 === 0 ? "left" : "right"}
              delay={(i % 2) * 80}
              className="rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-light hover:shadow-[0_18px_40px_-24px_rgba(74,48,64,0.4)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{m.icon}</span>
                <span className="rounded-full bg-gold-light px-3 py-1 text-[11px] font-semibold text-amber">
                  Module {m.ord}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-charcoal">
                {m.title}
              </h3>
              <p className="text-sm text-mid">{m.cnTitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-mid">
                {m.summary}
              </p>
              <ul className="mt-4 space-y-1.5">
                {m.lessons.map((l) => (
                  <li
                    key={l}
                    className="flex items-start gap-2 text-[13px] text-charcoal"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-deep" />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-xs text-mid">
                ~{m.durationMins} min · {m.quiz.length}-question quiz preview
                (full bank in portal)
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Divider />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-mid">
            On completing all modules, the portal notifies the training
            coordinator (PIC) and unlocks an in-person booking calendar — exactly
            as outlined in the Workstream A plan.
          </p>
        </div>
      </Container>
    </>
  );
}
