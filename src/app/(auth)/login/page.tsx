import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser, roleHome } from "@/lib/auth";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(roleHome[user.role]);
  const d = (await getDict()).auth;

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">{d.welcomeBack}</h1>
      <p className="mb-6 mt-1 text-sm text-mid">{d.welcomeSub}</p>
      <AuthForm mode="login" dict={d} />

      <div className="mt-6 rounded-xl border border-line bg-cream p-3 text-xs text-mid">
        <p className="font-medium text-charcoal">{d.demoAccounts}</p>
        <p className="mt-1">admin@merveilleux.test · admin1234</p>
        <p>distributor@merveilleux.test · dist1234</p>
        <p>customer@merveilleux.test · cust1234</p>
      </div>
    </div>
  );
}
