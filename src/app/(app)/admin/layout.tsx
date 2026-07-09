import { requireAdmin } from "@/lib/auth";

// Group-level gate for the whole /admin console: both admin tiers may enter.
// Master-only sub-pages (e.g. /admin/users) enforce requireMasterAdmin()
// themselves on top of this.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
