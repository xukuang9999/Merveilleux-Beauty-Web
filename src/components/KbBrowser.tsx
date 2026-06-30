"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
};

export default function KbBrowser({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...new Set(articles.map((a) => a.category))],
    [articles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const inCat = cat === "All" || a.category === cat;
      const inQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return inCat && inQ;
    });
  }, [articles, query, cat]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cases, ingredients, tips…"
          className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:border-rose-deep sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                cat === c
                  ? "border-rose-deep bg-rose-light/50 text-rose-deep"
                  : "border-line bg-white text-mid hover:border-rose-light"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-mid">
          No articles match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/portal/knowledge/${a.slug}`}
              className="group rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-rose-light"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
                {a.category}
              </p>
              <h3 className="mt-1.5 font-serif text-xl leading-snug text-charcoal">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-mid">{a.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-medium text-rose-deep">
                Read →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
