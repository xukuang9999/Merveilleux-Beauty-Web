"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

type Tab = {
  key: "training" | "consult";
  label: string;
  greeting: string;
  suggestions: string[];
};

export default function AssistantTabs({
  tabs,
  locale,
  placeholder,
}: {
  tabs: Tab[];
  locale: string;
  placeholder: string;
}) {
  const [tab, setTab] = useState<Tab["key"]>(tabs[0].key);
  const active = tabs.find((t) => t.key === tab) ?? tabs[0];

  return (
    <div className="max-w-2xl">
      <div className="mb-4 inline-flex rounded-full border border-line bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-charcoal text-cream"
                : "text-mid hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ChatPanel
        key={active.key}
        mode={active.key}
        locale={locale}
        heightClass="h-[520px]"
        greeting={active.greeting}
        suggestions={active.suggestions}
        placeholder={placeholder}
      />
    </div>
  );
}
