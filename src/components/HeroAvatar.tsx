"use client";

import Image from "next/image";

export default function HeroAvatar() {
  const openChat = () => window.dispatchEvent(new Event("open-mb-chat"));

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* soft brand backdrop */}
      <Image
        src="/graphics/hero-art.svg"
        alt=""
        width={600}
        height={600}
        aria-hidden
        priority
        className="h-auto w-full select-none"
      />

      {/* avatar floating on top */}
      <button
        onClick={openChat}
        aria-label="Chat with Margaux, our AI beauty advisor"
        className="group absolute inset-0 flex items-end justify-center focus:outline-none"
      >
        <Image
          src="/graphics/avatar.svg"
          alt="Margaux — Merveilleux AI Beauty Advisor"
          width={300}
          height={350}
          priority
          className="float h-auto w-[62%] drop-shadow-[0_18px_30px_rgba(74,48,64,0.18)] transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {/* speech bubble */}
      <button
        onClick={openChat}
        className="pop absolute right-0 top-6 max-w-[220px] cursor-pointer rounded-2xl rounded-br-sm border border-line bg-white/95 px-4 py-3 text-left shadow-[0_12px_30px_-12px_rgba(74,48,64,0.35)] backdrop-blur sm:right-2"
      >
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          AI Beauty Advisor
        </span>
        <span className="mt-1 block font-serif text-base leading-snug text-charcoal">
          Bonjour! I&apos;m Margaux. Need help choosing? ✨
        </span>
        <span className="mt-1 block text-xs font-medium text-rose-deep">
          Tap to chat →
        </span>
      </button>
    </div>
  );
}
