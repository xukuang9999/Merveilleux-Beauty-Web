"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

type Role = "customer" | "distributor" | "admin";
type NavItem = { href: string; label: string; icon: string };

export default function DashboardShell({
  user,
  locale,
  dict,
  children,
}: {
  user: { name: string; role: Role };
  locale: Locale;
  dict: Dictionary["dashboard"];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV: Record<Role, NavItem[]> = {
    customer: [
      { href: "/account", label: dict.overview, icon: "🏠" },
      { href: "/account/consult", label: dict.aiConsult, icon: "💬" },
    ],
    distributor: [
      { href: "/portal", label: dict.dashboard, icon: "🏠" },
      { href: "/portal/training", label: dict.training, icon: "🎓" },
      { href: "/portal/knowledge", label: dict.knowledgeBase, icon: "📚" },
      { href: "/portal/assistant", label: dict.aiCoachConsult, icon: "✨" },
    ],
    admin: [
      { href: "/admin", label: dict.dashboard, icon: "🏠" },
      { href: "/admin/products", label: dict.products, icon: "💄" },
      { href: "/admin/kb", label: dict.knowledgeBase, icon: "📚" },
      { href: "/admin/progress", label: dict.trainingProgress, icon: "📈" },
      { href: "/admin/users", label: dict.users, icon: "👤" },
      { href: "/admin/enquiries", label: dict.enquiries, icon: "✉️" },
    ],
  };
  const roleBadge: Record<Role, string> = {
    customer: dict.roleCustomer,
    distributor: dict.roleDistributor,
    admin: dict.roleAdmin,
  };

  const items = NAV[user.role];
  const rootHref = items[0].href;
  const isActive = (href: string) =>
    href === rootHref ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <aside className="border-b border-line bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/graphics/monogram.svg" alt="" width={32} height={32} />
            <span className="font-serif text-lg tracking-wide text-charcoal">
              Merveilleux
            </span>
          </Link>
          <div className="flex items-center gap-2 lg:mt-3 lg:flex-col lg:items-start">
            <span className="rounded-full bg-champagne/60 px-3 py-1 text-[11px] font-semibold text-bronze">
              {roleBadge[user.role]}
            </span>
            <LanguageSwitcher current={locale} />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive(it.href)
                  ? "bg-charcoal text-cream"
                  : "text-mid hover:bg-cream hover:text-charcoal"
              }`}
            >
              <span>{it.icon}</span>
              <span className="whitespace-nowrap">{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-line p-3 lg:mt-auto lg:block">
          <div className="px-2 py-2 text-sm">
            <p className="font-medium text-charcoal">{user.name}</p>
          </div>
          <form action={logoutAction}>
            <button className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-mid transition-colors hover:bg-cream hover:text-charcoal">
              ↦ {dict.signOut}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white/70 px-5 py-3 lg:hidden">
          <span className="text-sm font-medium text-charcoal">{user.name}</span>
          <form action={logoutAction}>
            <button className="text-sm font-medium text-bronze">
              {dict.signOut}
            </button>
          </form>
        </div>
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
