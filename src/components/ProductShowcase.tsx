import Image from "next/image";

type Labels = {
  priceLabel: string;
  size: string;
  overview: string;
  contents: string;
  keyIngredients: string;
  benefits: string;
  howToUse: string;
  enquireNow: string;
};

type Props = {
  name: string;
  tagline: string;
  type: string;
  categoryLabel?: string;
  priceRM: string;
  size?: string;
  graphic: string;
  description: string;
  /** Set / bundle line-up, one line per item. Empty for single products. */
  contents: string[];
  keyIngredients: string[];
  benefits: string[];
  howToUse: string[];
  whatsappHref: string;
  labels: Labels;
};

export default function ProductShowcase({
  name,
  tagline,
  type,
  categoryLabel,
  priceRM,
  size,
  graphic,
  description,
  contents,
  keyIngredients,
  benefits,
  howToUse,
  whatsappHref,
  labels: L,
}: Props) {
  return (
    <div>
      {/* ---- Summary: photo + name / price / size ---- */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[5/6] w-full max-w-sm">
          <Image
            src={graphic}
            alt={name}
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-contain"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            {categoryLabel && (
              <span className="rounded-full border border-line bg-porcelain px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                {categoryLabel}
              </span>
            )}
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
              {type}
            </p>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl">
            {name}
          </h1>
          {tagline && (
            <p className="mt-2 text-lg italic text-bronze">{tagline}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-3">
            <div>
              <p className="eyebrow mb-1">{L.priceLabel}</p>
              <p className="font-serif text-2xl text-charcoal">{priceRM}</p>
            </div>
            {size && (
              <div>
                <p className="eyebrow mb-1">{L.size}</p>
                <p className="text-charcoal">{size}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Details ---- */}
      <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="eyebrow mb-3">{L.overview}</h2>
          <p className="text-base leading-relaxed text-mid">{description}</p>

          {contents.length > 0 && (
            <div className="mt-10">
              <h2 className="eyebrow mb-4">{L.contents}</h2>
              <ul className="divide-y divide-line border-y border-line">
                {contents.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-sm text-charcoal"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {howToUse.length > 0 && (
            <div className="mt-10">
              <h2 className="eyebrow mb-4">{L.howToUse}</h2>
              <ol className="space-y-4">
                {howToUse.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/60 font-serif text-sm text-bronze">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-charcoal">
                      {s}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="rounded-[2px] border border-line bg-porcelain p-7">
          {keyIngredients.length > 0 && (
            <>
              <h3 className="eyebrow mb-3">{L.keyIngredients}</h3>
              <ul className="mb-7 space-y-1.5">
                {keyIngredients.map((ing) => (
                  <li key={ing} className="text-sm text-charcoal">
                    {ing}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className="eyebrow mb-3">{L.benefits}</h3>
          <ul className="space-y-2">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-charcoal"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- Persistent CTA: Enquire on WhatsApp ---- */}
      <div className="mt-12 flex justify-center border-t border-line pt-10">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shine inline-flex items-center justify-center gap-2 rounded-[2px] bg-gradient-to-r from-bronze via-[#b09a72] to-bronze px-10 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.96 1.36-.5.05-.99.24-3.32-.69-2.79-1.1-4.58-3.94-4.72-4.13-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.96-2.31c.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.56.81 1.94.88 2.08.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.28.75 1.24 1.61 2 1.11.99 2.05 1.3 2.33 1.44.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.18-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.36z" />
          </svg>
          {L.enquireNow}
        </a>
      </div>
    </div>
  );
}
