import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser, roleHome } from "@/lib/auth";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(roleHome[user.role]);

  const { as } = await searchParams;
  const asDistributor = as === "distributor";

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">
        {asDistributor ? "Join as a 经销商" : "Create your account"}
      </h1>
      <p className="mb-6 mt-1 text-sm text-mid">
        {asDistributor
          ? "Register to access training, the knowledge base and your AI coach."
          : "Create an account for personalised skincare guidance."}
      </p>
      <AuthForm
        mode="register"
        defaultRole={asDistributor ? "distributor" : "customer"}
      />
    </div>
  );
}
