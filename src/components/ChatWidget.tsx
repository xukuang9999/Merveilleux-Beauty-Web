"use client";

import { uiCopy } from "@/i18n/ui-copy";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChatPanel from "./ChatPanel";
import type { Dictionary } from "@/i18n/dictionaries/en";

export default function ChatWidget({ dict, locale }: { dict: Dictionary["chat"]; locale: string }) {
  const copy = uiCopy(locale);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-mb-chat", handler);
    return () => window.removeEventListener("open-mb-chat", handler);
  }, []);

  return (
    <>
      {open && (
        <div id="margaux-chat" role="region" aria-label="Margaux" className="fixed bottom-24 right-4 z-[60] w-[min(384px,calc(100vw-2rem))] origin-bottom-right rounded-3xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(69,61,49,0.45)]">
          <div className="flex items-center gap-3 rounded-t-3xl bg-gradient-to-r from-umber to-charcoal px-4 py-3 text-cream">
            <Image
              src="/graphics/avatar.svg"
              alt="Margaux"
              width={36}
              height={36}
              className="rounded-full bg-champagne/40"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Margaux</p>
              <p className="text-[11px] text-cream/60">{dict.advisorRole}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={copy.closeChat}
              className="text-cream/70 hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="p-3">
            <ChatPanel
              mode="customer"
              locale={locale}
              heightClass="h-[min(400px,calc(100dvh_-_17rem))]"
              greeting={dict.customerGreeting}
              suggestions={dict.customerSuggestions}
              placeholder={dict.placeholder}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? copy.closeChat : copy.openChat}
        aria-expanded={open}
        aria-controls="margaux-chat"
        className="group fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-charcoal py-2 pl-2 pr-4 text-cream shadow-lg transition-all hover:bg-umber"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-champagne/40">
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <Image src="/graphics/avatar.svg" alt="" width={36} height={36} />
          )}
        </span>
        <span className="text-sm font-medium">
          {open ? dict.close : dict.askMargaux}
        </span>
      </button>
    </>
  );
}
