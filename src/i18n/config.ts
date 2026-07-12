export const locales = ["en", "zh", "ms"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "mb_lang";

// Short labels for the language switcher.
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ms: "BM",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
};

// `lang` attribute / hreflang values.
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  ms: "ms",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Locales offered in the language switcher. `ms` (BM) is hidden unless the
// `bahasaMelayu` feature flag is on — the translations still exist, they're
// just not offered in the toggle. Hiding, not removing.
export function switcherLocales(showBahasa: boolean): Locale[] {
  return locales.filter((l) => l !== "ms" || showBahasa);
}
