"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/data";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { switcherLocales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { FeatureFlags } from "@/lib/settings";
import { LINK_FLAG } from "@/lib/feature-links";

type NavUser = {
  name: string;
  role: "customer" | "distributor" | "admin" | "master_admin";
};

const roleHome: Record<NavUser["role"], string> = {
  customer: "/account",
  distributor: "/portal",
  admin: "/admin",
  master_admin: "/admin",
};

export default function Nav({
  user,
  locale,
  dict,
  flags,
}: {
  user: NavUser | null;
  locale: Locale;
  dict: Dictionary["nav"];
  flags: FeatureFlags;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const roleLabel: Record<NavUser["role"], string> = {
    customer: dict.myAccount,
    distributor: dict.myPortal,
    admin: dict.admin,
    master_admin: dict.admin,
  };

  const links = [
    { href: "/", label: dict.home },
    { href: "/about", label: dict.about },
    { href: "/products", label: dict.products },
    { href: "/promotions", label: dict.promotions },
    { href: "/news", label: dict.news },
    { href: "/blog", label: dict.blog },
    { href: "/testimonials", label: dict.testimonials },
    { href: "/contact", label: dict.contact },
  ].filter((l) => {
    const flag = LINK_FLAG[l.href];
    return !flag || flags[flag];
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/graphics/logo.png"
            alt={site.name}
            width={1200}
            height={222}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {links.slice(1, -1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative whitespace-nowrap px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors after:absolute after:bottom-0.5 after:left-2.5 after:right-2.5 after:h-px after:origin-left after:bg-bronze after:transition-transform after:duration-300 ${
                isActive(l.href)
                  ? "text-bronze after:scale-x-100"
                  : "text-mid after:scale-x-0 hover:text-charcoal hover:after:scale-x-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher
            current={locale}
            options={switcherLocales(flags.bahasaMelayu)}
            className="ml-2"
          />
          {user ? (
            <Link
              href={roleHome[user.role]}
              className="ml-2 flex items-center gap-2 whitespace-nowrap rounded-[2px] bg-umber px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-cream transition-colors hover:bg-charcoal"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/30 text-[10px] uppercase">
                {user.name.charAt(0)}
              </span>
              {roleLabel[user.role]}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="ml-1 whitespace-nowrap px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-mid transition-colors hover:text-charcoal"
              >
                {dict.login}
              </Link>
              <Link
                href="/join"
                className="whitespace-nowrap rounded-[2px] bg-umber px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-cream transition-colors hover:bg-charcoal"
              >
                {dict.join}
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher
            current={locale}
            options={switcherLocales(flags.bahasaMelayu)}
          />
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-cream px-5 pb-5 pt-2 xl:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-line/70 py-3 text-sm font-medium ${
                isActive(l.href) ? "text-bronze" : "text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              href={roleHome[user.role]}
              onClick={() => setOpen(false)}
              className="mt-3 block text-sm font-medium text-bronze"
            >
              {roleLabel[user.role]} →
            </Link>
          ) : (
            <div className="mt-3 flex gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-charcoal"
              >
                {dict.login}
              </Link>
              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-bronze"
              >
                {dict.join}
              </Link>
            </div>
          )}
          <a href={`mailto:${site.email}`} className="mt-3 block text-sm text-mid">
            {site.email}
          </a>
        </div>
      )}
    </header>
  );
}
