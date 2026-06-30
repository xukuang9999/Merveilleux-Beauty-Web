import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <>
      <Nav user={user ? { name: user.name, role: user.role } : null} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
