import type { Locale } from "../config";
import { type ContentPack } from "./types";
import zh from "./zh";
import ms from "./ms";

const packs: Partial<Record<Locale, ContentPack>> = { zh, ms };

/** Translation overlay for a locale, or null for English (the canonical source). */
export function contentPack(locale: Locale): ContentPack | null {
  return packs[locale] ?? null;
}

/** Overlay localized title/summary/lessons onto a seed module (by `ord`). */
export function localizeModule<
  T extends { ord: number; title: string; summary: string; lessons: string[] },
>(m: T, locale: Locale): T {
  const t = contentPack(locale)?.modules[m.ord];
  return t ? { ...m, title: t.title, summary: t.summary, lessons: t.lessons } : m;
}

export type { ContentPack } from "./types";
