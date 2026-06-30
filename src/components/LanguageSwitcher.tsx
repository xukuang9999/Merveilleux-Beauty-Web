"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";
import { locales, localeLabels, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({
  current,
  className = "",
}: {
  current: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const pick = (l: Locale) => {
    if (l === current || pending) return;
    start(async () => {
      await setLocale(l);
      router.refresh();
    });
  };

  return (
    <div
      aria-label="Language"
      className={`inline-flex items-center gap-0.5 rounded-full border border-line bg-white/70 p-0.5 ${className}`}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => pick(l)}
          disabled={pending}
          aria-pressed={l === current}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
            l === current
              ? "bg-charcoal text-cream"
              : "text-mid hover:text-charcoal"
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
