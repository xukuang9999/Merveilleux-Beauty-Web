import DashboardShell from "@/components/DashboardShell";
import { requireUser } from "@/lib/auth";
import { getFeatureFlags } from "@/lib/settings";
import { getLocale, getDict } from "@/i18n/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale, dict, flags] = await Promise.all([
    requireUser(),
    getLocale(),
    getDict(),
    getFeatureFlags(),
  ]);
  return (
    <DashboardShell
      user={{ name: user.name, role: user.role }}
      locale={locale}
      dict={dict.dashboard}
      bahasaMelayu={flags.bahasaMelayu}
    >
      {children}
    </DashboardShell>
  );
}
