import ConceptImageNotice from "@/components/ConceptImageNotice";
import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { getProducts } from "@/lib/content";
import { DashHeading, Panel } from "@/components/dash";
import { getDict, fmt } from "@/i18n/server";

export default async function AccountPage() {
  const [user, products, dict] = await Promise.all([
    requireUser(),
    getProducts().then((p) => p.slice(0, 4)),
    getDict(),
  ]);
  const d = dict.account;

  return (
    <>
      <DashHeading
        eyebrow={dict.nav.myAccount}
        title={fmt(d.greeting, { name: user.name.split(" ")[0] })}
        subtitle={d.sub}
      />

      {user.status === "pending" && (
        <div className="mb-5 rounded-2xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
          {d.pendingNote}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Panel className="bg-gradient-to-br from-champagne/40 to-gold-light/40">
          <p className="eyebrow mb-2">{d.consultEyebrow}</p>
          <h2 className="font-serif text-2xl text-charcoal">{d.consultTitle}</h2>
          <p className="mt-2 text-sm text-mid">{d.consultBody}</p>
          <Link
            href="/account/consult"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-umber"
          >
            {d.startConsult}
          </Link>
        </Panel>

        <Panel title={d.becomeDistTitle}>
          <p className="text-sm text-mid">{d.becomeDistBody}</p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm font-medium text-bronze underline"
          >
            {d.enquireJoin}
          </Link>
        </Panel>
      </div>

      <Panel title={d.exploreTitle} className="mt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products#${p.slug}`}
              className="group rounded-xl border border-line p-3 transition-colors hover:border-champagne"
            >
              <div className="overflow-hidden rounded-lg bg-gradient-to-b from-cream to-champagne/30">
                <Image
                  src={p.graphic}
                  alt={p.name}
                  width={150}
                  height={180}
                  className="h-auto w-full"
                />
              </div>
              <ConceptImageNotice graphic={p.graphic} label={dict.products.conceptImage} />
              <p className="mt-2 text-sm font-medium text-charcoal">{p.name}</p>
              <p className="text-xs text-mid">{p.priceRM}</p>
            </Link>
          ))}
        </div>
      </Panel>
    </>
  );
}
