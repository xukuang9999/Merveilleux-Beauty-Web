import Image from "next/image";
import type { NewsView } from "@/lib/content";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/config";

// Instagram glyph — small, so an inline SVG keeps it crisp and themeable.
function InstagramMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function NewsCard({
  item,
  locale,
  viewLabel,
  featured = false,
}: {
  item: NewsView;
  locale: Locale;
  viewLabel: string;
  featured?: boolean;
}) {
  return (
    <a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-porcelain transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_60px_-36px_rgba(69,61,49,0.55)]"
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-[4/3]" : "aspect-[5/4]"}`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-umber/45 via-transparent to-transparent"
        />
        <span className="absolute left-4 top-4 rounded-full bg-porcelain/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-bronze backdrop-blur">
          {item.category}
        </span>
        {item.type === "reel" && (
          <span
            aria-hidden
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-porcelain/85 text-bronze backdrop-blur"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-mid">
          {formatDate(item.date, locale)}
        </p>
        <h3
          className={`mt-2 font-serif font-light leading-snug text-charcoal ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mid">
          {item.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">
          <InstagramMark className="h-4 w-4" />
          {viewLabel}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}
