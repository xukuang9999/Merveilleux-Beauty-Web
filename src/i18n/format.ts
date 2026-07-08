// Client-safe string interpolation: fmt("Done {a}/{q}", { a: 1, q: 5 }).
export function fmt(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

// Deterministic (SSR-safe) date formatting for an ISO "YYYY-MM-DD" date.
const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS_MS = [
  "Jan", "Feb", "Mac", "Apr", "Mei", "Jun",
  "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis",
];
export function formatDate(iso: string, locale: "en" | "zh" | "ms"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const day = Number(d);
  const mi = Number(m) - 1;
  if (locale === "zh") return `${y}年${Number(m)}月${day}日`;
  const months = locale === "ms" ? MONTHS_MS : MONTHS_EN;
  return `${day} ${months[mi]} ${y}`;
}
