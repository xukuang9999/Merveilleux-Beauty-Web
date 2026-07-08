"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Hero visual: flagship renders from the Bellesenze design proposal,
// framed in the facade's arch motif, with a subtle parallax tilt.
export default function HeroAvatar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
      className="relative mx-auto aspect-[5/6] w-full max-w-md"
    >
      {/* main arch — reception with the backlit MÉRVÉILLÉUX wall */}
      <div
        className="arch-frame absolute inset-x-6 inset-y-0 overflow-hidden border border-gold/40 shadow-[0_40px_80px_-40px_rgba(69,61,49,0.55)]"
        style={{
          transform: `translate(${tilt.x * -10}px, ${tilt.y * -10}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <Image
          src="/renders/reception.jpg"
          alt="Mérvéilléux Premium flagship reception"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="ken-burns object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-umber/25 via-transparent to-transparent"
        />
      </div>

      {/* offset arch — the bronze water feature wall */}
      <div
        className="arch-frame-tight absolute -left-2 bottom-6 hidden h-52 w-36 overflow-hidden border-2 border-cream shadow-[0_28px_50px_-24px_rgba(69,61,49,0.6)] sm:block"
        style={{
          transform: `translate(${tilt.x * 18}px, ${tilt.y * 18}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <Image
          src="/renders/water-wall.jpg"
          alt="Bronze water feature wall"
          fill
          sizes="144px"
          className="ken-burns object-cover object-[62%_center]"
          style={{ animationDelay: "-9s" }}
        />
      </div>
    </div>
  );
}
