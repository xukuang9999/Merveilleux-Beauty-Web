import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollProgress from "@/components/ScrollProgress";
import { getCurrentUser } from "@/lib/auth";
import { getFeatureFlags } from "@/lib/settings";
import { getLocale, getDict } from "@/i18n/server";

// This site is DB-backed and admin-editable, so public pages render on-demand
// (in the serverless function) rather than being baked at build time. This also
// keeps the build itself free of any database access — a slow or unreachable DB
// can never hang or fail the production build during static generation.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale, dict, flags] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getDict(),
    getFeatureFlags(),
  ]);
  return (
    <>
      <ScrollProgress />
      <Nav
        user={user ? { name: user.name, role: user.role } : null}
        locale={locale}
        dict={dict.nav}
        flags={flags}
      />
      <main className="flex-1">{children}</main>
      <Footer flags={flags} />
      {flags.aiChat && <ChatWidget dict={dict.chat} locale={locale} />}
    </>
  );
}
