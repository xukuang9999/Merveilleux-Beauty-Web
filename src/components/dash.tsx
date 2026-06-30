import type { ReactNode } from "react";

export function DashHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-base text-mid">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-5">
      <p className="font-serif text-3xl text-rose-deep">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-mid">{label}</p>
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-white p-6 ${className}`}
    >
      {title && (
        <h2 className="mb-4 font-serif text-xl text-charcoal">{title}</h2>
      )}
      {children}
    </section>
  );
}
