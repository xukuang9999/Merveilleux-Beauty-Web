import { requireUser } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import ChatPanel from "@/components/ChatPanel";
import { DashHeading } from "@/components/dash";
import { getDict } from "@/i18n/server";

export default async function ConsultPage() {
  await requireUser();
  const dict = await getDict();
  const d = dict.account;
  const configured = aiConfigured();

  return (
    <>
      <DashHeading
        eyebrow={d.consultPageEyebrow}
        title={d.consultPageTitle}
        subtitle={d.consultPageSub}
      />

      {!configured && (
        <div className="mb-6 max-w-2xl rounded-xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
          {dict.consultNotice}
        </div>
      )}

      <div className="max-w-2xl">
        <ChatPanel
          mode="consult"
          heightClass="h-[520px]"
          greeting={dict.chat.consultGreeting}
          suggestions={dict.chat.consultSuggestions}
          placeholder={dict.chat.placeholder}
        />
      </div>
    </>
  );
}
