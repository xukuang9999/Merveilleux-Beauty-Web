import type { Metadata } from "next";
import { Container, SectionHeading, Divider } from "@/components/ui";
import TrainingShell from "@/components/TrainingShell";
import { trainingModules, PASS_MARK } from "@/lib/data";

export const metadata: Metadata = {
  title: "经销商 Training Portal",
  description:
    "The Merveilleux Beauty distributor training programme — structured modules on brand, products, policy and SOP, each ending with a quiz.",
};

const stats = [
  { value: `${trainingModules.length}`, label: "Training modules" },
  { value: `${PASS_MARK}`, label: "Pass mark per quiz" },
  { value: "2 wks", label: "Completion window" },
  { value: "1-on-1", label: "In-person session" },
];

export default function TrainingPage() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-rose-light/30 to-gold-light/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Workstream A · 经销商 Onboarding"
            title="The Merveilleux Training Portal"
            description="Every distributor completes a structured, self-paced programme before their in-person session — so they sell with confidence and stay on-brand."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-white/70 px-5 py-6 text-center"
              >
                <p className="font-serif text-4xl text-rose-deep">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-mid">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mb-10 rounded-2xl border border-blue/20 bg-blue-light/40 p-5 text-sm text-charcoal">
          <span className="font-medium text-blue">Preview · MVP shell.</span>{" "}
          This is an interactive preview of the training experience — try a demo
          quiz below. The production portal adds secure 经销商 login, full
          20-question banks, video lessons, progress saved to your account, PIC
          completion notifications and automated in-person booking.
        </div>

        <TrainingShell />

        <div className="mt-16">
          <Divider />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-mid">
            On completing all modules, the live portal notifies the training
            coordinator (PIC) and unlocks an in-person booking calendar with seat
            management — exactly as outlined in the Workstream A plan.
          </p>
        </div>
      </Container>
    </>
  );
}
