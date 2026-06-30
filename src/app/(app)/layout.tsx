import DashboardShell from "@/components/DashboardShell";
import { requireUser } from "@/lib/auth";
import { getLocale, getDict } from "@/i18n/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale, dict] = await Promise.all([
    requireUser(),
    getLocale(),
    getDict(),
  ]);
  return (
    <DashboardShell
      user={{ name: user.name, role: user.role }}
      locale={locale}
      dict={dict.dashboard}
    >
      {children}
    </DashboardShell>
  );
}
