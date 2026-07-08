const maskStyle = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  maskImage:
    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
};

export default function Marquee({
  items,
  durationSec = 32,
  className = "",
}: {
  items: string[];
  durationSec?: number;
  className?: string;
}) {
  const Group = () => (
    <ul
      aria-hidden
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-serif text-lg font-light italic text-umber/70">
            {it}
          </span>
          <span aria-hidden className="rotate-45 text-[8px] text-gold">■</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`overflow-hidden ${className}`} style={maskStyle}>
      <div
        className="flex w-max animate-marquee"
        style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
      >
        <Group />
        <Group />
      </div>
    </div>
  );
}
