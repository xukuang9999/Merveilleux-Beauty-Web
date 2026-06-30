import DashboardShell from "@/components/DashboardShell";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <DashboardShell user={{ name: user.name, role: user.role }}>
      {children}
    </DashboardShell>
  );
}
