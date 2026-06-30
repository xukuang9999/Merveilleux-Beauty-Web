import type { Metadata } from "next";
import { Container } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";
import { site, whatsappLink } from "@/lib/data";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Contact & Join",
  description:
    "Get in touch with Merveilleux Beauty — product enquiries, wholesale, or apply to become a distributor.",
};

export default async function ContactPage() {
  const dict = await getDict();
  const d = dict.contact;

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow mb-3">{d.eyebrow}</p>
          <h1 className="font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl">
            {d.titleBefore}
            <span className="italic text-rose-deep">{d.titleHighlight}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mid">
            {d.body}
          </p>

          <div className="mt-10 space-y-4">
            <a
              href={whatsappLink("Hi Merveilleux Beauty, I'd like to know more.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-rose-light"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-light text-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">{d.whatsapp}</p>
                <p className="text-sm text-mid">{d.whatsappSub}</p>
              </div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-rose-light"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-light text-rose-deep">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">{d.email}</p>
                <p className="text-sm text-mid">{site.email}</p>
              </div>
            </a>
          </div>

          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold-light/40 p-5">
            <p className="text-sm text-charcoal">{d.newDistributorNote}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white/70 p-7 sm:p-9">
          <h2 className="font-serif text-2xl text-charcoal">{d.sendEnquiry}</h2>
          <p className="mt-1 mb-6 text-sm text-mid">{d.sendEnquirySub}</p>
          <EnquiryForm dict={d} />
        </div>
      </Container>
    </section>
  );
}
