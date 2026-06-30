import Image from "next/image";

// Deterministic pseudo-random from index (stable across SSR/CSR — no hydration
// mismatch, and no Math.random at module scope).
const rng = (i: number, salt: number) =>
  Math.sin(i * 99.13 + salt * 53.7) * 0.5 + 0.5;

export default function Petals({ count = 9 }: { count?: number }) {
  const petals = Array.from({ length: count }).map((_, i) => {
    const left = Math.round(rng(i, 1) * 100);
    const dur = 11 + Math.round(rng(i, 2) * 10);
    const delay = -(rng(i, 3) * dur).toFixed(2);
    const scale = (0.5 + rng(i, 4) * 0.7).toFixed(2);
    const drift = Math.round((rng(i, 5) - 0.5) * 140);
    const rot = 120 + Math.round(rng(i, 6) * 220);
    const op = (0.35 + rng(i, 7) * 0.4).toFixed(2);
    return { i, left, dur, delay, scale, drift, rot, op };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      {petals.map((p) => (
        <span
          key={p.i}
          className="petal-fall absolute top-0"
          style={{
            left: `${p.left}%`,
            ["--petal-dur" as string]: `${p.dur}s`,
            ["--petal-delay" as string]: `${p.delay}s`,
            ["--petal-drift" as string]: `${p.drift}px`,
            ["--petal-rot" as string]: `${p.rot}deg`,
            ["--petal-opacity" as string]: p.op,
          }}
        >
          <Image
            src="/graphics/petal.svg"
            alt=""
            width={26}
            height={31}
            style={{ transform: `scale(${p.scale})` }}
          />
        </span>
      ))}
    </div>
  );
}
