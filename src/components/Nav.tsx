"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/data";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/graphics/monogram.svg"
            alt=""
            width={34}
            height={34}
            priority
          />
          <span className="font-serif text-xl leading-none tracking-wide text-charcoal">
            Merveilleux
            <span className="ml-1.5 align-middle text-[9px] font-medium uppercase tracking-[0.25em] text-gold">
              Beauty
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.slice(1, -1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                isActive(l.href)
                  ? "text-rose-deep"
                  : "text-mid hover:text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-2 rounded-full bg-charcoal px-5 py-2.5 text-[13px] font-medium text-cream transition-colors hover:bg-plum"
          >
            Join as 经销商
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-cream px-5 pb-5 pt-2 lg:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-line/70 py-3 text-sm font-medium ${
                isActive(l.href) ? "text-rose-deep" : "text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-sm text-mid"
          >
            {site.email}
          </a>
        </div>
      )}
    </header>
  );
}
