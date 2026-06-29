import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products#${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rose-light hover:shadow-[0_18px_40px_-24px_rgba(74,48,64,0.4)]"
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-gradient-to-b from-cream to-rose-light/30">
        <Image
          src={product.graphic}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
          {product.type}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-charcoal">
          {product.name}
        </h3>
        <p className="mt-1 text-sm italic text-mid">{product.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-rose-deep">
          Discover
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
