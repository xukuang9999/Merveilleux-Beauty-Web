"use client";

import { useEffect, useRef } from "react";
import { Button, Stars } from "@/components/ui";

type Chapter = { title: string; body: string };

type Props = {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  body: string;
  exploreLabel: string;
  joinLabel: string;
  lovedBy: string;
  scrollHint: string;
  /** Scenes 2–5 of the walkthrough (scene 1 is the brand hero below). */
  chapters: Chapter[];
};

// The walkthrough is pre-rendered to a JPEG frame sequence and painted to a
// <canvas>. Scrubbing an image sequence has no decode/seek latency (unlike
// scrubbing a <video> via currentTime), so it stays smooth under fast scroll.
const FRAME_COUNT = 90;
const FIRST_FRAME = "/videos/frames/spa-001.jpg"; // instant CSS poster
const frameSrc = (i: number) =>
  `/videos/frames/spa-${String(i + 1).padStart(3, "0")}.jpg`;

// Height of the scroll "track", in viewport heights. The pinned stage is 100vh,
// so (TRACK_VH - 100)vh of scrolling scrubs the whole sequence. Kept fairly
// tight so the walkthrough hands off to the page quickly rather than feeling
// like a long intro to sit through.
const TRACK_VH = 360;

// Each overlay's visibility window in scroll-progress space p ∈ [0,1]:
// [fadeInStart, fullStart, fullEnd, fadeOutEnd]. p maps 1:1 to a frame (and so
// to a clip timestamp ≈ p·10s), so these are tuned to the moment each key frame
// is on screen: reception (0–1.8s) → hallway (1.8–3s) → consultation (3–5s) →
// treatment corridor/suites (5–7.8s) → relaxation suite (7.8–10s). Adjacent
// windows overlap slightly so captions crossfade rather than blanking.
const WINDOWS: readonly [number, number, number, number][] = [
  [0.0, 0.0, 0.12, 0.18], // 01 · reception — brand hero
  [0.16, 0.2, 0.27, 0.32], // 02 · across the threshold (hallway)
  [0.3, 0.35, 0.46, 0.51], // 03 · consultation room
  [0.49, 0.55, 0.72, 0.77], // 04 · treatment corridor / suites
  [0.76, 0.82, 1.0, 1.0], // 05 · relaxation suite — ritual + CTA
];

function windowOpacity(p: number, [a, b, c, d]: readonly number[]): number {
  if (p < a || p > d) return 0;
  if (p < b) return (p - a) / (b - a); // fade in (b > a here)
  if (p <= c) return 1; // fully visible plateau
  if (d > c) return 1 - (p - c) / (d - c); // fade out
  return 1; // c === d → holds to the end
}

