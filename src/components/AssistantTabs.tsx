"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

const TABS = [
  {
    key: "training" as const,
    label: "🎓 AI Training Coach",
    greeting:
      "Hi! I'm Margaux, your training coach. Ask me to explain a module, quiz you, role-play a sales objection, or summarise the SOP. What shall we work on?",
    suggestions: [
      "Quiz me on product knowledge",
      "How do I handle 'it's too expensive'?",
      "Summarise the distributor policy",
      "Give me a WhatsApp sales script",
    ],
  },
  {
    key: "consult" as const,
    label: "💬 Skincare Consultation",
    greeting:
      "Let's solve a customer's skin concern together. Tell me their skin type and main concern, and I'll suggest a Merveilleux routine you can recommend.",
    suggestions: [
      "Customer with oily, acne-prone skin",
      "Dark spots & uneven tone",
      "Sensitive, reactive skin",
      "Build a simple starter routine",
    ],
  },
];

export default function AssistantTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("training");
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <div className="max-w-2xl">
      <div className="mb-4 inline-flex rounded-full border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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
        heightClass="h-[520px]"
        greeting={active.greeting}
        suggestions={active.suggestions}
      />
    </div>
  );
}
