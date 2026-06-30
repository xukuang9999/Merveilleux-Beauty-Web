import { cookies } from "next/headers";
import { cache } from "react";
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import zh from "./dictionaries/zh";
import ms from "./dictionaries/ms";

const dictionaries: Record<Locale, Dictionary> = { en, zh, ms };

/** Current locale for this request (from cookie), cached per request. */
export const getLocale = cache(async (): Promise<Locale> => {
  const jar = await cookies();
  const value = jar.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
});

/** The dictionary for the current request's locale. */
export const getDict = cache(async (): Promise<Dictionary> => {
  return dictionaries[await getLocale()];
});

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { fmt } from "./format";