export default function ScrollVideoHero({
  eyebrow,
  titleBefore,
  titleHighlight,
  body,
  exploreLabel,
  joinLabel,
  lovedBy,
  scrollHint,
  chapters,
}: Props) {
  const trackRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layers = useRef<Array<HTMLDivElement | null>>([]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  const reducedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!track || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    reducedRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) track.style.height = "100vh";

    // Preload the frame sequence.
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let wanted = 0;
    let lastDrawn = -1;

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * ir;
        dy = 0;
        dx = (cw - dw) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const ready = (im?: HTMLImageElement): im is HTMLImageElement =>
      !!im && im.complete && im.naturalWidth > 0;

    const drawFrame = (idx: number) => {
      let img = images[idx];
      if (!ready(img)) {
        // Fall back to the nearest already-decoded frame so the canvas is never
        // blank while frames are still streaming in.
        for (let step = 1; step < FRAME_COUNT; step++) {
          if (ready(images[idx - step])) {
            img = images[idx - step];
            break;
          }
          if (ready(images[idx + step])) {
            img = images[idx + step];
            break;
          }
        }
      }
      if (!ready(img)) return;
      drawCover(img);
      lastDrawn = idx;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const im = new Image();
      im.decoding = "async";
      im.src = frameSrc(i);
      images[i] = im;
      im.onload = () => {
        // Redraw the frame the user is currently on as soon as it arrives.
        if (i === wanted || lastDrawn < 0) drawFrame(wanted);
      };
    }

    const update = () => {
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = -track.getBoundingClientRect().top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;

      wanted = reducedRef.current ? 0 : Math.round(p * (FRAME_COUNT - 1));
      if (wanted !== lastDrawn) drawFrame(wanted);

      for (let i = 0; i < WINDOWS.length; i++) {
        const el = layers.current[i];
        if (!el) continue;
        const w = WINDOWS[i];
        const o = reducedRef.current ? (i === 0 ? 1 : 0) : windowOpacity(p, w);
        const localT =
          w[3] > w[0] ? Math.min(1, Math.max(0, (p - w[0]) / (w[3] - w[0]))) : 0;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((0.5 - localT) * 34).toFixed(1)}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }

      if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (hintRef.current)
        hintRef.current.style.opacity = Math.max(0, 1 - p * 7).toFixed(3);
      // The top cove-light halo belongs to the reception; fade it away as the
      // journey moves deeper into the boutique.
      if (haloRef.current)
        haloRef.current.style.opacity = Math.max(0, 1 - p / 0.22).toFixed(3);
    };

    // Update synchronously on scroll — browsers already fire scroll at most once
    // per frame, and painting one canvas frame + a few style writes is cheap.
    const onScroll = () => update();
    const onResize = () => {
      sizeCanvas();
      drawFrame(lastDrawn >= 0 ? lastDrawn : wanted);
      update();
    };

    sizeCanvas();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      for (const im of images) im.onload = null;
    };
  }, []);

  const setLayer = (i: number) => (el: HTMLDivElement | null) => {
    layers.current[i] = el;
  };

  return (
    <section
      ref={trackRef}
      className="bg-onyx-glow relative"
      style={{ height: `${TRACK_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
          style={{ background: `#2a2620 url(${FIRST_FRAME}) center/cover` }}
        />
        {/* Legibility scrims — the footage is bright ivory, so knock brightness
            down evenly, then pool shadow on the left/bottom where copy sits. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-umber/25" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-umber/45 via-umber/12 to-umber/88"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-umber/85 via-umber/25 to-transparent"
        />
        <div
          ref={haloRef}
          aria-hidden
          className="pointer-events-none absolute -top-72 left-1/2 h-[620px] w-[620px] -translate-x-1/2"
          style={{ willChange: "opacity" }}
        >
          <div className="halo h-full w-full" />
        </div>

        {/* 01 · Reception — the brand hero */}
        <div
          ref={setLayer(0)}
          className="absolute inset-0 flex items-center"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div
              className="max-w-xl"
              style={{ textShadow: "0 2px 22px rgba(41,37,31,0.55)" }}
            >
              <p className="wordmark text-2xl text-cream sm:text-3xl">Mérvéilléux</p>
              <p className="mt-2.5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.55em] text-gold">
                <span aria-hidden className="h-px w-12 bg-gold/70" />
                Premium
                <span aria-hidden className="h-px w-12 bg-gold/70" />
              </p>
              <h1 className="mt-5 font-serif text-[2.6rem] font-light leading-[1.08] text-cream sm:mt-6 sm:text-6xl sm:leading-[1.05]">
                {titleBefore}
                <span className="gradient-text italic">{titleHighlight}</span>.
              </h1>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.3em] text-gold/90">
                {eyebrow}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cream/85 sm:mt-6 sm:text-lg">
                {body}
              </p>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                <Button href="/products">{exploreLabel}</Button>
                <Button href="/join" variant="outline" className="bg-umber/45 text-cream! backdrop-blur-[2px]">
                  {joinLabel}
                </Button>
              </div>
              <div className="mt-9 hidden items-center gap-4 sm:flex">
                <Stars />
                <p className="text-sm text-cream/75">{lovedBy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 02–05 · Threshold → consultation → suites → ritual */}
        {chapters.map((c, i) => {
          const isLast = i === chapters.length - 1;
          return (
            <div
              key={i}
              ref={setLayer(i + 1)}
              className="absolute inset-0 flex items-center opacity-0"
              style={{ willChange: "opacity, transform" }}
            >
              <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
                <div
                  className="max-w-lg"
                  style={{ textShadow: "0 2px 22px rgba(41,37,31,0.55)" }}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
                    {String(i + 2).padStart(2, "0")}
                    <span aria-hidden className="ml-3 inline-block h-px w-10 translate-y-[-3px] bg-gold/60" />
                  </p>
                  <h2 className="mt-4 font-serif text-[2rem] font-light leading-[1.12] text-cream sm:mt-5 sm:text-5xl sm:leading-[1.1]">
                    {c.title}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/85 sm:text-lg">
                    {c.body}
                  </p>
                  {isLast && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button href="/products">{exploreLabel}</Button>
                      <Button href="/join" variant="outline" className="bg-umber/45 text-cream! backdrop-blur-[2px]">
                        {joinLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll progress rail */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-cream/10"
        >
          <div
            ref={barRef}
            className="h-full w-0 bg-gradient-to-r from-gold to-bronze"
          />
        </div>

        {/* Scroll cue */}
        <div
          ref={hintRef}
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/70"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.35em]">
            {scrollHint}
          </span>
          <span className="float-slow inline-block h-7 w-px bg-gradient-to-b from-cream/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
