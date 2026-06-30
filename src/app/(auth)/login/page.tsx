import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser, roleHome } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(roleHome[user.role]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-mid">
        Sign in to your Merveilleux account.
      </p>
      <AuthForm mode="login" />

      <div className="mt-6 rounded-xl border border-line bg-cream p-3 text-xs text-mid">
        <p className="font-medium text-charcoal">Demo accounts</p>
        <p className="mt-1">admin@merveilleux.test · admin1234</p>
        <p>distributor@merveilleux.test · dist1234</p>
        <p>customer@merveilleux.test · cust1234</p>
      </div>
    </div>
  );
}
