import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser, roleHome } from "@/lib/auth";
import { getDict } from "@/i18n/server";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return localizedPageMetadata("login");
}

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(roleHome[user.role]);
  const d = (await getDict()).auth;

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">{d.welcomeBack}</h1>
      <p className="mb-6 mt-1 text-sm text-mid">{d.welcomeSub}</p>
      <AuthForm mode="login" dict={d} />

    </div>
  );
}
