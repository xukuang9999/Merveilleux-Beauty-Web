import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink, mapsLink } from "@/lib/data";
import { getDict, getLocale, fmt } from "@/i18n/server";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { FeatureFlags } from "@/lib/settings";
import { LINK_FLAG } from "@/lib/feature-links";

export default async function Footer({ flags }: { flags: FeatureFlags }) {
  const [dict, locale] = await Promise.all([getDict(), getLocale()]);
  const f = dict.footer;
  const links = [
    { href: "/about", label: dict.nav.about },
    { href: "/products", label: dict.nav.products },
    { href: "/promotions", label: dict.nav.promotions },
    { href: "/news", label: dict.nav.news },
    { href: "/blog", label: dict.nav.blog },
    { href: "/gallery", label: dict.nav.gallery },
    { href: "/testimonials", label: dict.nav.testimonials },
    { href: "/faq", label: dict.nav.faq },
    { href: "/training", label: dict.nav.training },
    { href: "/join", label: dict.nav.joinUs },
    { href: "/contact", label: dict.nav.contact },
  ].filter((l) => {
    const flag = LINK_FLAG[l.href];
    return !flag || flags[flag];
  });
  const socials = [
    { href: site.instagram, label: f.instagram },
    { href: site.facebook, label: f.facebook },
    { href: site.xiaohongshu, label: f.xiaohongshu },
  ];

  return (
    <footer className="mt-24 bg-umber text-cream/70">
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/graphics/monogram.svg"
                alt=""
                width={36}
                height={36}
                className="brightness-[1.7] saturate-[0.75]"
              />
              <Image
                src="/graphics/logo-light.png"
                alt={site.name}
                width={1200}
                height={222}
                className="h-8 w-auto"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              {site.description}
            </p>
            <div className="mt-6 max-w-sm">
              <h4 className="eyebrow mb-2">{f.newsletterTitle}</h4>
              <p className="mb-3 text-xs leading-relaxed text-cream/50">
                {f.newsletterSub}
              </p>
              <NewsletterSignup dict={f} locale={locale} />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="eyebrow mb-4">{f.explore}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-cream/70 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="eyebrow mb-4">{f.connect}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hi Merveilleux Beauty, I'd like to know more.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  {f.whatsapp} · {site.phone}
                </a>
              </li>
              <li className="text-cream/60">WeChat: {site.wechat}</li>
            </ul>

            <h4 className="eyebrow mb-3 mt-6">{f.follow}</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <h4 className="eyebrow mb-2 mt-6">{f.visitUs}</h4>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-relaxed text-cream/60 transition-colors hover:text-gold"
            >
              {site.address.full}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name} · {f.rights}
          </p>
          <p>{fmt(f.companyLine, { legal: site.legalName, reg: site.regNo })}</p>
        </div>
      </div>
    </footer>
  );
}
