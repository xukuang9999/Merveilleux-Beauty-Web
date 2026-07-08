import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`eyebrow mb-4 flex items-center gap-3 ${
            center ? "justify-center" : ""
          }`}
        >
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          {eyebrow}
          {center && <span aria-hidden className="h-px w-8 bg-gold/60" />}
        </p>
      )}
      <h2 className="font-serif text-3xl font-light leading-tight text-charcoal sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-mid">{description}</p>
      )}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "gold";
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[2px] px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] transition-all duration-300";
  const styles = {
    solid: "bg-umber text-cream hover:bg-charcoal hover:-translate-y-0.5",
    gold: "bg-gradient-to-r from-bronze via-[#b09a72] to-bronze text-cream hover:brightness-110 hover:-translate-y-0.5",
    outline:
      "border border-bronze/40 text-bronze hover:border-bronze hover:bg-bronze hover:text-cream",
  }[variant];

  const cls = `${base} ${styles} ${variant !== "outline" ? "shine" : ""} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  );
}

export function Divider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 py-2">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/80" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}
