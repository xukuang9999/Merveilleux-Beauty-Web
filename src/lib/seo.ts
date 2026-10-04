import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { site } from "./data";

const ogLocale: Record<Locale, string> = { en: "en_MY", zh: "zh_MY", ms: "ms_MY" };

/** Explicit nested fields prevent page shares from inheriting the home card. */
export function localizedMetadata({
  locale, title, description, path, image = "/renders/product-lineup.jpg", article = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
  article?: boolean;
}): Metadata {
  const shareTitle = title.includes(site.name) ? title : `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle, description, url: path, siteName: site.name,
      type: article ? "article" : "website", locale: ogLocale[locale],
      images: [{ url: image, alt: title }],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}

export type MetadataPage = "home" | "about" | "products" | "promotions" | "news" | "blog"
  | "gallery" | "testimonials" | "faq" | "training" | "join" | "contact" | "login" | "register";

export async function localizedPageMetadata(page: MetadataPage): Promise<Metadata> {
  const locale = await getLocale();
  const d = getDictionary(locale);
  const pages: Record<MetadataPage, [string, string]> = {
    home: [`${site.name} — ${d.home.heroEyebrow}`, d.footer.brandBlurb],
    about: [d.nav.about, d.about.intro],
    products: [d.nav.products, d.products.desc],
    promotions: [d.nav.promotions, d.promotions.intro],
    news: [d.nav.news, d.news.intro],
    blog: [d.nav.blog, d.blog.intro],
    gallery: [d.nav.gallery, d.gallery.intro],
    testimonials: [d.nav.testimonials, d.testimonials.desc],
    faq: [d.nav.faq, d.faq.desc],
    training: [d.nav.training, d.training.desc],
    join: [d.nav.joinUs, d.join.intro],
    contact: [d.nav.contact, d.contact.body],
    login: [d.auth.signIn, d.auth.welcomeSub],
    register: [d.auth.createAccount, d.auth.createSub],
  };
  const [title, description] = pages[page];
  const result = localizedMetadata({ locale, title, description, path: page === "home" ? "/" : `/${page}` });
  if (page === "home") result.title = { absolute: title };
  if (page === "login" || page === "register") result.robots = { index: false, follow: false };
  return result;
}
