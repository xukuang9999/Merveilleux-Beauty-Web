"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-mb-chat", handler);
    return () => window.removeEventListener("open-mb-chat", handler);
  }, []);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] w-[min(384px,calc(100vw-2rem))] origin-bottom-right rounded-3xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(74,48,64,0.45)]">
          <div className="flex items-center gap-3 rounded-t-3xl bg-gradient-to-r from-plum to-charcoal px-4 py-3 text-cream">
            <Image
              src="/graphics/avatar.svg"
              alt="Margaux"
              width={36}
              height={36}
              className="rounded-full bg-rose-light/40"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Margaux</p>
              <p className="text-[11px] text-cream/60">
                Merveilleux AI Beauty Advisor
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
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
              heightClass="h-[400px]"
              greeting="Bonjour! 👋 I'm Margaux, your Merveilleux Beauty advisor. Ask me about our products, building a routine, or becoming a 经销商. How can I help?"
              suggestions={[
                "Help me build a routine",
                "Which serum is best for dark spots?",
                "How do I become a 经销商?",
              ]}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Margaux"}
        className="group fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-charcoal py-2 pl-2 pr-4 text-cream shadow-lg transition-all hover:bg-plum"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-rose-light/40">
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <Image src="/graphics/avatar.svg" alt="" width={36} height={36} />
          )}
        </span>
        <span className="text-sm font-medium">
          {open ? "Close" : "Ask Margaux"}
        </span>
      </button>
    </>
  );
}
