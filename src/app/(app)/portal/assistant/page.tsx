import { requireRole } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import { DashHeading } from "@/components/dash";
import AssistantTabs from "@/components/AssistantTabs";
import { getDict } from "@/i18n/server";

export default async function AssistantPage() {
  await requireRole(["distributor", "admin", "master_admin"]);
  const dict = await getDict();
  const d = dict.assistant;
  const configured = aiConfigured();

  const tabs = [
    {
      key: "training" as const,
      label: d.tabCoach,
      greeting: dict.chat.coachGreeting,
      suggestions: dict.chat.coachSuggestions,
    },
    {
      key: "consult" as const,
      label: d.tabConsult,
      greeting: dict.chat.consultPartnerGreeting,
      suggestions: dict.chat.consultPartnerSuggestions,
    },
  ];

  return (
    <>
      <DashHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.sub} />

      {!configured && (
        <div className="mb-6 max-w-2xl rounded-xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
          {d.aiNotice}
        </div>
      )}

      <AssistantTabs tabs={tabs} placeholder={dict.chat.placeholder} />
    </>
  );
}
