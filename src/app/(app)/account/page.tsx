import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { getProducts } from "@/lib/content";
import { DashHeading, Panel } from "@/components/dash";

export default async function AccountPage() {
  const user = await requireUser();
  const products = (await getProducts()).slice(0, 4);

  return (
    <>
      <DashHeading
        eyebrow="Your account"
        title={`Bonjour, ${user.name.split(" ")[0]}`}
        subtitle="Your personal beauty space — get tailored skincare advice from Margaux any time."
      />

      {user.status === "pending" && (
        <div className="mb-5 rounded-2xl border border-amber/30 bg-amber-light/50 p-4 text-sm text-charcoal">
          <span className="font-medium text-amber">
            经销商 application received.
          </span>{" "}
          An admin will review and activate your distributor portal soon — you&apos;ll
          get full training, knowledge base and AI coach access once approved.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Panel className="bg-gradient-to-br from-rose-light/40 to-gold-light/40">
          <p className="eyebrow mb-2">AI Skincare Consultation</p>
          <h2 className="font-serif text-2xl text-charcoal">
            Not sure where to start?
          </h2>
          <p className="mt-2 text-sm text-mid">
            Tell Margaux your skin type and concerns and get a tailored
            Merveilleux routine — step by step, with the why behind each product.
          </p>
          <Link
            href="/account/consult"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-plum"
          >
            Start a consultation →
          </Link>
        </Panel>

        <Panel title="Become a 经销商?">
          <p className="text-sm text-mid">
            Love the products? Turn your passion into a business with full
            training, a knowledge base and AI support.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm font-medium text-rose-deep underline"
          >
            Enquire about joining
          </Link>
        </Panel>
      </div>

      <Panel title="Explore the collection" className="mt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products#${p.slug}`}
              className="group rounded-xl border border-line p-3 transition-colors hover:border-rose-light"
            >
              <div className="overflow-hidden rounded-lg bg-gradient-to-b from-cream to-rose-light/30">
                <Image
                  src={p.graphic}
                  alt={p.name}
                  width={150}
                  height={180}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-charcoal">{p.name}</p>
              <p className="text-xs text-mid">{p.priceRM}</p>
            </Link>
          ))}
        </div>
      </Panel>
    </>
  );
}
