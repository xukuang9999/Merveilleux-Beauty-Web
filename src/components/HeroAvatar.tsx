"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function HeroAvatar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const openChat = () => window.dispatchEvent(new Event("open-mb-chat"));

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x, y });
  }
  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative mx-auto aspect-square w-full max-w-md"
    >
      {/* rotating gold rings */}
      <Image
        src="/graphics/hero-rings.svg"
        alt=""
        aria-hidden
        width={600}
        height={600}
        priority
        className="absolute inset-0 h-full w-full select-none"
        style={{
          transform: `translate(${tilt.x * -16}px, ${tilt.y * -16}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* soft brand backdrop blob */}
      <Image
        src="/graphics/hero-art.svg"
        alt=""
        aria-hidden
        width={600}
        height={600}
        priority
        className="absolute inset-[8%] h-[84%] w-[84%] select-none"
        style={{
          transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* twinkling sparkles */}
      <Image
        src="/graphics/sparkle.svg"
        alt=""
        aria-hidden
        width={34}
        height={34}
        className="absolute left-[6%] top-[20%] w-8"
      />
      <Image
        src="/graphics/sparkle-gold-burst.svg"
        alt=""
        aria-hidden
        width={46}
        height={46}
        className="absolute right-[8%] top-[12%] w-11"
      />
      <Image
        src="/graphics/sparkle.svg"
        alt=""
        aria-hidden
        width={26}
        height={26}
        className="absolute bottom-[18%] right-[14%] w-6"
      />

      {/* avatar */}
      <button
        onClick={openChat}
        aria-label="Chat with Margaux, our AI beauty advisor"
        className="group absolute inset-0 flex items-end justify-center focus:outline-none"
        style={{
          transform: `translate(${tilt.x * 22}px, ${tilt.y * 22}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <Image
          src="/graphics/avatar.svg"
          alt="Margaux — Merveilleux AI Beauty Advisor"
          width={300}
          height={350}
          priority
          className="float h-auto w-[60%] drop-shadow-[0_18px_30px_rgba(74,48,64,0.18)] transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {/* speech bubble */}
      <button
        onClick={openChat}
        className="pop absolute right-0 top-4 max-w-[210px] cursor-pointer rounded-2xl rounded-br-sm border border-line bg-white/95 px-4 py-3 text-left shadow-[0_12px_30px_-12px_rgba(74,48,64,0.35)] backdrop-blur sm:right-2"
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
