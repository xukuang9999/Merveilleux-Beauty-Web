import { requireUser } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import ChatPanel from "@/components/ChatPanel";
import { DashHeading } from "@/components/dash";

export default async function ConsultPage() {
  await requireUser();
  const configured = aiConfigured();

  return (
    <>
      <DashHeading
        eyebrow="AI Skincare Consultation"
        title="Your personal skincare consult"
        subtitle="Describe your skin and goals — Margaux will recommend a tailored Merveilleux routine."
      />

      {!configured && <AiNotice />}

      <div className="max-w-2xl">
        <ChatPanel
          mode="consult"
          heightClass="h-[520px]"
          greeting="Hi! I'm Margaux 🌸 To recommend the right routine, tell me: your skin type (oily / dry / combination / sensitive), your main concern (e.g. dullness, dark spots, dehydration, breakouts), and whether you prefer a simple or full routine."
          suggestions={[
            "Oily, breakout-prone skin in humid weather",
            "Dry & dull, want glow",
            "Dark spots and uneven tone",
            "Sensitive, easily irritated",
          ]}
        />
      </div>
    </>
  );
}

function AiNotice() {
  return (
    <div className="mb-6 max-w-2xl rounded-xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
      <span className="font-medium text-amber">Heads up:</span> the AI advisor
      isn&apos;t switched on yet. Add an{" "}
      <code className="rounded bg-white px-1">ANTHROPIC_API_KEY</code> in your
      Vercel project settings to activate live consultations.
    </div>
  );
}
