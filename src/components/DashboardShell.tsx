"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";

type Role = "customer" | "distributor" | "admin";
type NavItem = { href: string; label: string; icon: string };

const NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/account", label: "Overview", icon: "🏠" },
    { href: "/account/consult", label: "AI Skincare Consult", icon: "💬" },
  ],
  distributor: [
    { href: "/portal", label: "Dashboard", icon: "🏠" },
    { href: "/portal/training", label: "Training", icon: "🎓" },
    { href: "/portal/knowledge", label: "Knowledge Base", icon: "📚" },
    { href: "/portal/assistant", label: "AI Coach & Consult", icon: "✨" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: "🏠" },
    { href: "/admin/products", label: "Products", icon: "💄" },
    { href: "/admin/kb", label: "Knowledge Base", icon: "📚" },
    { href: "/admin/progress", label: "Training Progress", icon: "📈" },
    { href: "/admin/users", label: "Users", icon: "👤" },
    { href: "/admin/enquiries", label: "Enquiries", icon: "✉️" },
  ],
};

const roleBadge: Record<Role, string> = {
  customer: "Customer",
  distributor: "经销商",
  admin: "Admin",
};

export default function DashboardShell({
  user,
  children,
}: {
  user: { name: string; role: Role };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[user.role];
  const rootHref = items[0].href;
  const isActive = (href: string) =>
    href === rootHref ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-line bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/graphics/monogram.svg" alt="" width={32} height={32} />
            <span className="font-serif text-lg tracking-wide text-charcoal">
              Merveilleux
            </span>
          </Link>
          <span className="rounded-full bg-rose-light/60 px-3 py-1 text-[11px] font-semibold text-rose-deep lg:mt-3 lg:inline-block">
            {roleBadge[user.role]}
          </span>
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
              ↦ Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white/70 px-5 py-3 lg:hidden">
          <span className="text-sm font-medium text-charcoal">{user.name}</span>
          <form action={logoutAction}>
            <button className="text-sm font-medium text-rose-deep">
              Sign out
            </button>
          </form>
        </div>
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
