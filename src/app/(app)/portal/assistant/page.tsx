import { requireRole } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import { DashHeading } from "@/components/dash";
import AssistantTabs from "@/components/AssistantTabs";

export default async function AssistantPage() {
  await requireRole(["distributor", "admin"]);
  const configured = aiConfigured();

  return (
    <>
      <DashHeading
        eyebrow="AI Assistant"
        title="Your AI coach & consultant"
        subtitle="Professional AI training, sales guidance and skincare consultation — grounded in the Merveilleux knowledge base."
      />

      {!configured && (
        <div className="mb-6 max-w-2xl rounded-xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
          <span className="font-medium text-amber">Heads up:</span> the AI
          isn&apos;t switched on yet. Add an{" "}
          <code className="rounded bg-white px-1">ANTHROPIC_API_KEY</code> to your
          Vercel project to activate the coach.
        </div>
      )}

      <AssistantTabs />
    </>
  );
}
