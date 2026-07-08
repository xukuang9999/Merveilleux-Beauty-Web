import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollProgress from "@/components/ScrollProgress";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getDict } from "@/i18n/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale, dict] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getDict(),
  ]);
  return (
    <>
      <ScrollProgress />
      <Nav
        user={user ? { name: user.name, role: user.role } : null}
        locale={locale}
        dict={dict.nav}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget dict={dict.chat} />
    </>
  );
}
