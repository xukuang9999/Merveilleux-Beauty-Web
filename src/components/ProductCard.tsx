import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/content";

export default function ProductCard({
  product,
  discoverLabel = "Discover",
}: {
  product: ProductView;
  discoverLabel?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col"
    >
      {/* Arch-framed product vitrine — the boutique's backlit display niches */}
      <div className="arch-frame relative aspect-[5/6] overflow-hidden border border-line bg-onyx-glow transition-all duration-500 group-hover:border-gold/50 group-hover:shadow-[0_24px_50px_-28px_rgba(69,61,49,0.5)]">
        <Image
          src={product.graphic}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-umber/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold">
          {product.type}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl font-light leading-tight text-charcoal">
          {product.name}
        </h3>
        <p className="mt-1 text-sm italic text-mid">{product.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">
          {discoverLabel}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
