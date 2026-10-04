import { localizedPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser, roleHome } from "@/lib/auth";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata("register");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(roleHome[user.role]);

  const { as } = await searchParams;
  const asDistributor = as === "distributor";
  const d = (await getDict()).auth;

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">
        {asDistributor ? d.joinTitle : d.createTitle}
      </h1>
      <p className="mb-6 mt-1 text-sm text-mid">
        {asDistributor ? d.joinSub : d.createSub}
      </p>
      <AuthForm
        mode="register"
        defaultRole={asDistributor ? "distributor" : "customer"}
        dict={d}
      />
    </div>
  );
}
